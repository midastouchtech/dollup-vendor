import React, { useEffect, useState } from 'react';
import ContainerDefault from '~/components/layouts/ContainerDefault';
import FormAccountSettings from '~/components/shared/forms/FormAccountSettings';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { connect, useDispatch } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';
import { DatePicker, Space } from 'antd';
import { Select, Form, notification } from 'antd';
import moment from 'moment';
import { Typography } from 'antd';
import { Card } from 'antd';

const { Title } = Typography;

const PLATFORM_COMMISION = 0.1;

const ReportsPage = ({ vendor, socket }) => {
  const dispatch = useDispatch();
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [bookings, setBookings] = useState();
  const [originalBookings, setOriginalBookings] = useState([]);
  const [stylists, setStylists] = useState();
  const [originalStylists, setOriginalStylists] = useState();
  const [selectedStylist, setSelectedStylist] = useState();
  const [selectedBooking, setSelectedBooking] = useState();

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
    if (!bookings && socket && vendor) {
      socket.emit('GET_VENDOR_BOOKINGS', { id: vendor.id });
      socket.on('RECEIVE_VENDOR_BOOKINGS', (data) => {
        setBookings(data);
        setOriginalBookings(data);
      });
      socket.emit('GET_VENDOR_STYLISTS', { id: vendor.id });
      socket.on('RECEIVE_VENDOR_STYLISTS', (data) => {
        setStylists(data);
        setOriginalStylists(data);
      });
    }
  }, []);

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  // GENERAL BOOKINGS

  const cancelledBookings = bookings?.filter((booking) => booking.isCancelled);
  const uncancelledBookings = bookings?.filter(
    (booking) => !booking.isCancelled
  );
  const completedBookings = uncancelledBookings?.filter(
    (booking) => booking.isComplete
  );
  const completedBookingsPercentage =
    Math.round((completedBookings?.length / bookings?.length) * 100) || 0;
  const incompleteBookings = uncancelledBookings?.filter(
    (booking) => !booking.isComplete
  );
  const incompleteBookingsPercentage =
    Math.round((incompleteBookings?.length / bookings?.length) * 100) || 0;
  const cancelledBookingsPercentage = Math.round(
    (cancelledBookings?.length / bookings?.length) * 100
  );
  const noShowBookings = bookings?.filter((booking) => booking.isNoShow);
  const noShowBookingsPercentage =
    Math.round((noShowBookings?.length / bookings?.length) * 100) || 0;
  const paidBookings = bookings?.filter((booking) => booking.isPaid);
  const paidBookingsPercentage =
    Math.round((paidBookings?.length / bookings?.length) * 100) || 0;
  const unpaidBookings = bookings?.filter((booking) => !booking.isPaid);
  const unpaidBookingsPercentage =
    Math.round((unpaidBookings?.length / bookings?.length) * 100) || 0;
  const totalBookings = bookings?.length || 0;

  // ONLINE BOOKINGS

  const onlineBookings = bookings?.filter(
    (booking) => booking.type === 'online'
  );
  const onlineBookingsPercentage =
    Math.round((onlineBookings?.length / bookings?.length) * 100) || 0;
  const completedOnlinBookings = onlineBookings?.filter(
    (booking) => booking.isComplete
  );
  const completedOnlinBookingsPercentage =
    Math.round(
      (completedOnlinBookings?.length / onlineBookings?.length) * 100
    ) || 0;
  const incompleteOnlineBookings = onlineBookings?.filter(
    (booking) => !booking.isComplete
  );
  const incompleteOnlineBookingsPercentage =
    Math.round(
      (incompleteOnlineBookings?.length / onlineBookings?.length) * 100
    ) || 0;
  const cancelledOnlineBookings = cancelledBookings?.filter(
    (booking) => booking.type === 'online'
  );
  const cancelledOnlineBookingsPercentage =
    Math.round(
      (cancelledOnlineBookings?.length / cancelledBookings?.length) * 100
    ) || 0;
  const noShowOnlineBookings = noShowBookings?.filter(
    (booking) => booking.type === 'online'
  );
  const noShowOnlineBookingsPercentage =
    Math.round((noShowOnlineBookings?.length / noShowBookings?.length) * 100) ||
    0;
  const paidOnlineBookings = paidBookings?.filter(
    (booking) => booking.type === 'online'
  );
  const paidOnlineBookingsPercentage =
    Math.round((paidOnlineBookings?.length / paidBookings?.length) * 100) || 0;

  // WALK IN BOOKINGS

  const walkInBookings = bookings?.filter(
    (booking) => booking.type === 'walkin'
  );
  const walkInBookingsPercentage = Math.round(
    (walkInBookings?.length / bookings?.length) * 100
  );
  const completedWalkInBookings = walkInBookings?.filter(
    (booking) => booking.isComplete
  );
  const completedWalkInBookingsPercentage =
    Math.round(
      (completedWalkInBookings?.length / walkInBookings?.length) * 100
    ) || 0;
  const incompleteWalkInBookings = walkInBookings?.filter(
    (booking) => !booking.isComplete
  );
  const incompleteWalkInBookingsPercentage =
    Math.round(
      (incompleteWalkInBookings?.length / walkInBookings?.length) * 100
    ) || 0;
  const cancelledWalkInBookings = cancelledBookings?.filter(
    (booking) => booking.type === 'walkin'
  );
  const cancelledWalkInBookingsPercentage =
    Math.round(
      (cancelledWalkInBookings?.length / cancelledBookings?.length) * 100
    ) || 0;
  const noShowWalkInBookings = noShowBookings?.filter(
    (booking) => booking.type
  );
  const noShowWalkInBookingsPercentage =
    Math.round((noShowWalkInBookings?.length / noShowBookings?.length) * 100) ||
    0;
  const paidWalkInBookings = paidBookings?.filter(
    (booking) => booking.type === 'walkin'
  );
  const paidWalkInBookingsPercentage =
    Math.round((paidWalkInBookings?.length / paidBookings?.length) * 100) || 0;

  const totalBookedHours = bookings?.reduce(
    (total, booking) =>
      total + parseInt(parseInt(booking.service.duration.hours)),
    0
  );
  const totalBookedMinutes = bookings?.reduce(
    (total, booking) => total + parseInt(booking.service.duration.minutes),
    0
  );

  const totalBookedDuration = moment.duration({
    hours: totalBookedHours,
    minutes: totalBookedMinutes,
  });

  const totalCompletedBookedHours = completedBookings?.reduce(
    (total, booking) => total + parseInt(booking.service.duration.hours),
    0
  );
  const totalCompletedBookedMinutes = completedBookings?.reduce(
    (total, booking) => total + parseInt(booking.service.duration.minutes),
    0
  );

  const completedBookedDuration = moment.duration({
    hours: totalCompletedBookedHours,
    minutes: totalCompletedBookedMinutes,
  });

  const totalIncompltedBookedHours = incompleteBookings?.reduce(
    (total, booking) => total + parseInt(booking.service.duration.hours),
    0
  );
  const totalIncompltedBookedMinutes = incompleteBookings?.reduce(
    (total, booking) => total + parseInt(booking.service.duration.minutes),
    0
  );
  const incompletedBookedDuration = moment.duration({
    hours: totalIncompltedBookedHours,
    minutes: totalIncompltedBookedMinutes,
  });
  const completedDurationPercentage =
    Math.round(
      (completedBookedDuration.asMinutes() / totalBookedDuration.asMinutes()) *
        100
    ) || 0;
  const incompletedDurationPercentage =
    Math.round(
      (incompletedBookedDuration.asMinutes() /
        totalBookedDuration.asMinutes()) *
        100
    ) || 0;

  const totalRevenue = completedBookings?.reduce((total, booking) => {
    const servicePrice = booking.service.salePrice;
    const stylistCommision =
      booking.service.salePrice * (vendor.stylistCommision / 100);
    const platformCommission = booking.service.salePrice * PLATFORM_COMMISION;
    const netRevenue = servicePrice - stylistCommision - platformCommission;
    return total + netRevenue;
  }, 0);

  console.log('cancelled bookings', cancelledBookings);
  console.log('cancelled online bookings', cancelledOnlineBookings);
  return (
    <ContainerDefault title='Settings'>
      <HeaderDashboard title='Reports' description='Dollup Settings' />
      <section className='ps-dashboard ps-items-listing'>
        <div className='ps-section__left'>
          <section className='ps-card'>
            <div className='ps-card__header'>
              <h4>Reports</h4>
            </div>
            <div className='ps-card__content'>
              <div className='row'>
                <div className='col-md-5'>
                  <div className='form-group'>
                    <label>Date</label>
                    <DatePicker
                      selected={selectedDay}
                      onChange={(date) => {
                        console.log('date', date, date.format('MM/DD/YYYY'));
                        setSelectedDay(date);
                        if (date) {
                          setBookings(
                            originalBookings?.filter(
                              (booking) =>
                                moment(booking.date).format('MM/DD/YYYY') ===
                                date.format('MM/DD/YYYY')
                            )
                          );
                        } else {
                          setBookings(originalBookings);
                        }
                      }}
                      dateFormat='MM/dd/yyyy'
                      wrapperClassName='form-control'
                      className='form-control'
                      fixedHeight={true}
                    />
                  </div>
                </div>
                <div className='col-md-5'>
                  <div className='form-group'>
                    <label>Stylist</label>
                    <Select
                      showSearch
                      placeholder='Select a stylist'
                      optionFilterProp='children'
                      className='ps-ant-dropdown'
                      onChange={(value) => {
                        setSelectedStylist(value);
                        if (value) {
                          setBookings(
                            originalBookings?.filter(
                              (booking) => booking.stylist.id === value
                            )
                          );
                        } else {
                          setBookings(originalBookings);
                        }
                      }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {stylists &&
                        stylists.map((stylist) => (
                          <Select.Option value={stylist.id}>
                            {stylist.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </div>
                </div>
                <div className='col-md-2'>
                  <div className='form-group'>
                    <label>Actions</label>
                    <div className='d-flex flex-column'>
                      <button
                        className='btn btn-primary'
                        onClick={() => {
                          setBookings(originalBookings);
                          setSelectedDay(null);
                          setSelectedStylist(null);
                        }}
                      >
                        Reset
                      </button>
                      <button
                        className='btn btn-primary mt-2'
                        onClick={() => {
                          window.print();
                        }}
                      >
                        Print
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-4  mb-4'>
                  <div className='card '>
                    <div className='card-body stat-card-body'>
                      <div className='row title-row text-center'>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <Title level={3}>Total Bookings</Title>
                        </div>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <h1>{bookings && bookings?.length}</h1>
                        </div>
                      </div>
                      <table className='table table-hover'>
                        <tbody>
                          <tr>
                            <th>Online</th>
                            <td>{onlineBookings && onlineBookings?.length}</td>
                          </tr>
                          <tr>
                            <th>Walk-In</th>
                            <td>{walkInBookings && walkInBookings?.length}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className='col-md-4  mb-4'>
                  <div className='card '>
                    <div className='card-body stat-card-body'>
                      <div className='row title-row'>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <h3 className='card-title display-4 text-bold'>
                            <Title level={3}>Total Excl Commision</Title>
                          </h3>
                        </div>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <h1>
                            R
                            {completedBookings &&
                              completedBookings?.reduce(
                                (total, booking) =>
                                  total + parseInt(booking.service.salePrice),
                                0
                              )}
                          </h1>
                        </div>
                      </div>
                      <table className='table table-hover'>
                        <tbody>
                          <tr>
                            <th>Online</th>
                            <td>
                              R{' '}
                              {completedOnlinBookings &&
                                completedOnlinBookings
                                  .filter(
                                    (booking) => booking.type === 'online'
                                  )
                                  .reduce(
                                    (total, booking) =>
                                      total +
                                      parseInt(booking.service.salePrice),
                                    0
                                  )}
                            </td>
                          </tr>
                          <tr>
                            <th>Walk-In</th>
                            <td>
                              R{' '}
                              {completedWalkInBookings &&
                                completedWalkInBookings
                                  .filter(
                                    (booking) => booking.type === 'walkin'
                                  )
                                  .reduce(
                                    (total, booking) =>
                                      total +
                                      parseInt(booking.service.salePrice),
                                    0
                                  )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className='col-md-4  mb-4'>
                  <div className='card '>
                    <div className='card-body stat-card-body'>
                      <div className='row title-row'>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <Title level={3}>Sale Average</Title>
                        </div>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <h1>
                            R
                            {completedBookings && completedBookings?.length > 0
                              ? (
                                  completedBookings?.reduce(
                                    (total, booking) =>
                                      total +
                                      parseInt(booking.service.salePrice),
                                    0
                                  ) / completedBookings?.length
                                ).toFixed(0)
                              : 0}
                          </h1>
                        </div>
                      </div>
                      <table className='table table-hover'>
                        <tbody>
                          <tr>
                            <th>Sales</th>
                            <td>
                              {completedBookings && completedBookings.length}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className='col-md-4  mb-4'>
                  <div className='card '>
                    <div className='card-body stat-card-body'>
                      <div className='row title-row'>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <Title level={3}>Online Bookings</Title>
                        </div>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <h1>{onlineBookings && onlineBookings?.length}</h1>
                        </div>
                      </div>
                      <table className='table table-hover'>
                        <tbody>
                          <tr>
                            <th>Completed</th>
                            <td>
                              {completedOnlinBookings &&
                                completedOnlinBookings?.length}{' '}
                              ({completedOnlinBookingsPercentage}% )
                            </td>
                          </tr>
                          <tr>
                            <th>Not Completed</th>
                            <td>
                              {incompleteOnlineBookings &&
                                incompleteOnlineBookings?.length}{' '}
                              ({incompleteOnlineBookingsPercentage}% )
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className='col-md-4  mb-4'>
                  <div className='card '>
                    <div className='card-body stat-card-body'>
                      <div className='row title-row'>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <Title level={3}>Walk-in Bookings</Title>
                        </div>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <h1>{walkInBookings && walkInBookings?.length}</h1>
                        </div>
                      </div>
                      <table className='table table-hover'>
                        <tbody>
                          <tr>
                            <th>Completed</th>
                            <td>
                              {completedWalkInBookings &&
                                completedWalkInBookings?.length}{' '}
                              ({completedWalkInBookingsPercentage}% )
                            </td>
                          </tr>
                          <tr>
                            <th>Not Completed</th>
                            <td>
                              {incompleteWalkInBookings &&
                                incompleteWalkInBookings?.length}{' '}
                              ({incompleteWalkInBookingsPercentage}% )
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className='col-md-4  mb-4'>
                  <div className='card '>
                    <div className='card-body stat-card-body'>
                      <div className='row title-row'>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <Title level={3}>Cancelled Bookings</Title>
                        </div>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <h1>
                            {cancelledBookings && cancelledBookings?.length}
                          </h1>
                        </div>
                      </div>
                      <table className='table table-hover'>
                        <tbody>
                          <tr>
                            <th>Online</th>
                            <td>
                              {cancelledOnlineBookings &&
                                cancelledOnlineBookings?.length}{' '}
                              ({cancelledOnlineBookingsPercentage}% )
                            </td>
                          </tr>
                          <tr>
                            <th>Walk-In</th>
                            <td>
                              {cancelledWalkInBookings &&
                                cancelledWalkInBookings?.length}{' '}
                              ({cancelledWalkInBookingsPercentage}% )
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className='col-md-4  mb-4'>
                  <div className='card '>
                    <div className='card-body stat-card-body'>
                      <div className='row title-row'>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <Title level={3}>Paid Bookings</Title>
                        </div>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <h1>{paidBookings && paidBookings?.length}</h1>
                        </div>
                      </div>
                      <table className='table table-hover'>
                        <tbody>
                          <tr>
                            <th>Online</th>
                            <td>
                              {paidOnlineBookings && paidOnlineBookings?.length}{' '}
                              ({paidOnlineBookingsPercentage}% )
                            </td>
                          </tr>
                          <tr>
                            <th>Walk-In</th>
                            <td>
                              {paidWalkInBookings && paidWalkInBookings?.length}{' '}
                              ({paidWalkInBookingsPercentage}% )
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className='col-md-4  mb-4'>
                  <div className='card '>
                    <div className='card-body stat-card-body'>
                      <div className='row title-row'>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <Title level={3}>No Show Bookings</Title>
                        </div>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <h1>{noShowBookings && noShowBookings?.length}</h1>
                        </div>
                      </div>
                      <table className='table table-hover'>
                        <tbody>
                          <tr>
                            <th>Online</th>
                            <td>
                              {noShowOnlineBookings &&
                                noShowOnlineBookings?.length}{' '}
                              ({noShowOnlineBookingsPercentage}% )
                            </td>
                          </tr>
                          <tr>
                            <th>Walk-In</th>
                            <td>
                              {noShowWalkInBookings &&
                                noShowWalkInBookings?.length}{' '}
                              ({noShowWalkInBookingsPercentage}% )
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className='col-md-4  mb-4'>
                  <div className='card '>
                    <div className='card-body stat-card-body'>
                      <div className='row title-row'>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <Title level={3}>Time Booked</Title>
                        </div>
                        <div className='col-md-12 d-flex flex-column justify-content-center align-items-center'>
                          <h1>
                            {moment
                              .utc(totalBookedDuration.asMilliseconds())
                              .format('HH:mm')}
                          </h1>
                        </div>
                      </div>
                      <table className='table table-striped table-hover'>
                        <tbody>
                          <tr>
                            <th>Complete</th>
                            <td>
                              {moment
                                .utc(completedBookedDuration.asMilliseconds())
                                .format('HH:mm')}{' '}
                              ({completedDurationPercentage}% )
                            </td>
                          </tr>
                          <tr>
                            <th>Remaining</th>
                            <td>
                              {moment
                                .utc(incompletedBookedDuration.asMilliseconds())
                                .format('HH:mm')}{' '}
                              ({incompletedDurationPercentage}% )
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mb-4 my-4'>
                <div className='col-md-12 my-4'>
                  <h3 className='display-3 my-4'>Revenue Breakdown</h3>
                  <p className='lead'> Only applies to completed bookings</p>
                  <table className='table table-striped table-hover'>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Service</th>
                        <th>Type</th>
                        <th>Stylist</th>
                        <th>Price</th>
                        <th>Stylist Commision</th>
                        <th>Platform Fee</th>
                        <th>Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedBookings &&
                        completedBookings.map((booking, index) => (
                          <tr key={index}>
                            <td>{moment(booking.date).format('DD/MM/YYYY')}</td>
                            <td>{booking.service.name}</td>
                            <td>
                              {booking.type === 'walkin' ? 'Walk-In' : 'Online'}
                            </td>
                            <td>{booking.stylist.name}</td>
                            <td>R{booking.service.salePrice}</td>
                            <td>
                              R
                              {booking.service.salePrice *
                                (vendor.stylistCommision / 100)}
                            </td>
                            <td>
                              R{booking.service.salePrice * PLATFORM_COMMISION}
                            </td>
                            <td>
                              R
                              {booking.service.salePrice -
                                booking.service.salePrice *
                                  (vendor.stylistCommision / 100) -
                                booking.service.salePrice * PLATFORM_COMMISION}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className='w-100 d-flex flex-row align-items-end justify-content-end my-4'>
                    <div className='col-md-4 d-flex flex-column align-items-end justify-content-end my-4'>
                      <p>
                        <strong>TOTAL</strong>
                      </p>
                      <Title level={2}>R{totalRevenue}</Title>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(ReportsPage);

/*

                        
                        */
