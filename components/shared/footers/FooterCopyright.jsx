import React from 'react';

const FooterCopyright = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className='ps-copyright'>
      <h3>Dollup</h3>
      <small> Beauty Services Bookings</small>
      <br />
      <small>All rights reversed. &copy; {currentYear} Dollup .</small>
    </div>
  );
};

export default FooterCopyright;
