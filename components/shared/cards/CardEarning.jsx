import React from 'react';
import { useEffect, useState } from 'react';

export const PLATFORM_COMMISION = 0.1;

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CardEarning = ({ socket, vendor }) => {
  const [chartData, setChartData] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);
  const [bookings, setBookings] = useState();

  useEffect(() => {
    if (!bookings && socket && vendor) {
      socket.emit('GET_VENDOR_BOOKINGS', { id: vendor.id });
      socket.on('RECEIVE_VENDOR_BOOKINGS', (data) => {
        setBookings(data);
      });
    }
  }, []);

  useEffect(() => {
    if (bookings) {
      const services = bookings.map((b) => b.service).filter((s) => s);
      console.log('services', services);
      let prices = {};
      services.forEach((s, i) => {
        if (s && !prices[s?.id]) {
          prices[s?.id] = {
            name: s.name,
            price: parseInt(s.salePrice),
          };
        } else if (s) {
          prices[s?.id].price = prices[s?.id]?.price + parseInt(s?.salePrice);
        }
      });
      console.log('prices', prices);
      const data = Object.values(prices).map((p) => p.price);
      const categories = Object.values(prices).map((p) => p.name);
      console.log('data', data);
      console.log('categories', categories);
      setChartData(data);
      setChartCategories(categories);
    }
  }, [bookings]);

  const state = {
    series: chartData,
    labels: chartCategories,
    options: {
      chart: {
        height: 500,
        type: 'donut',
      },
      dataLabels: {
        enabled: false,
      },

      legend: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  };

  const total = Math.round(chartData.reduce((acc, curr) => acc + curr, 0));
  const stylistCommision = Math.round(
    total * (parseInt(vendor?.stylistCommision) / 100)
  );
  const platformCommision = Math.round(total * PLATFORM_COMMISION);
  const balance = Math.round(total - stylistCommision - platformCommision);

  return (
    <div className='ps-card ps-card--earning'>
      <div className='ps-card__header'>
        <h4>Potential Earnings</h4>
      </div>
      <div className='ps-card__content'>
        <div className='ps-card__chart'>
          <Chart options={state.options} series={state.series} type='donut' />
          <div className='ps-card__information'>
            <i className='icon icon-wallet'></i>
            <strong>R{total}</strong>
            <small>Balance</small>
          </div>
        </div>
        <div className='ps-card__status'>
          <p className='red'>
            <strong> - R {stylistCommision}</strong>
            <span>Stylists</span>
          </p>
          <p className='red'>
            <strong> - R {platformCommision}</strong>
            <span>Platform</span>
          </p>
          <p className='green'>
            <strong> R {balance}</strong>
            <span>Net</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardEarning;
