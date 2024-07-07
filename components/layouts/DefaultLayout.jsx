import React from 'react';
import Head from './modules/Head';
import HeaderMobile from '~/components/shared/headers/HeaderMobile';
import SimpleHead from '../shared/headers/SimpleHead';
import DrawerMenu from '~/components/shared/drawers/DrawerMenu';

const DefaultLayout = ({ children }) => {
  const pathIsLoginPage = () => {
    return (
      typeof window !== 'undefined' && window.location.pathname === '/login'
    );
  };
  return (
    <div id='martfury'>
      <Head />
      {!pathIsLoginPage() && <HeaderMobile />}
      {pathIsLoginPage() && <SimpleHead />}
      {children}
      <DrawerMenu />
      <div id='loader-wrapper'>
        <div className='loader-section section-left'></div>
        <div className='loader-section section-right'></div>
      </div>
    </div>
  );
};

export default DefaultLayout;
