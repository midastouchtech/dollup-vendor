import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';

const WidgetUserWelcome = ({ vendor }) => {
  console.log('wdget vendor', vendor);
  return (
    <div className='ps-block--user-wellcome'>
      <div className='ps-block__left'>
        <img src={vendor?.avatar} alt='' style={{ maxWidth: '60px' }} />
      </div>
      <div className='ps-block__right'>
        <p>
          <a href='#'>{vendor?.storeName}</a>
        </p>
        <small>{vendor?.email}</small>
      </div>
      <div className='ps-block__action'>
        <Link href='/logout'>
          <i className='icon-exit'></i>
        </Link>
      </div>
    </div>
  );
};

export default connect((state) => state.app)(WidgetUserWelcome);
