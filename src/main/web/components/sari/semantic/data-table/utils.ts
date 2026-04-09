/**
 * ResearchSpace
 * Copyright (C) 2026, © Kartography Community Interest Company
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import * as _ from 'lodash';
import { Rdf } from 'platform/api/rdf';
import xsd from 'platform/api/rdf/vocabularies/xsd';

export type AggregateType =
  | 'default'
  | 'count'
  | 'uniqueCount'
  | 'average'
  | 'sum'
  | 'concat';

export function isPrimitiveDatatype(data: unknown): boolean {
  return _.isString(data) || _.isBoolean(data) || _.isNumber(data) || _.isNull(data) || _.isUndefined(data);
}

export function makeUniqueColumnNameGenerator() {
  const usedNames = new Set<string>();
  return (baseName: string) => {
    let generatedName = baseName;
    let index = 1;
    while (usedNames.has(generatedName)) {
      generatedName = `__${baseName}-${index}`;
      index++;
    }
    usedNames.add(generatedName);
    return generatedName;
  };
}

export function getComparableCellValue(
  value: unknown,
  getLabel: (resource: Rdf.Iri) => string | undefined
): string | number {
  if (isPrimitiveDatatype(value)) {
    return value as string | number;
  }
  if (value instanceof Rdf.Node) {
    if (value.isLiteral() && xsd.NUMERIC_TYPES.has(value.datatype)) {
      const numeric = Number(value.value);
      if (!Number.isNaN(numeric)) {
        return numeric;
      }
    }
    return (value.isIri() && getLabel(value)) || value.value;
  }
  return String(value ?? '');
}

export function compareCellValues(
  left: unknown,
  right: unknown,
  getLabel: (resource: Rdf.Iri) => string | undefined
): number {
  const leftNull = left === null || left === undefined;
  const rightNull = right === null || right === undefined;
  if (leftNull && rightNull) {
    return 0;
  }
  if (leftNull) {
    return -1;
  }
  if (rightNull) {
    return 1;
  }

  const leftComparable = getComparableCellValue(left, getLabel);
  const rightComparable = getComparableCellValue(right, getLabel);

  if (typeof leftComparable === 'number' && typeof rightComparable === 'number') {
    return leftComparable < rightComparable ? -1 : leftComparable > rightComparable ? 1 : 0;
  }

  const leftString = String(leftComparable);
  const rightString = String(rightComparable);
  return leftString.localeCompare(rightString);
}

export function cellMatchesQuery(
  value: unknown,
  query: string,
  getLabel: (resource: Rdf.Iri) => string | undefined
): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  if (isPrimitiveDatatype(value)) {
    return String(value ?? '').toLowerCase().indexOf(normalizedQuery) >= 0;
  }

  if (value instanceof Rdf.Node) {
    const label = value.isIri() ? getLabel(value) : undefined;
    if (label && label.toLowerCase().indexOf(normalizedQuery) >= 0) {
      return true;
    }
    return value.value.toLowerCase().indexOf(normalizedQuery) >= 0;
  }

  return String(value ?? '').toLowerCase().indexOf(normalizedQuery) >= 0;
}

export function toScalarValue(value: unknown, getLabel: (resource: Rdf.Iri) => string | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (isPrimitiveDatatype(value)) {
    return String(value);
  }
  if (value instanceof Rdf.Node) {
    return (value.isIri() && getLabel(value)) || value.value;
  }
  return String(value);
}

export function getNumericValue(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isNaN(value) ? undefined : value;
  }
  if (value instanceof Rdf.Literal) {
    const numeric = Number(value.value);
    return Number.isNaN(numeric) ? undefined : numeric;
  }
  const numeric = Number(value);
  return Number.isNaN(numeric) ? undefined : numeric;
}

export function uniqueValues(values: unknown[], getLabel: (resource: Rdf.Iri) => string | undefined): unknown[] {
  const byKey: { [key: string]: unknown } = {};
  values.forEach((value) => {
    byKey[toScalarValue(value, getLabel)] = value;
  });
  return Object.keys(byKey).map((key) => byKey[key]);
}

export function aggregateValues(
  aggregate: AggregateType | undefined,
  values: unknown[],
  getLabel: (resource: Rdf.Iri) => string | undefined
): unknown {
  const effectiveAggregate = aggregate || 'default';
  if (effectiveAggregate === 'count') {
    return values.length;
  }
  if (effectiveAggregate === 'uniqueCount') {
    return uniqueValues(values, getLabel).length;
  }
  if (effectiveAggregate === 'sum' || effectiveAggregate === 'average') {
    const numbers = values.map(getNumericValue).filter((value): value is number => value !== undefined);
    const sum = numbers.reduce((acc, value) => acc + value, 0);
    return effectiveAggregate === 'sum' ? sum : numbers.length > 0 ? sum / numbers.length : undefined;
  }
  if (effectiveAggregate === 'concat') {
    return uniqueValues(values, getLabel);
  }

  const unique = uniqueValues(values, getLabel);
  return unique.length > 3 ? unique.length : unique;
}
