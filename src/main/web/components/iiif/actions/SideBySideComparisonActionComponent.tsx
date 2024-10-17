/**
 * ResearchSpace
 * Copyright (C) 2022-2024, © Kartography Community Interest Company
 * Copyright (C) 2015-2020, © Trustees of the British Museum
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

/**
 * @author Philip Polkovnikov
 */

import * as React from 'react';

import { Component } from 'platform/api/components';
import TypedSelectionActionComponent from 'platform/components/sets/TypedSelectionActionComponent';
import { AllImageActionProps } from './IiifProps';
import SideBySideComparison from '../SideBySideComparison';

export default class SideBySideComparisonActionComponent extends Component<AllImageActionProps, void> {
  static defaultProps = {
    menuTitle: 'Compare side-by-side',
    title: 'Side-by-Side image comparison',
    types: ['http://www.researchspace.org/ontology/EX_Digital_Image'],
  };
  render() {
    const { iiifServerUrl, imageIdPattern, selection, closeMenu, menuTitle, title, types, repositories, icon } = this.props;
    return (
      <TypedSelectionActionComponent
        repositories={repositories}
        menuTitle={menuTitle}
        title={title}
        icon={icon}
        isDisabled={(selection) => selection.length < 2}
        renderDialog={(selection) => (
          <SideBySideComparison
            repositories={repositories}
            iiifServerUrl={iiifServerUrl}
            imageIdPattern={imageIdPattern}
            selection={selection}
          />
        )}
        selection={selection}
        closeMenu={closeMenu}
        types={types}
      />
    );
  }
}
