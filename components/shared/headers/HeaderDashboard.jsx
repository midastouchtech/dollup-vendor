import React from 'react';
import FormHeaderSearch from '~/components/shared/forms/FormHeaderSearch';
import { connect, useDispatch } from 'react-redux';

const HeaderDashboard = ({
  title = 'Dashboard',
  description = 'Everything here',
  vendor,
}) => {
  return (
    <header className='header--dashboard'>
      <div className='header__left'>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className='header__center'></div>
      <div className='header__right'>
        <a
          className='header__site-link'
          target='_blank'
          href={`${process.env.NEXT_PUBLIC_CLIENT_WEBSITE_URL}/review/vendor?id=${vendor?.id}`}
        >
          <span>View your store</span>
          <i className='icon-exit-right'></i>
        </a>
      </div>
    </header>
  );
};

export default connect((state) => state.app)(HeaderDashboard);
