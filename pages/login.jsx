import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import cookie from 'cookiejs';
import { omit } from 'ramda';

const BGIMAGE = styled.div`
  background: url('bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(#06b6d4, transparent);
  color: #fff;
  button {
    background: #06b6d4;
  }
  input {
    background: #fff;
  }
  h1 {
    font-weight: 900;
    .thin {
      font-weight: 300;
    }
  }
  h2 {
    font-weight: 500;
  }
  h4 {
    color: #f8f8f8;
    font-weight: 400;
    font-size: 24px;
    margin: 20px 0px;
  }
  h1,
  h2,
  p,
  small,
  label {
    color: #fff;
  }
`;

const FormContainer = styled.div`
  width: 40%;
`;

const Header = styled.div`
  padding: 20px 15px;
`;

const Login = ({ vendor, socket }) => {
  console.log('vendor login', socket);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    console.log('Submitting vendor info', { email, password });
    socket.emit('VENDOR_LOGIN', { email, password });
    socket.on('VENDOR_LOGIN_SUCCESS', (vendor) => {
      console.log('found vendor', vendor);
      console.log(Cookies);
      console.log(
        JSON.stringify(
          omit(
            ['tracking', 'services', 'customers', 'bookings', 'products'],
            vendor
          )
        )
      );
      cookie(
        'dollup_logged_in_vendor',
        JSON.stringify(
          omit(
            [
              'tracking',
              'services',
              'customers',
              'bookings',
              'products',
              'bio',
            ],
            vendor
          )
        ),
        1
      );
      router.push('/');
    });
    socket.on('VENDOR_LOGIN_ERROR', (err) => {
      console.log('error', err);
      setError(err.message);
    });
  };
  return (
    <BGIMAGE>
      <Container>
        <FormContainer>
          <div className='row'>
            <Header className='col-sm-12'>
              <h1 className='display-1'>
                <strong> Dollup</strong>{' '}
                <span className='thin'>for vendors</span>
              </h1>
              <h4>
                Your complete salon business management solution, built for for
                you. To get started,{' '}
                <a href={process.env.NEXT_CLIENT_WEBSITE_URL}>sign up</a>
                or login to your account.
              </h4>
              <p>
                Fill in your account details to view your dashboard and manage
                your bookings.
              </p>
            </Header>
            <div className='col-sm-12'>
              <div className='form-group'>
                <label>Email</label>
                <input
                  className='form-control'
                  type='text'
                  placeholder=''
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                <label>Password</label>
                <input
                  className='form-control'
                  type='password'
                  placeholder=''
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className='ps-form__submit text-center'>
            <button className='ps-btn' onClick={onSubmit}>
              Login
            </button>
          </div>
          <div className='ps-form__submit text-center'>{error}</div>
        </FormContainer>
      </Container>
    </BGIMAGE>
  );
};
export default connect((state) => state.app)(Login);
