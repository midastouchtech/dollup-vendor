import React from 'react';
import Head from 'next/head';
import { useState } from 'react';
import FooterCopyright from '~/components/shared/footers/FooterCopyright';
import MenuSidebar from '~/components/shared/menus/MenuSidebar';
import WidgetEarningSidebar from '~/components/shared/widgets/WidgetEarningSidebar';
import WidgetUserWelcome from '~/components/shared/widgets/WidgetUserWelcome';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { useRouter } from 'next/router';
import { connect, useDispatch } from 'react-redux';
import cookies from 'js-cookie';
import { saveVendor } from '~/store/app/action';
import { isEmpty, isNil } from 'ramda';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const exists = (i) => !isNil(i) && !isEmpty(i);

const ContainerDashboard = ({ children, title, socket, vendor }) => {
  const dispatch = useDispatch();
  const cookieVendor = cookies.get('dollup_logged_in_vendor');
  console.log('cookieVendor', cookieVendor);
  if (cookieVendor && !exists(vendor)) {
    dispatch(saveVendor(JSON.parse(cookieVendor)));
  } else if (!exists(cookieVendor) && !exists(vendor)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  let titleView;
  if (title !== undefined) {
    titleView = process.env.title + ' | ' + title;
  } else {
    titleView = process.env.title + ' | ' + process.env.titleDescription;
  }
  return (
    <div className='martfury-admin'>
      <Head>
        <title>{titleView}</title>
        <script
          src='https://cdnjs.cloudflare.com/ajax/libs/holder/2.9.8/holder.min.js'
          integrity='sha512-O6R6IBONpEcZVYJAmSC+20vdsM07uFuGjFf0n/Zthm8sOFW+lAq/OK1WOL8vk93GBDxtMIy6ocbj6lduyeLuqQ=='
          crossorigin='anonymous'
          referrerpolicy='no-referrer'
        ></script>
      </Head>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      <main className='ps-main'>
        <div className='ps-main__sidebar'>
          <div className='ps-sidebar'>
            <div className='ps-sidebar__top'>
              <WidgetUserWelcome vendor={vendor} />
            </div>
            <div className='ps-sidebar__content'>
              <div className='ps-sidebar__center'>
                <MenuSidebar />
              </div>
            </div>
            <div className='ps-sidebar__footer'>
              <FooterCopyright />
            </div>
          </div>
        </div>
        <div className='ps-main__wrapper'>{children}</div>
      </main>
    </div>
  );
};

export default connect((state) => state.app)(ContainerDashboard);
