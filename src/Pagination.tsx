
import React from 'react';
import { PaginationPropsType } from './interfaces';

export const Pagination = ({
  total,
  perPage,
  page,
  setPerPage,
  setTotal,
  setPage }: PaginationPropsType) => {

  const countOfPages = Math.ceil(total / perPage);
  let pageNumbers = [];

  for (let i = 0; i < countOfPages; i++) {
    pageNumbers.push(i + 1);
  }
  return (
    <div className="pagination">
      <label>
        <select
          className="pagination__per-page-select"
          value={perPage}
          onChange={(event) => {
            if (+event.target.value > 0) {
              setPerPage(+event.target.value)
            }
          }

          }
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
        <span>items per page.</span>
      </label>


      <div
        className="pagination__buttons-wrapper"
      >
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={page === 1 ? "pagination__button nonActive" : "pagination__button"}
        >{'<<'}</button>
        {pageNumbers.map(pageNumber => (
          <button
            key={new Date().getTime() * pageNumber}
            onClick={() => setPage(pageNumber)}
            className={page === pageNumber ? "pagination__button pagination__button--active" : "pagination__button"}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === pageNumbers.length}
          className={page === pageNumbers.length ? "pagination__button nonActive" : "pagination__button"}
        >{'>>'}</button>
      </div>

    </div>
  )
}

