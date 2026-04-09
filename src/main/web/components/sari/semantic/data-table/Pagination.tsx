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

interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  gotoPage: (page: number) => void;
  previousPage: () => void;
  nextPage: () => void;
}

export function Pagination(props: PaginationProps) {
  const { pageIndex, pageCount, canPreviousPage, canNextPage, gotoPage, previousPage, nextPage } = props;

  if (pageCount <= 1) {
    return <nav />;
  }

  const startIndex = Math.max(pageIndex - 5, 0);
  const endIndex = Math.min(startIndex + 11, pageCount);
  const normalizedStartIndex = pageCount >= 11 && endIndex - startIndex <= 10 ? Math.max(endIndex - 11, 0) : startIndex;
  const pages = [];

  for (let page = normalizedStartIndex; page < endIndex; page++) {
    pages.push(
      <li key={page} className={page === pageIndex ? 'active' : ''}>
        <a onClick={() => gotoPage(page)}>{page + 1}</a>
      </li>
    );
  }

  return (
    <nav>
      <ul className="pagination">
        <li className={!canPreviousPage ? 'disabled' : ''}>
          <a onClick={() => canPreviousPage && previousPage()}>&laquo;</a>
        </li>
        {pages}
        <li className={!canNextPage ? 'disabled' : ''}>
          <a onClick={() => canNextPage && nextPage()}>&raquo;</a>
        </li>
      </ul>
    </nav>
  );
}
