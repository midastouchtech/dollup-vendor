import React, { useEffect, useState } from 'react';
import ContainerDashboard from '~/components/layouts/ContainerDashboard';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { connect, useDispatch } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';
import { Select, Form, notification } from 'antd';
import { isEmpty, omit } from 'ramda';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SearchAndSelectCustomer from '~/components/searchAndSelectCustomer';
import styled from 'styled-components';
import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 10 });

const Note = styled.p`
  margin: 0;
  padding: 5px;
  background: #f1f1f1;
  border: 1px solid #f1f1f1;
  font-size: 12px;
  color: #333;
  margin-bottom: 10px;
`;
const getTimeFromDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return `${date.getHours()}:${date.getMinutes()}`;
};

const CreateBookingPage = ({ vendor, socket }) => {
  const router = useRouter();

  console.log('vendor', vendor);
  const dispatch = useDispatch();
  const [details, setDetails] = useState({
    isPaid: false,
    isCancelled: false,
    isComplete: false,
    dateTime: new Date(),
  });
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [selectedService, setSelectedService] = useState();
  const [selectedStylist, setSelectedStylist] = useState();

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
    if (
      socket &&
      isEmpty(customers) &&
      isEmpty(services) &&
      isEmpty(stylists)
    ) {
      socket.emit('GET_VENDOR_CUSTOMERS', { id: vendor.id });
      socket.emit('GET_VENDOR_STYLISTS', { id: vendor.id });
      socket.emit('GET_VENDOR_SERVICES', { id: vendor.id });
      socket.on('RECEIVE_VENDOR_CUSTOMERS', (data) => {
        setCustomers(data);
      });
      socket.on('RECEIVE_VENDOR_STYLISTS', (data) => {
        setStylists(data);
      });
      socket.on('RECEIVE_VENDOR_SERVICES', (data) => {
        setServices(data);
      });
    }
  }, []);

  const setDetail = (key, val) => {
    setDetails({ ...details, [key]: val });
  };

  const handleSubmit = () => {
    const id = uid.rnd();
    notification.destroy(id);
    if (socket && !isEmpty(details)) {
      const booking = {
        vendor: vendor,
        user: selectedCustomer,
        service: selectedService,
        stylist: selectedStylist,
        isPaid: details.isPaid,
        dateCreated: new Date(),
        creator: {
          id: vendor.id,
          name: vendor.fullName,
          salonName: vendor.storeName,
          type: 'vendor',
        },
        lastUpdated: new Date(),
        lastUpdatedBy: {
          id: vendor.id,
          name: vendor.fullName,
          salonName: vendor.storeName,
          type: 'vendor',
        },
        date: details.dateTime,
        time: getTimeFromDateTime(details.dateTime),
        id: id,
        ...details,
      };
      console.log('booking', booking);
      socket.emit('CREATE_BOOKING', booking);
      socket.on('RECEIVE_CREATE_BOOKING_SUCCESS', () => {
        notification.success({
          key: details.name,
          message: 'Success!',
          description: 'Your new booking has been added to your store!',
        });
        router.push('/bookings');
      });
      socket.on('RECEIVE_CREATE_BOOKING_ERROR', () => {
        notification.error({
          key: details.name,
          message: 'Something went wrong.',
          description: 'Your new booking could not be created.',
        });
      });
    }
  };
  return (
    <ContainerDashboard title='Create new product'>
      <HeaderDashboard
        title='Create Booking'
        description='Dollup Create New Booking '
      />
      <section className='ps-new-item'>
        <Form className='ps-form ps-form--new-product'>
          <div className='ps-form__content'>
            <div className='row d-flex justify-content-center'>
              <div className='col-md-8 col-sm-12'>
                <figure className='ps-block--form-box'>
                  <figcaption>General</figcaption>
                  <div className='ps-block__content'>
                    <div className='form-group'>
                      <label>
                        Booking Type
                        <sup>*</sup>
                      </label>
                      <Select
                        id='type'
                        placeholder='Select Booking Type'
                        className='ps-ant-dropdown'
                        listItemHeight={20}
                        onChange={(val) => {
                          setDetail('type', val);
                        }}
                      >
                        <option value='walkin'>Walk In</option>
                        <option value='online'>Online</option>
                      </Select>
                    </div>

                    <div className='form-group'>
                      <label>Customer</label>
                      {details.type === 'walkin' && (
                        <Note>
                          <small>
                            Please note in order to be able to find your walkin
                            customers in the db you will first need to create
                            them{' '}
                          </small>
                          <br />
                        </Note>
                      )}
                      <SearchAndSelectCustomer
                        placeholder='Search for customer'
                        selectedCustomer={selectedCustomer}
                        socket={socket}
                        onSelect={(customer) => {
                          setSelectedCustomer(customer);
                        }}
                      />
                    </div>

                    <div className='form-group'>
                      <label>Service</label>
                      <Select
                        id='service'
                        placeholder='Select Service'
                        className='ps-ant-dropdown'
                        listItemHeight={20}
                        value={selectedService?.name}
                        onChange={(serviceId) => {
                          const service = services?.filter(
                            (c) => c._id === serviceId
                          )[0];
                          console.log('selecting  service', service);
                          setSelectedService(service);
                        }}
                      >
                        {services?.map((c) => (
                          <option key={c.id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </Select>
                      {selectedService && (
                        <p className='text-mute mt-3'>
                          Price: R {selectedService?.salePrice}
                        </p>
                      )}
                    </div>
                    <div className='form-group'>
                      <label>Stylist</label>
                      <Select
                        id='stylist'
                        placeholder='Select Customer'
                        className='ps-ant-dropdown'
                        listItemHeight={20}
                        value={details?.stylist?.name}
                        onChange={(stylistId) => {
                          const stylist = stylists?.filter(
                            (c) => c.id === stylistId
                          )[0];
                          setSelectedStylist(stylist);
                        }}
                      >
                        {stylists?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className='form-group'>
                      <label>
                        Date & Time<sup>*</sup>
                      </label>
                      <DatePicker
                        selected={details?.dateTime}
                        onChange={(time) => setDetail('dateTime', time)}
                        timeInputLabel='Time:'
                        dateFormat='MM/dd/yyyy h:mm aa'
                        showTimeInput
                        wrapperClassName='form-control'
                        className='form-control'
                        fixedHeight={true}
                      />
                    </div>
                    {/* Is cancelled section */}
                    <div className='form-group'>
                      <label>Is Cancelled</label>
                      <Select
                        id='isCancelled'
                        placeholder='Select cancelled status'
                        className='ps-ant-dropdown'
                        listItemHeight={20}
                        onChange={(val) => setDetail('isCancelled', val)}
                      >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </Select>
                    </div>
                    <div className='form-group'>
                      <label>Is Paid</label>
                      <Select
                        id='isPaid'
                        placeholder='Select paid status'
                        className='ps-ant-dropdown'
                        listItemHeight={20}
                        onChange={(val) => setDetail('isPaid', val)}
                      >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </Select>
                    </div>
                    <div className='form-group'>
                      <label>Is Complete</label>
                      <Select
                        id='isComplete'
                        placeholder='Select completion status'
                        className='ps-ant-dropdown'
                        listItemHeight={20}
                        onChange={(val) => setDetail('isComplete', val)}
                      >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </Select>
                    </div>
                  </div>
                </figure>
              </div>
            </div>
          </div>
          <div className='ps-form__bottom'>
            <a className='ps-btn ps-btn--black' href='products.html'>
              Back
            </a>
            <button className='ps-btn ps-btn--gray'>Cancel</button>
            <button className='ps-btn' onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </Form>
      </section>
    </ContainerDashboard>
  );
};
export default connect((state) => state.app)(CreateBookingPage);
