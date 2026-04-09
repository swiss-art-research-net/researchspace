/**
 * ResearchSpace
 * Copyright (C) 2026, © Kartography Community Interest Company
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import * as React from 'react';
import * as _ from 'lodash';
import * as Immutable from 'immutable';
import * as Kefir from 'kefir';
import {
  useExpanded,
  useFilters,
  useGlobalFilter,
  useGroupBy,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import { Cancellation } from 'platform/api/async';
import { ComponentContext } from 'platform/api/components';
import { Rdf } from 'platform/api/rdf';
import { getLabels } from 'platform/api/services/resource-label';
import { SparqlClient } from 'platform/api/sparql';

import { ErrorNotification } from 'platform/components/ui/notification';
import { Spinner } from 'platform/components/ui/spinner';
import { TemplateItem } from 'platform/components/ui/template';

import { RdfValueDisplay } from '../table/RdfValueDisplay';

import { Pagination } from './Pagination';
import {
  AggregateType,
  aggregateValues,
  cellMatchesQuery,
  compareCellValues,
  getNumericValue,
  isPrimitiveDatatype,
  makeUniqueColumnNameGenerator,
  toScalarValue,
} from './utils';

import './DataTable.scss';

export type ColumnFilterConfigurationType = 'default' | 'select' | 'multiselect' | 'number';

export interface GroupingOptions {
  groupedBy?: string[];
  defaultAggregation?: AggregateType;
  defaultAggregationCellTemplate?: string;
  expandByDefault?: boolean;
  showOnlyAggregatedValue?: boolean;
}

export interface DataTableOptions {
  showFilter?: boolean;
  showTableHeading?: boolean;
  enableSort?: boolean;
  enableGrouping?: boolean;
  groupingOptions?: GroupingOptions;
  defaultCellTemplate?: string;
  showColumnFilters?: boolean;
}

export interface DataTableColumnConfiguration {
  displayName?: string;
  variableName?: string;
  cellTemplate?: string;
  aggregation?: AggregateType;
  aggregationCellTemplate?: string;
  showFilter?: boolean;
  filterType?: ColumnFilterConfigurationType;
  visible?: boolean;
  id?: string;
}

export interface DataTableProps {
  context: ComponentContext;
  data: SparqlClient.SparqlSelectResult | ReadonlyArray<any>;
  columnConfiguration?: ReadonlyArray<DataTableColumnConfiguration>;
  numberOfDisplayedRows?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  tupleTemplate?: string;
  options?: DataTableOptions;
  showLabels?: boolean;
  prefetchLabels?: boolean;
  showLiteralDatatype?: boolean;
  linkParams?: {};
  showCopyToClipboardButton?: boolean;
}

interface RenderingState {
  context: ComponentContext;
  showLabels: boolean;
  prefetchLabels: boolean;
  getLabel(resource: Rdf.Iri): string | undefined;
}

type TableRow = { [key: string]: any };

const DEFAULT_ROWS_PER_PAGE = 10;

export function DataTable(props: DataTableProps) {
  const cancellation = React.useMemo(() => new Cancellation(), []);
  React.useEffect(() => () => cancellation.cancelAll(), [cancellation]);

  const [bufferVersion, setBufferVersion] = React.useState(0);
  const buffer = React.useMemo(
    () =>
      new KeyedBufferPool<Rdf.Iri, string>(
        Immutable.Map(),
        cancellation,
        (keys) => getLabels(keys.toArray(), { context: props.context.semanticContext }),
        () => setBufferVersion((version) => version + 1)
      ),
    [cancellation, props.context.semanticContext]
  );

  const showLabels = props.showLabels !== undefined ? props.showLabels : true;
  const prefetchLabels = props.prefetchLabels !== undefined ? props.prefetchLabels : true;
  const renderingState = React.useMemo<RenderingState>(
    () => ({
      context: props.context,
      showLabels,
      prefetchLabels,
      getLabel: (resourceIri: Rdf.Iri) => (showLabels && prefetchLabels ? buffer.result.get(resourceIri) : undefined),
    }),
    [props.context, showLabels, prefetchLabels, buffer.result.size, bufferVersion]
  );

  const sourceRows = React.useMemo(() => prepareRows(props.data, props.columnConfiguration), [props.data, props.columnConfiguration]);
  const options = props.options || {};
  const enableGrouping = Boolean(options.enableGrouping || options.groupingOptions?.groupedBy?.length);
  const enableExpansion = !options.groupingOptions?.showOnlyAggregatedValue;
  const enableSort = options.enableSort !== false;
  const enableGlobalFilter = options.showFilter !== false;
  const enableColumnFilters = Boolean(options.showColumnFilters || props.columnConfiguration?.some((column) => column.showFilter));

  const columns = React.useMemo(() => {
    return buildColumns(props, sourceRows, renderingState, { enableGrouping, enableSort, enableColumnFilters });
  }, [props.columnConfiguration, props.options, props.showLiteralDatatype, props.linkParams, props.showCopyToClipboardButton, props.tupleTemplate, sourceRows, renderingState, enableGrouping, enableSort, enableColumnFilters]);

  React.useEffect(() => {
    if (!prefetchLabels) {
      return;
    }
    const targets = findReferencedResources(sourceRows, columns, buffer.targets);
    buffer.load(targets);
  }, [sourceRows, columns, buffer, prefetchLabels]);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultTextFilter,
      filter: FILTER_TYPE_TEXT,
    }),
    []
  );

  const filterTypes = React.useMemo(
    () => ({
      [FILTER_TYPE_TEXT]: (rows, id, filterValue) =>
        rows.filter((row) => cellMatchesQuery(row.values[id], String(filterValue ?? ''), renderingState.getLabel)),
      [FILTER_TYPE_SELECT]: (rows, id, filterValue) =>
        !filterValue ? rows : rows.filter((row) => toScalarValue(row.values[id], renderingState.getLabel) === filterValue),
      [FILTER_TYPE_MULTISELECT]: (rows, id, filterValue: string[]) =>
        !filterValue || filterValue.length === 0
          ? rows
          : rows.filter((row) => filterValue.indexOf(toScalarValue(row.values[id], renderingState.getLabel)) >= 0),
      [FILTER_TYPE_NUMBER]: (rows, id, filterValue) => {
        if (!filterValue) {
          return rows;
        }
        const [min, max] = filterValue as [string | undefined, string | undefined];
        return rows.filter((row) => {
          const numeric = getNumericValue(row.values[id]);
          if (numeric === undefined) {
            return false;
          }
          if (min !== undefined && min !== '' && numeric < Number(min)) {
            return false;
          }
          if (max !== undefined && max !== '' && numeric > Number(max)) {
            return false;
          }
          return true;
        });
      },
      globalText: (rows, _ids, filterValue) => {
        const query = String(filterValue ?? '').trim();
        if (!query) {
          return rows;
        }
        return rows.filter((row) => {
          const source = row.original || row.values;
          if (typeof source !== 'object' || source === null) {
            return false;
          }
          for (const key in source) {
            if (!Object.hasOwnProperty.call(source, key)) {
              continue;
            }
            if (cellMatchesQuery(source[key], query, renderingState.getLabel)) {
              return true;
            }
          }
          return false;
        });
      },
    }),
    [renderingState]
  );

  const initialState: any = {
    pageIndex: props.currentPage || 0,
    pageSize: props.numberOfDisplayedRows || DEFAULT_ROWS_PER_PAGE,
    hiddenColumns: columns.filter((column: any) => column.visible === false).map((column: any) => column.id),
  };

  if (enableGrouping && options.groupingOptions?.groupedBy?.length) {
    initialState.groupBy = options.groupingOptions.groupedBy;
  }

  const instance = useTable(
    {
      columns: columns as any,
      data: sourceRows as any,
      defaultColumn,
      filterTypes: filterTypes as any,
      globalFilter: 'globalText',
      initialState,
      autoResetPage: false,
      autoResetGroupBy: false,
      autoResetExpanded: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
    } as any,
    enableGlobalFilter ? useGlobalFilter : identityHook,
    enableColumnFilters ? useFilters : identityHook,
    enableGrouping ? useGroupBy : identityHook,
    enableSort ? useSortBy : identityHook,
    enableGrouping && enableExpansion ? useExpanded : identityHook,
    usePagination
  ) as any;

  React.useEffect(() => {
    if (typeof props.currentPage === 'number' && props.currentPage !== instance.state.pageIndex) {
      instance.gotoPage(props.currentPage);
    }
  }, [props.currentPage, instance.state.pageIndex]);

  React.useEffect(() => {
    if (enableGrouping && enableExpansion && options.groupingOptions?.expandByDefault) {
      instance.toggleAllRowsExpanded(true);
    }
  }, [enableGrouping, enableExpansion, options.groupingOptions?.expandByDefault]);

  React.useEffect(() => {
    if (props.onPageChange && instance.state.pageIndex !== props.currentPage) {
      props.onPageChange(instance.state.pageIndex);
    }
  }, [instance.state.pageIndex]);

  if (buffer.loading) {
    return <Spinner />;
  }
  if (buffer.error) {
    return <ErrorNotification errorMessage={buffer.error as any} />;
  }

  const showHeading = options.showTableHeading !== false;
  const showColumnFilterRow = enableColumnFilters && instance.headerGroups.some((group) => group.headers.some((header) => !header.disableFilters));

  return (
    <div className="semantic-data-table-widget-holder">
      {enableGlobalFilter ? (
        <div className="semantic-data-table__toolbar">
          <input
            className="form-control"
            type="search"
            value={instance.state.globalFilter || ''}
            onChange={(event) => instance.setGlobalFilter(event.target.value || undefined)}
            placeholder="Filter table"
          />
        </div>
      ) : null}
      <table {...instance.getTableProps()} className="table semantic-data-table">
        {showHeading ? (
          <thead>
            {instance.headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(enableSort ? column.getSortByToggleProps?.() : undefined)}
                    key={column.id}
                    className={column.canGroupBy ? 'semantic-data-table__header semantic-data-table__header--groupable' : 'semantic-data-table__header'}
                  >
                    <div className="semantic-data-table__header-content">
                      <span>{column.render('Header')}</span>
                      {column.isSorted ? <span>{column.isSortedDesc ? ' ▼' : ' ▲'}</span> : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
            {showColumnFilterRow ? (
              <tr>
                {instance.headerGroups[0].headers.map((column) => (
                  <th key={`${column.id}-filter`} className="semantic-data-table__filter-cell">
                    {column.canFilter && !column.disableFilters ? column.render('Filter') : null}
                  </th>
                ))}
              </tr>
            ) : null}
          </thead>
        ) : null}
        <tbody {...instance.getTableBodyProps()}>
          {instance.page.map((row) => {
            instance.prepareRow(row);

            if (props.tupleTemplate && !row.isGrouped) {
              return (
                <tr {...row.getRowProps()} key={row.getRowProps().key}>
                  <td colSpan={row.cells.length || 1} className="semantic-data-table__tuple-row">
                    <TemplateItem
                      template={{
                        source: props.tupleTemplate,
                        options: row.original,
                      }}
                    />
                  </td>
                </tr>
              );
            }

            return (
              <tr {...row.getRowProps()} key={row.getRowProps().key}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.getCellProps().key}>
                    {renderCell(cell, row, renderingState, enableExpansion)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        pageIndex={instance.state.pageIndex}
        pageCount={instance.pageCount}
        canPreviousPage={instance.canPreviousPage}
        canNextPage={instance.canNextPage}
        gotoPage={instance.gotoPage}
        previousPage={instance.previousPage}
        nextPage={instance.nextPage}
      />
    </div>
  );
}

const FILTER_TYPE_TEXT = 'dataTableText';
const FILTER_TYPE_SELECT = 'dataTableSelect';
const FILTER_TYPE_MULTISELECT = 'dataTableMultiSelect';
const FILTER_TYPE_NUMBER = 'dataTableNumber';

function renderCell(cell: any, row: any, renderingState: RenderingState, enableExpansion: boolean) {
  if (cell.isGrouped) {
    const toggleProps = enableExpansion ? row.getToggleRowExpandedProps() : {};
    return (
      <span className="semantic-data-table__grouped-cell">
        {enableExpansion ? (
          <button type="button" className="btn btn-link btn-xs" {...toggleProps}>
            {row.isExpanded ? '-' : '+'}
          </button>
        ) : null}
        {cell.render('Cell')} <span className="text-muted">({row.subRows.length})</span>
      </span>
    );
  }
  if (cell.isAggregated) {
    return cell.render('Aggregated');
  }
  if (cell.isPlaceholder) {
    return null;
  }
  return cell.render('Cell');
}

function buildColumns(
  props: DataTableProps,
  rows: ReadonlyArray<TableRow>,
  renderingState: RenderingState,
  options: { enableGrouping: boolean; enableSort: boolean; enableColumnFilters: boolean }
) {
  const ensureUniqueColumnName = makeUniqueColumnNameGenerator();
  const vars = isArrayTableData(props.data)
    ? _.reduce(props.data, (union, obj) => _.union(union, Object.keys(obj)), [])
    : props.data.head.vars;

  if (_.isEmpty(props.columnConfiguration)) {
    return vars.map((varName: string, index: number) =>
      buildColumn(
        {
          variableName: varName,
          displayName: varName,
        },
        index,
        ensureUniqueColumnName,
        props,
        rows,
        renderingState,
        options
      )
    );
  }

  return props.columnConfiguration.map((column, index) =>
    buildColumn(column, index, ensureUniqueColumnName, props, rows, renderingState, options)
  );
}

function buildColumn(
  columnConfig: DataTableColumnConfiguration,
  index: number,
  ensureUniqueColumnName: (baseName: string) => string,
  props: DataTableProps,
  rows: ReadonlyArray<TableRow>,
  renderingState: RenderingState,
  options: { enableGrouping: boolean; enableSort: boolean; enableColumnFilters: boolean }
) {
  const baseName = columnConfig.id || columnConfig.variableName || 'mp-custom-column';
  const columnId = ensureUniqueColumnName(baseName);
  const accessor = columnConfig.variableName || columnId;
  const aggregate = columnConfig.aggregation || props.options?.groupingOptions?.defaultAggregation;
  const aggregationTemplate =
    columnConfig.aggregationCellTemplate || props.options?.groupingOptions?.defaultAggregationCellTemplate;

  const column: any = {
    Header: columnConfig.displayName || columnConfig.variableName || columnId,
    id: columnId,
    accessor,
    visible: columnConfig.visible !== false,
    sortType: (rowA, rowB, id) => compareCellValues(rowA.values[id], rowB.values[id], renderingState.getLabel),
    Cell: makeCellRenderer(columnConfig.cellTemplate || props.options?.defaultCellTemplate, props, renderingState),
    disableSortBy: !options.enableSort,
  };

  if (options.enableGrouping) {
    column.aggregate = (values) => aggregateValues(aggregate, values, renderingState.getLabel);
    column.Aggregated = makeAggregatedRenderer(aggregate, aggregationTemplate, props, renderingState);
    column.disableGroupBy = !(props.options?.enableGrouping);
  }

  if (options.enableColumnFilters && (columnConfig.showFilter || props.options?.showColumnFilters)) {
    const filterType = columnConfig.filterType || inferFilterType(rows.map((row) => row[accessor]));
    column.Filter = makeColumnFilter(filterType);
    column.filter = mapFilterType(filterType);
  } else if (options.enableColumnFilters) {
    column.disableFilters = true;
  }

  return column;
}

function makeCellRenderer(template: string | undefined, props: DataTableProps, renderingState: RenderingState) {
  return ({ value, row }) => {
    if (template) {
      return (
        <TemplateItem
          template={{
            source: template,
            options: {
              ...row.original,
              cellValue: value,
            },
          }}
        />
      );
    }
    if (isPrimitiveDatatype(value)) {
      return <span>{value as any}</span>;
    }
    if (value instanceof Rdf.Node) {
      return (
        <RdfValueDisplay
          data={value}
          label={renderingState.getLabel(value as Rdf.Iri)}
          fetchLabel={renderingState.showLabels && !renderingState.prefetchLabels}
          fetchContext={renderingState.context.semanticContext}
          showLiteralDatatype={props.showLiteralDatatype}
          linkParams={props.linkParams}
          showCopyToClipboardButton={props.showCopyToClipboardButton}
        />
      );
    }
    return <span>{String(value ?? '')}</span>;
  };
}

function makeAggregatedRenderer(
  aggregate: AggregateType | undefined,
  template: string | undefined,
  props: DataTableProps,
  renderingState: RenderingState
) {
  return ({ value, row }) => {
    if (template) {
      return (
        <TemplateItem
          template={{
            source: template,
            options: {
              value,
              rows: row.subRows.map((subRow) => subRow.original),
            },
          }}
        />
      );
    }

    if (Array.isArray(value)) {
      return (
        <span>
          {value.map((item, index) => (
            <span key={index}>
              {index > 0 ? ', ' : null}
              {renderAggregatedValue(item, aggregate, props, renderingState)}
            </span>
          ))}
        </span>
      );
    }
    return renderAggregatedValue(value, aggregate, props, renderingState);
  };
}

function renderAggregatedValue(
  value: unknown,
  aggregate: AggregateType | undefined,
  props: DataTableProps,
  renderingState: RenderingState
) {
  if (isPrimitiveDatatype(value)) {
    if (typeof value === 'number') {
      if (aggregate === 'count' || aggregate === 'uniqueCount' || aggregate === 'default' || aggregate === undefined) {
        return <span>{value} value{value === 1 ? '' : 's'}</span>;
      }
      return <span>{value}</span>;
    }
    return <span>{String(value ?? '')}</span>;
  }
  if (value instanceof Rdf.Node) {
    return (
      <RdfValueDisplay
        data={value}
        label={renderingState.getLabel(value as Rdf.Iri)}
        fetchLabel={renderingState.showLabels && !renderingState.prefetchLabels}
        fetchContext={renderingState.context.semanticContext}
        showLiteralDatatype={props.showLiteralDatatype}
        linkParams={props.linkParams}
        showCopyToClipboardButton={props.showCopyToClipboardButton}
      />
    );
  }
  return <span>{String(value ?? '')}</span>;
}

function inferFilterType(values: unknown[]): ColumnFilterConfigurationType {
  const sample = values.find((value) => value !== null && value !== undefined);
  if (sample === undefined) {
    return 'default';
  }
  if (typeof sample === 'number' || sample instanceof Rdf.Literal) {
    return 'number';
  }
  const uniqueCount = new Set(values.map((value) => String(value ?? ''))).size;
  if (uniqueCount <= 2) {
    return 'select';
  }
  if (uniqueCount <= Math.max(10, Math.floor(values.length * 0.45))) {
    return 'multiselect';
  }
  return 'default';
}

function mapFilterType(filterType: ColumnFilterConfigurationType) {
  if (filterType === 'select') {
    return FILTER_TYPE_SELECT;
  }
  if (filterType === 'multiselect') {
    return FILTER_TYPE_MULTISELECT;
  }
  if (filterType === 'number') {
    return FILTER_TYPE_NUMBER;
  }
  return FILTER_TYPE_TEXT;
}

function makeColumnFilter(filterType: ColumnFilterConfigurationType) {
  if (filterType === 'select') {
    return SelectFilter;
  }
  if (filterType === 'multiselect') {
    return MultiSelectFilter;
  }
  if (filterType === 'number') {
    return NumberRangeFilter;
  }
  return DefaultTextFilter;
}

function DefaultTextFilter({ column: { filterValue, setFilter } }) {
  return (
    <input
      className="form-control input-sm"
      value={filterValue || ''}
      onChange={(event) => setFilter(event.target.value || undefined)}
      placeholder="Filter"
    />
  );
}

function SelectFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
  const options = React.useMemo(() => {
    const values = new Set<string>();
    preFilteredRows.forEach((row) => values.add(String(row.values[id] ?? '')));
    return Array.from(values).sort();
  }, [id, preFilteredRows]);

  return (
    <select className="form-control input-sm" value={filterValue || ''} onChange={(event) => setFilter(event.target.value || undefined)}>
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function MultiSelectFilter({ column: { filterValue = [], setFilter, preFilteredRows, id } }) {
  const options = React.useMemo(() => {
    const values = new Set<string>();
    preFilteredRows.forEach((row) => values.add(String(row.values[id] ?? '')));
    return Array.from(values).sort();
  }, [id, preFilteredRows]);

  return (
    <select
      className="form-control input-sm"
      multiple
      value={filterValue}
      onChange={(event) => {
        const selected = Array.from(event.target.selectedOptions).map((option) => option.value);
        setFilter(selected.length > 0 ? selected : undefined);
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function NumberRangeFilter({ column: { filterValue = [], setFilter } }) {
  return (
    <div className="semantic-data-table__number-filter">
      <input
        className="form-control input-sm"
        type="number"
        value={filterValue[0] || ''}
        onChange={(event) => setFilter([event.target.value || undefined, filterValue[1]])}
        placeholder="Min"
      />
      <input
        className="form-control input-sm"
        type="number"
        value={filterValue[1] || ''}
        onChange={(event) => setFilter([filterValue[0], event.target.value || undefined])}
        placeholder="Max"
      />
    </div>
  );
}

function prepareRows(data: SparqlClient.SparqlSelectResult | ReadonlyArray<any>, columnConfiguration?: ReadonlyArray<DataTableColumnConfiguration>) {
  if (isArrayTableData(data)) {
    return data.map((row) => ({ ...row }));
  }

  return data.results.bindings.map((binding, index) => {
    const row = { ...binding } as TableRow;
    row.__semanticTableIndex = Rdf.literal(index.toString());
    row.__semanticTableSize = Rdf.literal(data.results.bindings.length.toString());

    (columnConfiguration || []).forEach((column) => {
      if (!column.variableName) {
        return;
      }
      if (!(column.variableName in row)) {
        row[column.variableName] = undefined;
      }
    });

    return row;
  });
}

function isArrayTableData(data: SparqlClient.SparqlSelectResult | ReadonlyArray<any>): data is ReadonlyArray<any> {
  return Array.isArray(data);
}

function findReferencedResources(
  rows: ReadonlyArray<TableRow>,
  columns: ReadonlyArray<any>,
  alreadyFetching: Immutable.Set<Rdf.Iri>
) {
  return Immutable.Set<Rdf.Iri>().withMutations((set) => {
    rows.forEach((row) => {
      columns.forEach((column) => {
        const value = row[column.accessor];
        if (value instanceof Rdf.Iri && !alreadyFetching.has(value)) {
          set.add(value);
        }
      });
    });
  });
}

function identityHook(hooks) {
  return hooks;
}

class KeyedBufferPool<K, V> {
  private activeCount = 0;
  private _targets: Immutable.Set<K>;
  private _result: Immutable.Map<K, V>;
  private _error: unknown;

  constructor(
    initialValue: Immutable.Map<K, V>,
    private cancellation: Cancellation,
    private onLoad: (keys: Immutable.Set<K>) => Kefir.Property<Immutable.Map<K, V>>,
    private onCompleted: () => void
  ) {
    this._targets = initialValue.keySeq().toSet();
    this._result = initialValue;
  }

  get targets() {
    return this._targets;
  }

  get result() {
    return this._result;
  }

  get error() {
    return this._error;
  }

  get loading() {
    return this.activeCount > 0;
  }

  load(keys: Immutable.Set<K>): void {
    if (keys.size === 0) {
      return;
    }
    this.activeCount++;
    this._targets = this._targets.merge(keys);
    this.cancellation.map(this.onLoad(keys)).observe({
      value: (value) => {
        this._result = this._result.merge(value);
      },
      error: (error) => {
        this._error = error;
      },
      end: () => {
        this.activeCount--;
        if (this.activeCount === 0 && !this.cancellation.aborted) {
          this.onCompleted();
        }
      },
    });
  }
}
