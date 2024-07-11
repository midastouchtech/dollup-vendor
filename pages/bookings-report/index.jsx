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
import styled from 'styled-components';
import { find, range } from 'ramda';

const SearchBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 60%;
  .ant-select-arrow {
    top: 30%;
  }
`;

const SegmentedButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const localizer = momentLocalizer(moment);
const { Option } = Select;

const OrdersPage = ({ vendor, socket }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState();
  const [originalBookings, setOriginalBookings] = useState([]);
  const [selectedEvent, selectEvent] = useState({});
  const [selectedTab, setSelectedTab] = useState('all');
  const [bookingType, setBookingType] = useState('all');
  const [page, setPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);

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

  const findBookings = () => {
    const searchParams = {
      bookingType,
      timePeriod: selectedTab,
      page,
      pageLimit,
    };
    console.log('finding page', page);
    socket.emit('GET_VENDOR_BOOKINGS', {
      id: vendor.id,
      searchParams,
    });
    socket.on('RECEIVE_VENDOR_BOOKINGS', (data) => {
      setBookings(data);
      setOriginalBookings(data);
    });
  };

  useEffect(() => {
    console.log('page changed to', page);
    findBookings();
  }, [page]);

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

  const tabs = ['all', 'today', 'week', 'month'];
  const bookingTypes = [
    'all',
    'completed',
    'pending',
    'cancelled',
    'paid',
    'unpaid',
  ];
  const pageLimits = [2, 3, 5, 10, 20, 50, 100];

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

      <SearchBox className='ps-section__actions'>
        <SegmentedButtonsContainer>
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              type={selectedTab === tab ? 'primary' : ''}
            >
              {tab}
            </Button>
          ))}
        </SegmentedButtonsContainer>
        <Select
          defaultValue='all'
          style={{ width: 120 }}
          onChange={(value) => setBookingType(value)}
        >
          {bookingTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
        <Select
          defaultValue={10}
          style={{ width: 120 }}
          onChange={(value) => setPageLimit(value)}
        >
          {pageLimits.map((limit) => (
            <Option key={limit} value={limit}>
              {limit}
            </Option>
          ))}
        </Select>
        <Button type='warning' onClick={findBookings}>
          {' '}
          Find
        </Button>
      </SearchBox>

      <section className='ps-items-listing'>
        <div className='ps-section__content'>
          <TableOrdersItemsReport
            socket={socket}
            bookings={bookings}
            vendor={vendor}
          />
        </div>
        <div className='ps-section__footer'>
          <p>Viewed {pageLimit * (page + 1)} items.</p>
          <ul className='pagination'>
            <li>
              <a
                href='#'
                onClick={() => {
                  setPage(page === 0 ? 0 : page - 1);
                }}
              >
                <i className='icon icon-chevron-left'></i>
              </a>
            </li>
            {range(page + 1, page + 2).map((p) => (
              <li className={page + 1 === p ? 'active' : ''}>
                <a
                  href='#'
                  onClick={() => {
                    setPage(p);
                  }}
                >
                  {p}
                </a>
              </li>
            ))}
            <li>
              <a
                href='#'
                onClick={() => {
                  setPage(page + 1);
                }}
              >
                <i className='icon-chevron-right'></i>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </ContainerDashboard>
  );
};
export default connect((state) => state.app)(OrdersPage);
