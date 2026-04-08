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

import { createElement, HTMLAttributes } from 'react';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { SparqlUtil } from 'platform/api/sparql';
import { Rdf } from 'platform/api/rdf';
import {
  AutocompleteInput,
  AutocompleteInputProps,
  FieldValue,
  normalizeFieldDefinition,
} from 'platform/components/forms';
import { AutoCompletionInput as UiAutoCompletionInput } from 'platform/components/ui/inputs';

import { shallow } from 'platform-tests/configuredEnzyme';
import { mockConfig } from 'platform-tests/mocks';

mockConfig();

interface AutocompleteProps extends HTMLAttributes<HTMLElement> {
  minimumInput: string;
  templates: { suggestion: string };
  actions: { onSelected: any };
}

const DATATYPE = Rdf.iri('http://www.w3.org/2001/XMLSchema-datatypes#string');

const definition = normalizeFieldDefinition({
  id: 'autocomplete1',
  label: 'labelProp',
  xsdDatatype: DATATYPE,
  minOccurs: 1,
  maxOccurs: 1,
  valueSetPattern: '',
});

const baseInputProps: AutocompleteInputProps = {
  for: 'autocomplete1',
};

const completeInputProps: AutocompleteInputProps = {
  ...baseInputProps,
  definition,
  handler: AutocompleteInput.makeHandler({ definition, baseInputProps }),
  value: FieldValue.empty,
};

const AUTOCOMPLETE_SELECTOR = 'AutoCompletionInput';

describe('AutocompleteInput Component', () => {
  const autocompleteComponent = shallow(createElement(AutocompleteInput, completeInputProps));
  const autocomplete = autocompleteComponent.find(AUTOCOMPLETE_SELECTOR);
  const fieldProps = autocomplete.props() as AutocompleteProps;

  it('render with default parameters', () => {
    expect(autocomplete).to.have.length(1);
  });

  it('have template for suggestion', () => {
    const template = `<span title="{{label.value}}">{{label.value}}</span>`;
    expect(fieldProps.templates.suggestion).to.be.equal(template);
  });

  it('call callback when value is changed', () => {
    const callback = sinon.spy();
    const props: AutocompleteInputProps = { ...completeInputProps, updateValue: callback };
    const wrapper = shallow(createElement(AutocompleteInput, props));
    const inputProps = wrapper.find(AUTOCOMPLETE_SELECTOR).props() as AutocompleteProps;
    inputProps.actions.onSelected();
    expect(callback.called).to.be.true;
  });

  it('replaces all legacy token placeholders in suggestion queries', () => {
    const query = `SELECT ?value ?label WHERE {
      {
        ?subject rdfs:label ?label .
        FILTER(REGEX(?label, "?token", "i"))
      } UNION {
        BIND(URI("?token") AS ?value)
      }
    }`;
    const wrapper = shallow(createElement(UiAutoCompletionInput, { query }));
    const instance = wrapper.instance() as any;
    const parsedQuery = instance.replaceTokenAndParseQuery(query, 'token', 'https://example.com/resource');
    const renderedQuery = SparqlUtil.serializeQuery(parsedQuery);

    expect(renderedQuery).to.contain('"https://example.com/resource"');
    expect(renderedQuery).not.to.contain('?token');
  });
});
