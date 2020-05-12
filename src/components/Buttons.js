import React from 'react';
import cn from 'classnames'

export const Buttons = ({ page, nearbyPage, selectPage, items, perPage }) => {
  const buttons = new Array(Math.ceil(items.length / perPage))
    .fill(0)
    .map((button, i) => i + 1);
  console.log(buttons);
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className="page-item">
          <a
            className="page-link"
            href="#"
            aria-label="Previous"
            onClick={() => nearbyPage(-1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {buttons.map(button => (
          <li
            className={cn({
              "page-item active": button === page,
              "page-item": button !== page,
            })}
            key={button}
          >
            <a
              className="page-link"
              href='#'
              onClick={() => selectPage(button)}
            >
              {button}
            </a>
          </li>
        ))}
        <li className="page-item">
          <a
            className="page-link"
            href="#"
            aria-label="Next"
            onClick={() => nearbyPage(1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}
