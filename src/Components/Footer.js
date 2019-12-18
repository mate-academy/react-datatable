import React from 'react';
import PropsTypes from 'prop-types';
import Pagination from './Pagination';

const Footer = ({ items, tabs, handleTabs }) => {
  const start = tabs.perPage * tabs.page - (tabs.perPage - 1);
  const end = tabs.perPage * tabs.page >= items.length
    ? items.length
    : tabs.perPage * tabs.page;

  return (
    <footer className="table__footer">
      <p className="footer__info">
        {`
          Showing ${start} to ${end}
          of ${items.length} entries
        `}
      </p>
      <Pagination
        total={items.length}
        page={tabs.page}
        perPage={tabs.perPage}
        onPageChange={handleTabs}
      />
    </footer>
  );
};

Footer.propTypes = {
  items: PropsTypes.arrayOf.isRequired,
  tabs: PropsTypes.objectOf.isRequired,
  handleTabs: PropsTypes.func.isRequired,
};

export default Footer;
