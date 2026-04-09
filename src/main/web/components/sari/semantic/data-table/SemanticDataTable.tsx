/**
 * ResearchSpace
 * Copyright (C) 2026, © Kartography Community Interest Company
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { Props, createElement } from 'react';
import * as D from 'react-dom-factories';
import * as classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import * as maybe from 'data.maybe';

import { Cancellation } from 'platform/api/async';
import { Component, ComponentContext, ComponentProps } from 'platform/api/components';
import { BuiltInEvents, trigger } from 'platform/api/events';
import { SparqlClient, SparqlUtil } from 'platform/api/sparql';

import { ErrorNotification } from 'platform/components/ui/notification';
import { Spinner } from 'platform/components/ui/spinner';
import { TemplateItem } from 'platform/components/ui/template';
import { ControlledPropsHandler } from 'platform/components/utils';

import { DataTable, DataTableColumnConfiguration, DataTableOptions } from './DataTable';

interface ControlledProps {
  readonly currentPage?: number;
}

interface TableState {
  data?: SparqlClient.SparqlSelectResult;
  isLoading?: boolean;
  currentPage?: number;
  error?: any;
}

interface BaseConfig extends ControlledProps {
  query: string;
  className?: string;
  numberOfDisplayedRows?: number;
  noResultTemplate?: string;
  options?: DataTableOptions;
  id?: string;
  showLabels?: boolean;
  prefetchLabels?: boolean;
  showLiteralDatatype?: boolean;
  linkParams?: {};
}

interface ColumnConfig extends BaseConfig {
  columnConfiguration: Array<DataTableColumnConfiguration>;
}

interface RowConfig extends BaseConfig {
  tupleTemplate: string;
}

function isRowConfig(config: SemanticDataTableConfig): config is RowConfig {
  return _.has(config, 'tupleTemplate');
}

export type SemanticDataTableConfig = BaseConfig | ColumnConfig | RowConfig;
export type SemanticDataTableProps = SemanticDataTableConfig &
  ControlledPropsHandler<ControlledProps> &
  ComponentProps &
  Props<SemanticDataTable>;

export class SemanticDataTable extends Component<SemanticDataTableProps, TableState> {
  static propTypes: Partial<Record<keyof SemanticDataTableProps, any>> = {
    ...Component.propTypes,
    onControlledPropChange: PropTypes.func,
  };

  private readonly cancellation = new Cancellation();
  private querying = this.cancellation.derive();

  constructor(props: SemanticDataTableProps, context: ComponentContext) {
    super(props, context);
    this.state = {
      isLoading: true,
      currentPage: props.currentPage ? props.currentPage : 0,
    };
  }

  public shouldComponentUpdate(nextProps: SemanticDataTableProps, nextState: TableState) {
    return nextState.isLoading !== this.state.isLoading || !_.isEqual(nextProps, this.props);
  }

  public componentWillReceiveProps(nextProps: SemanticDataTableProps, context: ComponentContext) {
    if (nextProps.query !== this.props.query) {
      this.prepareConfigAndExecuteQuery({ ...nextProps, currentPage: 0 }, context);
    }
  }

  public componentDidMount() {
    this.prepareConfigAndExecuteQuery(this.props, this.context);
  }

  public componentWillUnmount() {
    this.cancellation.cancelAll();
  }

  public render() {
    if (this.state.error) {
      return createElement(ErrorNotification, { errorMessage: this.state.error });
    }

    return D.div(
      {
        className: classNames(this.props.className, 'semantic-data-table-holder'),
      },
      this.state.isLoading
        ? createElement(Spinner)
        : this.state.data && !SparqlUtil.isSelectResultEmpty(this.state.data)
        ? this.renderTable()
        : createElement(TemplateItem, { template: { source: this.props.noResultTemplate } })
    );
  }

  private renderTable() {
    const { onControlledPropChange, ...otherProps } = this.props;
    return createElement(DataTable, {
      ...otherProps,
      context: this.context,
      tupleTemplate: maybe.fromNullable(isRowConfig(this.props) ? this.props.tupleTemplate : null).getOrElse(undefined),
      currentPage: this.state.currentPage,
      onPageChange: onControlledPropChange
        ? (page) => {
            this.setState({ currentPage: page });
            onControlledPropChange({ currentPage: page });
          }
        : undefined,
      data: this.state.data,
    });
  }

  private prepareConfigAndExecuteQuery = (props: SemanticDataTableProps, context: ComponentContext) => {
    this.setState({
      isLoading: true,
      error: undefined,
      currentPage: props.currentPage,
    });
    this.querying = this.cancellation.deriveAndCancel(this.querying);
    const loading = this.querying
      .map(SparqlClient.select(props.query, { context: context.semanticContext }))
      .onValue((res) => this.setState({ data: res, isLoading: false }))
      .onError((error) => this.setState({ isLoading: false, error }))
      .onEnd(() => {
        if (this.props.id) {
          trigger({ eventType: BuiltInEvents.ComponentLoaded, source: this.props.id });
        }
      });
    if (this.props.id) {
      trigger({
        eventType: BuiltInEvents.ComponentLoading,
        source: this.props.id,
        data: loading,
      });
    }
  };
}

export default SemanticDataTable;
