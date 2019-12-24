import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Pagination } from 'semantic-ui-react';

const Footer = ({
  firstTableItem,
  lastTableItem,
  entries,
  onSwitchPage,
  pagesAmount,
  activePage,
}) => {
  const lastItemOnPage = lastTableItem > entries ? entries : lastTableItem;

  return (
    <div className="table-options">
      <div>
        {`Showing ${firstTableItem} to ${lastItemOnPage} of ${entries} entries`}
      </div>

      <Pagination
        activePage={activePage}
        boundaryRange={0}
        ellipsisItem={null}
        firstItem={{
          content: <Icon name="angle double left" />, icon: true,
        }}
        lastItem={{
          content: <Icon name="angle double right" />, icon: true,
        }}
        prevItem={{
          content: <Icon name="angle left" />, icon: true,
        }}
        nextItem={{
          content: <Icon name="angle right" />, icon: true,
        }}
        pointing
        secondary
        totalPages={pagesAmount}
        onPageChange={onSwitchPage}
      />
    </div>
  );
};

Footer.propTypes = {
  firstTableItem: PropTypes.number.isRequired,
  lastTableItem: PropTypes.number.isRequired,
  entries: PropTypes.number.isRequired,
  pagesAmount: PropTypes.number.isRequired,
  activePage: PropTypes.number.isRequired,
  onSwitchPage: PropTypes.func.isRequired,
};

export default Footer;
