import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ContainerDashboard from '~/components/layouts/ContainerDashboard';
import TableOrdersItemsReport from '~/components/shared/tables/TableOrdersItemsReport';
import Pagination from '~/components/elements/basic/Pagination';
import { Select } from 'antd';
import Link from 'next/link';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { connect, useDispatch } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Modal } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { useRouter } from 'next/router';

const localizer = momentLocalizer(moment);
const { Option } = Select;

const OrdersPage = ({ vendor, socket }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState();
  const [originalBookings, setOriginalBookings] = useState([]);
  const [selectedEvent, selectEvent] = useState({});

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
    if (!bookings && socket && vendor) {
      socket.emit('GET_VENDOR_BOOKINGS', { id: vendor.id });
      socket.on('RECEIVE_VENDOR_BOOKINGS', (data) => {
        setBookings(data);
        setOriginalBookings(data);
      });
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  console.log('bookings', bookings);

  const events = bookings?.map((b) => ({
    id: b?.id,
    title: b?.user?.firstName + ' ' + b?.user?.lastName,
    start: moment(b?.date).toDate(),
    time: b?.time,
    end: moment(b?.date).toDate(),
    allDay: false,
    service: b?.service?.name,
    stylist: b?.stylist?.name,
    customer: b?.user?.firstName + b?.user?.lastName,
    price: b?.service?.salePrice,
  }));

  const onDoubleClickEvent = useCallback((calEvent) => {
    selectEvent(calEvent);
    showModal();
  }, []);

  return (
    <ContainerDashboard>
      <HeaderDashboard title='Bookings' description='Dollup Bookings Listing' />

      <Modal
        title='Booking'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Close
          </Button>,
          <Button
            key='edit'
            type='primary'
            onClick={() =>
              router.push(
                `/bookings/edit-booking/?vendorId=${vendor?.id}&bookingId=${selectedEvent.id}`
              )
            }
          >
            Edit
          </Button>,
        ]}
      >
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <div className='row'>
            <div className='col-sm-6'>
              <div className='form-group'>
                <label>Price</label>
                <input
                  className='form-control'
                  value={selectedEvent.price}
                  disabled
                />
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='form-group'>
                <label>Customer</label>
                <input
                  className='form-control'
                  value={selectedEvent.customer}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-6'>
              <div className='form-group'>
                <label>Date</label>
                <input
                  className='form-control'
                  value={moment(selectedEvent.start).format('DD MMM YYYY')}
                  disabled
                />
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='form-group'>
                <label>Time</label>
                <input
                  className='form-control'
                  value={selectedEvent.time}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-12'>
              <div className='form-group'>
                <label>Service</label>
                <input
                  className='form-control'
                  value={selectedEvent.service}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-12'>
              <div className='form-group'>
                <label>Stylist</label>
                <input
                  className='form-control'
                  value={selectedEvent.stylist}
                  disabled
                />
              </div>
            </div>
          </div>
        </Form>
      </Modal>

      <section className='ps-items-listing'>
        <div className='ps-section__content'>
          <TableOrdersItemsReport
            socket={socket}
            bookings={bookings}
            vendor={vendor}
          />
        </div>
      </section>
    </ContainerDashboard>
  );
};
export default connect((state) => state.app)(OrdersPage);
