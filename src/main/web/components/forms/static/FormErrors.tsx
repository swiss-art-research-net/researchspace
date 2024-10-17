/**
 * ResearchSpace
 * Copyright (C) 2020, © Trustees of the British Museum
 * Copyright (C) 2015-2019, metaphacts GmbH
 * Copyright (C) 2024, Kartography CIC
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

import * as D from 'react-dom-factories';
import * as classnames from 'classnames';
import * as React from 'react';

import { getPreferredLabel } from '../FieldDefinition';
import { ErrorKind, FieldError, FieldValue, CompositeValue } from '../FieldValues';
import { StaticComponent, StaticFieldProps } from './StaticComponent';
import Icon from 'platform/components/ui/icon/Icon';
import { createElement } from 'react';

export interface FormErrorsProps extends StaticFieldProps {
  hideFieldErrors?: boolean;
}

const CLASSNAME = 'semantic-form-errors';
const ERROR_CLASSNAME = `${CLASSNAME}__error`;

export class FormErrors extends StaticComponent<FormErrorsProps, {}> {

  render() {
    if(FieldValue.isComposite(this.props.model) && this.getErrors(this.props.model).length) {
      return (
        <div className={`${CLASSNAME}__container`}>
          <div className={`${CLASSNAME}__icon-container`}>
            <Icon iconType='rounded' iconName='priority_high' symbol />
          </div>
          <div>
            <div className={`${CLASSNAME}__error-title`}>Errors</div>
            <ul className={classnames(CLASSNAME, this.props.className)} style={this.props.style}>
              {this.renderErrors(this.getErrors(this.props.model))}
            </ul>
          </div>
            
        </div>
        )
    }

    return null
  }

  private getErrors(model: CompositeValue): CollectedError[] {
    const errors: CollectedError[] = [];
    collectErrors([], model, errors);
    return errors;
  }

  private renderErrors(errors: CollectedError[]) {
    // const errors: CollectedError[] = [];
    // collectErrors([], model, errors);

    return errors.map((e, index) =>
      D.li(
        {
          className: classnames(ERROR_CLASSNAME, `${ERROR_CLASSNAME}--${FieldError.kindToString(e.kind)}`),
          key: index,
        },
        D.span({ className: `${CLASSNAME}__error-source` }, e.path.join(' - ')),
        D.span({ className: `${CLASSNAME}__error-message` }, e.message)
      )
    );
  }
}

export interface CollectedError {
  readonly path: ReadonlyArray<string>;
  readonly kind: ErrorKind;
  readonly message: string;
}

export function collectErrors(
  parentPath: ReadonlyArray<string>,
  composite: CompositeValue,
  collectedErrors: CollectedError[]
) {
  const formPath = [...parentPath, 'Form'];
  composite.errors.forEach(({ kind, message }) => {
    collectedErrors.push({ path: formPath, kind, message });
  });

  composite.fields.forEach((state, fieldId) => {
    const definition = composite.definitions.get(fieldId);
    const source = (definition && getPreferredLabel(definition.label)) || fieldId;
    const path = [...parentPath, source];

    state.errors.forEach(({ kind, message }) => {
      collectedErrors.push({ path, kind, message });
    });

    state.values.forEach((value) => {
      FieldValue.getErrors(value).forEach(({ kind, message }) => {
        collectedErrors.push({ path, kind, message });
      });
      if (FieldValue.isComposite(value)) {
        collectErrors(path, value, collectedErrors);
      }
    });
  });
}

export default FormErrors;
