
import React from 'react';
import {TitlePaginationPropsType} from './interfaces';

export const TitlePagination = ({from, to, total}:TitlePaginationPropsType) => {
  return (
    <h1
    className="title-pagination"
    >
      {`${from + 1} - ${Math.min(to, total)} from ${total}`}
    </h1>
  )
}

