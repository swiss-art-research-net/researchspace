/**
 * ResearchSpace
 * Copyright (C) 2020, © Trustees of the British Museum
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import * as Immutable from 'immutable';
import * as Kefir from 'kefir';

import { Cancellation } from 'platform/api/async';
import { SparqlClient, SparqlUtil } from 'platform/api/sparql';
import { trigger, listen } from 'platform/api/events';

import { Component } from 'platform/api/components';
import { TemplateItem } from 'platform/components/ui/template';
import { Spinner } from 'platform/components/ui/spinner';
import { Draggable } from 'platform/components/dnd';
import { ClearableInput, ClearableInputProps } from 'platform/components/ui/inputs';
import { ErrorNotification } from 'platform/components/ui/notification';

import {
  KeyPath,
  TreeSelection,
  SelectionNode,
  Node,
  TreeNode,
  LazyTreeSelector,
  LazyTreeSelectorProps,
  SemanticTreeInput,
  ComplexTreePatterns,
  LightwightTreePatterns,
  SingleFullSubtree,
  SparqlNodeModel,
  createDefaultTreeQueries,
  KeyedForest,
  loadPath,
  expandPath,
  queryMoreChildren,
  sealLazyExpanding
} from 'platform/components/semantic/lazy-tree';

import { ItemToggleSelected, Focus, ItemSelected } from './LazyTreeEvents';

import * as styles from './LazyTree.scss';
import { Rdf } from 'platform/api/rdf';
import { node } from 'platform-tests/common/ts/components/tree-selector/Forests';

interface BaseLazyTreeProps {
  /**
   * ID for issuing component events.
   */
  id?: string;

  /**
   * How many items should be loaded for every scroll page.
   *
   * @default 50
   */
  pageSize?: number;

  /**
   * Template for node additional info.
   */
  infoTemplate?: string;

  /**
   * IRI of the element that should be focused by default.
   */
  focused?: string;

  /**
   * Placeholder string used in the input search
   */
  inputPlaceholder?: string

  /**
   * Render the item draggable
   *
   * @default true
   */
  draggable?: boolean;

  /**
   * Render a legacy inline search input that replaces the displayed tree with
   * search results instead of using the selection dropdown search.
   */
  useLegacySearch?: boolean;
}

export type LazyTreeProps =
  { type: 'simple'; config: LightwightTreePatterns } & BaseLazyTreeProps |
  { type: 'query', config: ComplexTreePatterns } & BaseLazyTreeProps;

interface State {
  patterns?: ComplexTreePatterns;
  model?: SparqlNodeModel;
  forest?: KeyedForest<Node>;
  searchQuery?: any;
  expandingToScroll?: boolean;
  expandTarget?: Node;
  highlightedPath?: KeyPath;
  searchText?: string;
  awaitingSearchResponse?: boolean;
  searchResult?: SearchResult;
  loadError?: any;
  loading?: boolean;
}

interface SearchResult {
  forest?: KeyedForest<Node>;
  error?: any;
  matchedCount?: number;
  matchLimit?: number;
}

const LEGACY_SEARCH_DELAY_MS = 300;
const LEGACY_MIN_SEARCH_TERM_LENGTH = 3;

/**
 *   <semantic-lazy-tree id='scheme-tree' input-placeholder='Select' info-template='{{> template}}' type='simple' config='{"scheme": "[[this]]"}'>
 *     <template id='template'>
 *      Some additional info or actions to show together with the node
 *    </template>
 *  </semantic-lazy-tree>
 */
export class LazyTree extends Component<LazyTreeProps, State> {
  private tree: LazyTreeSelector;
  private searchedPaths = Immutable.Set<Immutable.List<string>>();
  private expandingCancellation = Cancellation.cancelled;
  private searchCancellation = Cancellation.cancelled;
  private treeSelectionRef: SemanticTreeInput;

  static defaultProps = {
    pageSize: 50,
    draggable: true
  }

  constructor(props: LazyTreeProps, context: any) {
    super(props, context);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    try {
      const patterns =
        this.props.type === 'query' ? this.props.config :
        createDefaultTreeQueries(this.props.config);
      const model = new SparqlNodeModel({
        rootsQuery: SparqlUtil.parseQuery(patterns.rootsQuery),
        childrenQuery: SparqlUtil.parseQuery(patterns.childrenQuery),
        parentsQuery: SparqlUtil.parseQuery(patterns.parentsQuery),
        sparqlOptions: () => ({ context: this.context.semanticContext }),
        limit: this.props.pageSize,
      });
      const searchQuery = patterns.searchQuery ? SparqlUtil.parseQuery(patterns.searchQuery) : undefined;

      model.loadMoreChildren(Node.readyToLoadRoot).observe({
        value: node => {
          this.setState({
            loading: false,
            expandingToScroll: false,
            forest: KeyedForest.create(Node.keyOf, node),
            patterns,
            model,
            searchQuery,
          });
        },
        error: loadError => {
          this.setState({ loading: false, loadError });
        }
      });
    } catch (loadError) {
      this.setState({ loading: false, loadError });
    }

    if (this.props.id) {
      this.cancel.map(
        listen({
          target: this.props.id,
          eventType: Focus,
        })
      ).onValue(
        event => {
          if (this.props.useLegacySearch) {
            this.focusOnNode(event.data.iri);
            return;
          }
          if (this.treeSelectionRef) {
            this.treeSelectionRef.setValue(Rdf.iri(event.data.iri));
          }
        }
      )
    }
  }

  render() {
    if (this.state.loadError) {
      return <ErrorNotification errorMessage={this.state.loadError} />;
    } else if (this.state.loading) {
      return <div>Loading</div>;
    } else {
      return this.renderTree();
    }
  }

  renderTree() {
    const { patterns, forest, expandingToScroll, highlightedPath, searchText, searchResult, awaitingSearchResponse } = this.state;
    const { focused, config, draggable, useLegacySearch } = this.props;
    const renderedForest = this.getRenderedForest();
    
    let highlightedNodes: ReadonlyArray<Node> = [];
    if (highlightedPath) {
      const highlightTarget = renderedForest.fromKeyPath(highlightedPath);
      if (highlightTarget) {
        highlightedNodes = renderedForest.getNodePath(highlightTarget);
      }
    }
    const props: LazyTreeSelectorProps<Node> = {
      forest: renderedForest,
      isLeaf: this.isLeaf,
      childrenOf: this.childrenOf,
      renderItem: (node) => this.renderTreeNodeRow(node, highlightedNodes, draggable, useLegacySearch ? searchText : undefined),
      requestMore: this.requestMore,
      hideCheckboxes: true,
      onExpandedOrCollapsed: this.onExpandedOrCollapsed,
      isExpanded: (node) => node.expanded,
      selectionMode: SingleFullSubtree<Node>(),
      onItemToggleClick: this.onItemToggleClick,
      onItemClick: this.onItemClick,
    };

    let queryItemLabelConfig = null
    if (config && config['labelPattern']) {
      queryItemLabelConfig = `SELECT ?label WHERE {${config['labelPattern']}}`
    }
    
    return (
      <div className={styles.component}>
        {useLegacySearch ? this.renderLegacySearchField() : (
          <SemanticTreeInput
            {...patterns}
            placeholder={this.props.inputPlaceholder}
            ref={this.onSelectionReady}
            multipleSelection={false}
            onSelectionClick={this.onSearchBadgeClick}
            onSelectionChanged={this.onSearchSelectionChanged}
            initialSelection={focused && focused.length > 0 ? [Rdf.iri(focused)] : []}
            queryItemLabel={queryItemLabelConfig}
          />
        )}
        <div className={styles.alignmentTreeContainer}>
          {expandingToScroll ? this.renderExpandToScrollMessage() : null}
          {useLegacySearch && searchText && searchText.length < LEGACY_MIN_SEARCH_TERM_LENGTH ? (
            <span className={styles.searchMessage}>
              Minimum length of search term is {LEGACY_MIN_SEARCH_TERM_LENGTH} characters
            </span>
          ) : null}
          {useLegacySearch && awaitingSearchResponse ? (
            <Spinner className={styles.searchSpinner} spinnerDelay={0} messageDelay={Infinity} />
          ) : null}
          {useLegacySearch && !awaitingSearchResponse && searchResult?.error ? (
            <ErrorNotification errorMessage={searchResult.error} />
          ) : null}
          {useLegacySearch && !awaitingSearchResponse && searchResult && !searchResult.error && searchResult.matchedCount === searchResult.matchLimit ? (
            <span className={styles.searchMessage}>
              Only first {searchResult.matchedCount} matches are shown. Please refine your search.
            </span>
          ) : null}
          {useLegacySearch && !awaitingSearchResponse && searchResult && !searchResult.error &&
          (!searchResult.forest?.root.children || searchResult.forest.root.children.length === 0) ? (
            <span className={styles.searchMessage}>No results found</span>
          ) : null}
          {!useLegacySearch || !awaitingSearchResponse ? (
            <LazyTreeSelector {...props} ref={this.onTreeMount} className={styles.alignmentTree} />
          ) : null}
        </div>
      </div>
    );
  }

  private renderLegacySearchField() {
    const textFieldProps: ClearableInputProps & React.ClassAttributes<ClearableInput> = {
      className: styles.legacySearchField,
      inputClassName: styles.legacySearchInput,
      value: this.state.searchText || '',
      placeholder: this.props.inputPlaceholder,
      onChange: e => this.searchFor(e.currentTarget.value),
      onKeyDown: e => {
        if (e.keyCode === 13) {
          this.searchFor(this.state.searchText);
        }
      },
      onClear: () => this.clearSearch(),
    };
    return <ClearableInput {...textFieldProps} />;
  }

  private renderTreeNodeRow(
    node: Node,
    highlightedNodes: ReadonlyArray<Node>,
    isDraggable,
    highlightedTerm?: string
  ) {
    const decoratorsClass = this.computeDecoratorsClass(node, highlightedNodes);
    const treeNode = this.renderTreeNode(node, decoratorsClass, highlightedTerm);
    return (
      <span className={styles.alignmentNodeRow}>
        {
          isDraggable ? <Draggable iri={node.iri.value}>{treeNode}</Draggable> : <span>{treeNode}</span>
        }
        
        {this.renderNodeInfoTemplate(node)}
      </span>
    );
  }

  private renderTreeNode(node: Node, decoratorsClass: string, highlightedTerm?: string) {
    const title = node.iri.value;
    const label = Node.getLabel(node);
    const highlightIndex = highlightedTerm ? label.toLowerCase().indexOf(highlightedTerm.toLowerCase()) : -1;
    const content = highlightIndex >= 0
      ? (
        <>
          <span>{label.substring(0, highlightIndex)}</span>
          <span className={styles.highlighted}>
            {label.substring(highlightIndex, highlightIndex + highlightedTerm.length)}
          </span>
          <span>{label.substring(highlightIndex + highlightedTerm.length)}</span>
        </>
      )
      : <span>{label}</span>;
    return (
      <span className={decoratorsClass} title={title}>
        {content}
      </span>
    );
  }

  private renderNodeInfoTemplate(node: Node) {
    if (this.props.infoTemplate) {
      return <TemplateItem template={{source: this.props.infoTemplate, options: {iri: node.iri.value, label: node.label.value}}} />;
    } else {
      return null;
    }
  }

  private renderExpandToScrollMessage() {
    const { expandTarget } = this.state;
    return (
      <div className={styles.scrollNotification}>
        Scrolling to item <span className={styles.scrollToName}>{expandTarget.label.value}</span>
        <Spinner className={styles.scrollSpinner} spinnerDelay={0} messageDelay={Infinity} />
      </div>
    );
  }

  private onSelectionReady = (selectionInput?: SemanticTreeInput) => {
    if (selectionInput) {
      this.treeSelectionRef = selectionInput;
      if (this.props.focused && this.props.focused.length > 0) {
        selectionInput.setValue(Rdf.iri(this.props.focused));
      }
    }
  }

  private computeDecoratorsClass(item: Node, highlightedNodes: ReadonlyArray<Node>): string {
    const classes: string[] = [styles.decoratedNodeBody];
    
    const pathIndex = highlightedNodes.indexOf(item);
    if (pathIndex >= 0) {
      const isTarget = pathIndex === highlightedNodes.length - 1;
      classes.push(isTarget ? styles.decorateHighlightLeaf : styles.decorateHighlightParent);
    }
    return classes.join(' ');
  }

  private onTreeMount = (tree: LazyTreeSelector) => {
    this.tree = tree;
  };

  private onSearchBadgeClick = (selection: TreeSelection<Node>, target: SelectionNode<Node>) => {
    const path = selection.getKeyPath(target);
    this.onExpandAndScrollToPath(path, target);
  };

  /** Auto-scroll to newly selected single path in search input. */
  private onSearchSelectionChanged = (selection: TreeSelection<Node>) => {
    const previousPaths = this.searchedPaths;
    this.searchedPaths = TreeSelection.leafs(selection)
      .map((node) => Immutable.List(selection.getKeyPath(node) as string[]))
      .toSet();

    const newlySelectedPaths = this.searchedPaths.filter((path) => !previousPaths.has(path));
    if (newlySelectedPaths.size === 1) {
      const path = newlySelectedPaths.first().toArray() as KeyPath;
      this.onExpandAndScrollToPath(path, selection.fromKeyPath(path));
    }
  };

  private onItemToggleClick = (item: Node) => {
    trigger({ eventType: ItemToggleSelected, source: this.props.id, data: { iri: item.iri.value}});
  }

  private onItemClick = (item: Node) => {
    trigger({ eventType: ItemSelected, source: this.props.id, data: { iri: item.iri.value, label: item.label.value}});
  }

  private isLeaf = (item: Node) => {
    const { model } = this.state;
    return item.children ? item.children.length === 0 && !model.hasMoreChildren(item) : undefined;
  };

  private childrenOf = (node: Node) => {
    const { model } = this.state;
    const { children, loading } = node;
    return { children, loading, hasMoreItems: model.hasMoreChildren(node) };
  };

  private requestMore = (node: Node): void => {
    const renderedForest = this.getRenderedForest();
    const path = renderedForest.getKeyPath(node);
    let changePromise: Kefir.Property<(forest: KeyedForest<Node>) => KeyedForest<Node>>;
    this.updateForest((forest, state) => {
      const [loadingForest, forestChange] = queryMoreChildren((parent) => state.model.loadMoreChildren(parent), forest, path);
      changePromise = forestChange;
      return loadingForest;
    }, () => {
      const cancellation = this.state.searchResult ? this.searchCancellation : this.cancel;
      cancellation.map(changePromise).observe({
        value: changeForest => this.updateForest(changeForest)
      });
    });
  };

  private onExpandedOrCollapsed = (item: Node, expanded: boolean) => {
    const renderedForest = this.getRenderedForest();
    const path = renderedForest.getKeyPath(item);
    this.updateForest(forest => forest.updateNode(path, (node) => TreeNode.set(node, { expanded })));
  };

  private getRenderedForest() {
    return this.state.searchResult?.forest ?? this.state.forest;
  }

  private updateForest(
    update: (forest: KeyedForest<Node>, state?: State) => KeyedForest<Node>,
    callback?: () => void
  ) {
    this.setState((state: State): Partial<State> => {
      if (state.searchResult) {
        return {
          searchResult: {
            ...state.searchResult,
            forest: update(state.searchResult.forest, state),
          },
        };
      }
      return { forest: update(state.forest, state) };
    }, callback);
  }

  private clearSearch() {
    this.searchCancellation.cancelAll();
    this.setState({
      searchText: undefined,
      searchResult: undefined,
      awaitingSearchResponse: false,
    });
  }

  private searchFor(text: string) {
    if (!this.props.useLegacySearch) {
      return;
    }

    if (text.length >= LEGACY_MIN_SEARCH_TERM_LENGTH) {
      const searchingSameText = this.state.awaitingSearchResponse && this.state.searchText === text;
      if (!searchingSameText) {
        this.setState({
          searchText: text,
          awaitingSearchResponse: true,
        });
        this.searchCancellation = this.cancel.deriveAndCancel(this.searchCancellation);
        this.searchCancellation.map(this.performLegacySearch(text)).observe({
          value: searchResult => this.setState({ searchResult, awaitingSearchResponse: false }),
          error: error => this.setState({ searchResult: { error }, awaitingSearchResponse: false }),
        });
      }
    } else {
      this.searchCancellation.cancelAll();
      this.setState({
        searchText: text,
        searchResult: undefined,
        awaitingSearchResponse: false,
      });
    }
  }

  private performLegacySearch(text: string) {
    const parametrized = SparqlClient.setBindings(this.state.searchQuery, {
      __token__: SparqlUtil.makeLuceneQuery(text)
    });
    return Kefir.later(LEGACY_SEARCH_DELAY_MS, {})
      .flatMap(() => SparqlClient.select(parametrized, { context: this.context.semanticContext }))
      .flatMap<SearchResult>(result =>
        this.restoreTreeFromLeafNodes(result.results.bindings).map(forest => ({
          forest,
          matchedCount: result.results.bindings.length,
          matchLimit: parametrized.limit,
        }))
      );
  }

  private restoreTreeFromLeafNodes(searchResult: SparqlClient.Bindings): Kefir.Property<KeyedForest<Node>> {
    const leafs = searchResult
      .map(({ item, score = Rdf.literal('0'), label, hasChildren }): Node => {
        if (!(item && item.isIri())) {
          return undefined;
        }
        const certainlyLeaf = hasChildren && hasChildren.isLiteral() && hasChildren.value === 'false';
        return {
          iri: item,
          label: label && label.isLiteral() ? label : undefined,
          score: parseFloat(score && score.isLiteral() ? score.value : ''),
          children: [],
          reachedLimit: certainlyLeaf,
        };
      })
      .filter((node) => node !== undefined);

    return this.state.model
      .loadFromLeafs(leafs, { transitiveReduction: true })
      .map((treeRoot) => KeyedForest.create(Node.keyOf, sealLazyExpanding(treeRoot)));
  }

  private focusOnNode(iri: string) {
    const forest = this.state.forest;
    const nodes = forest?.nodes.get(iri);
    if (nodes && nodes.size > 0) {
      const path = forest.getKeyPath(nodes.first());
      this.onExpandAndScrollToPath(path, nodes.first());
      return;
    }

    const iriNode: Node = {
      iri: Rdf.iri(iri),
      children: [],
      reachedLimit: true,
    };

    this.expandingCancellation = this.cancel.deriveAndCancel(this.expandingCancellation);
    this.expandingCancellation.map(
      this.state.model.loadFromLeafs([iriNode], { transitiveReduction: false }).map(treeRoot => KeyedForest.create(Node.keyOf, treeRoot))
    ).observe({
      value: forestWithPath => {
        const target = forestWithPath.nodes.get(iri)?.first();
        if (!target) {
          return;
        }
        const path = forestWithPath.getKeyPath(target);
        this.setState({ forest: expandPath(forestWithPath, path), highlightedPath: path }, () => this.scrollToPath(path));
      }
    });
  }

  onExpandAndScrollToPath(path: KeyPath, target: Node) {
    const onExpandingStateChanged = () => {
      const { expandingToScroll, highlightedPath } = this.state;
      if (!expandingToScroll && highlightedPath) {
        this.scrollToPath(highlightedPath);
      }
    };


    this.setState({
      expandingToScroll: true,
      expandTarget: target,
    }, () => {
      this.expandingCancellation = this.cancel.deriveAndCancel(this.expandingCancellation);
      this.expandingCancellation
          .map(
            loadPath(
              (parent) => this.state.model.hasMoreChildren(parent),
              (parent) => this.state.model.loadMoreChildren(parent),
              this.state.forest,
              path
            ).map((forest) => expandPath(forest, path))
          )
          .observe({
            value: (forest) => {
              this.setState({
                forest,
                expandingToScroll: false,
                highlightedPath: path,
              }, onExpandingStateChanged);
            },
            error: (error) => {
              console.error(error);
              this.setState({
                expandingToScroll: false,
                highlightedPath: undefined,
              });
            },
          });
    });
  }

  cancelExpandingToScroll() {
    if (this.state.expandingToScroll) {
      this.expandingCancellation.cancelAll();
      this.setState({
        expandingToScroll: false,
        expandTarget: undefined,
        highlightedPath: undefined,
      });
    }
  }

  scrollToPath(path: KeyPath) {
    this.tree.scrollToPath(path);
  }
}

export default LazyTree;
