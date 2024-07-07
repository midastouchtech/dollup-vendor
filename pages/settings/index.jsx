import React, { useEffect, useState } from 'react';
import ContainerDashboard from '~/components/layouts/ContainerDashboard';
import FormAccountSettings from '~/components/shared/forms/FormAccountSettings';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { connect, useDispatch } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';

const SettingsPage = ({ vendor, socket }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);
  return (
    <ContainerDashboard title='Settings'>
      <HeaderDashboard title='Settings' description='Dollup Settings' />
      <section className='ps-dashboard ps-items-listing'>
        <div className='ps-section__left'>
          <section className='ps-card'>
            <div className='ps-card__header'>
              <h4>Account Settings</h4>
            </div>
            <div className='ps-card__content'>
              <FormAccountSettings vendor={vendor} socket={socket} />
            </div>
          </section>
        </div>
        <div className='ps-section__right'></div>
      </section>
    </ContainerDashboard>
  );
};
export default connect((state) => state.app)(SettingsPage);
