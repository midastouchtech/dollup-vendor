import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import cookie from 'cookiejs';
import { omit } from 'ramda';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const FormContainer = styled.div`
  width: 40%;
`;

const Logout = ({ vendor, socket }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  // dlete the cookie dollup_logged_in_vendor
  useEffect(() => {
    Cookies.remove('dollup_logged_in_vendor');
    router.push('/login');
  }, []);
  return (
    <Container>
      <FormContainer>
        <div className='row'>
          <div className='col-sm-12'>
            <h1 className='display-1'>
              Dollup <strong>Vendors</strong>
            </h1>
            <h2 className='display-4'>Logout</h2>
            <p className='lead'>Logging you out..</p>
          </div>
        </div>
      </FormContainer>
    </Container>
  );
};
export default connect((state) => state.app)(Logout);
