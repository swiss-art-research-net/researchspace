/**
 * ResearchSpace
 * Copyright (C) 2020, © Trustees of the British Museum
 * Copyright (C) 2015-2019, metaphacts GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as React from 'react';

import { Rdf } from 'platform/api/rdf';

import { universalChildren, isValidChild, componentHasType } from 'platform/components/utils';
import { SemanticTable, SemanticTableConfig, ColumnConfiguration } from 'platform/components/semantic/table';

import { SemanticSearchContext, ResultContext } from './SemanticSearchApi';

export class SemanticSearchTableResult extends React.Component {
  render() {
    return (
      <SemanticSearchContext.Consumer>
        {(context) => <SemanticSearchTableResultInner {...this.props} context={context} />}
      </SemanticSearchContext.Consumer>
    );
  }
}

interface InnerProps {
  context: ResultContext;
}

interface State {
  columnConfiguration?: ReadonlyArray<ColumnConfiguration>;
}

export class SemanticSearchTableResultInner extends React.Component<InnerProps, State> {
  constructor(props: InnerProps) {
    super(props);
    this.state = { columnConfiguration: [] };
  }

  componentDidMount() {
    this.prepareColumnConfiguration();
  }

  componentDidUpdate(prevProps: InnerProps) {
    const { context: prevContext } = prevProps;
    const { searchProfileStore, availableDomains } = this.props.context;
    if (
      !prevContext.searchProfileStore.isEqual(searchProfileStore) ||
      !prevContext.availableDomains.isEqual(availableDomains)
    ) {
      this.prepareColumnConfiguration();
    }
  }

  private prepareColumnConfiguration() {
    const columnConfiguration = prepareSearchProfileColumns(this.props.context);
    this.setState({ columnConfiguration });
  }

  private mapChildren(children: React.ReactNode) {
    const { columnConfiguration } = this.state;
    return universalChildren(
      React.Children.toArray(children).map((child) => {
        if (!isValidChild(child)) {
          return child;
        }
        if (componentHasType(child, SemanticTable)) {
          return React.cloneElement(child, { ...child.props, columnConfiguration } as SemanticTableConfig);
        } else {
          return React.cloneElement(child, child.props, this.mapChildren(child.props.children));
        }
      })
    );
  }

  render() {
    return this.mapChildren(this.props.children);
  }
}

function prepareSearchProfileColumns(context: ResultContext): ColumnConfiguration[] {
  const { searchProfileStore, availableDomains } = context;
  const columns: ColumnConfiguration[] = [];
  const store = searchProfileStore.isJust ? searchProfileStore.get() : undefined;
  const domains = availableDomains.isJust ? availableDomains.get() : undefined;
  if (domains) {
    domains.forEach((domain, iri) => {
      const variableName = domain.replace(/^\?/, '');
      columns.push({
        variableName,
        displayName: store && store.categories.has(iri) ? store.categories.get(iri).label : variableName,
      });
    });
  }
  return columns;
}

export default SemanticSearchTableResult;
