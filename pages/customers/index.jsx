import React, { useEffect, useState } from 'react';
import ContainerDashboard from '~/components/layouts/ContainerDashboard';
import Pagination from '~/components/elements/basic/Pagination';
import TableCustomerItems from '~/components/shared/tables/TableCustomerItems';
import FormSearchSimple from '~/components/shared/forms/FormSearchSimple';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { connect, useDispatch } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';
import Link from 'next/link';

const CustomersPage = ({ socket, vendor }) => {
  const [customers, setCustomers] = useState();
  const [originalCustomers, setOriginalCustomers] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);
  console.log(customers, socket, vendor);
  if (!customers && socket && vendor) {
    console.log('getting customers');
    socket.emit('GET_VENDOR_CUSTOMERS', { id: vendor.id });
    socket.on('RECEIVE_VENDOR_CUSTOMERS', (data) => {
      setCustomers(data);
      console.log('customers', data);
      setOriginalCustomers(data);
    });
  }
  return (
    <ContainerDashboard title='Customers'>
      <HeaderDashboard
        title='Customers'
        description='Dollup Customer Listing'
      />
      <section className='ps-items-listing'>
        <div className='ps-section__header simple'>
          <div className='ps-section__filter'>
            <FormSearchSimple />
          </div>
          <p
            style={{
              margin: '0px 20px',
              padding: '15px',
              background: '#f7f7f7',
              fontSize: '10px',
            }}
          >
            Please note the customers listed here will only be customers you
            have had bookings with in the past. After adding a new customer
            please go ahead and add booking data for them in order to see them
            on this list
          </p>
          <div className='ps-section__actions'>
            <Link className='ps-btn success' href='/customers/create-customer'>
              <i className='icon icon-plus mr-2'></i>Add Customer
            </Link>
          </div>
        </div>
        <div className='ps-section__content'>
          <TableCustomerItems socket={socket} customers={customers} />
        </div>
        <div className='ps-section__footer'>
          <p>Show 10 in 30 items.</p>
          <Pagination />
        </div>
      </section>
    </ContainerDashboard>
  );
};
export default connect((state) => state.app)(CustomersPage);
