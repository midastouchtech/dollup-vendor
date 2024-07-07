import React from 'react';
import Upload from '~/components/upload';
import AutoComplete from '~/components/autocomplete';
import { Select, Form, notification } from 'antd';

const FormAccountSettings = ({ vendor, socket }) => {
  console.log('form', vendor);
  const [details, setDetails] = React.useState({
    fullName: '',
    storeName: '',
    email: '',
    cell: '',
    address: '',
    bio: '',
    category: '',
    avatar: '',
    bannerImages: [],
    ...vendor,
  });
  const [subCategories, setSubCategories] = React.useState([]);

  const [updatedVendor, setUpdatedVendor] = React.useState(false);

  if (socket && !updatedVendor) {
    socket.emit('GET_VENDOR', { id: vendor?.id });
    socket.on('RECEIVE_VENDOR', (data) => {
      setDetails(data);
      setUpdatedVendor(true);
      console.log('updatedvendor', data);
    });
    socket.emit('GET_NEXT_PAGE_SUB_CATEGORIES', { page: 0, pageLimit: 250 });
    socket.on('RECEIVE_NEXT_PAGE_SUB_CATEGORIES', (data) => {
      setSubCategories(data.subCategories);
    });
  }
  const setDetail = (key, value) => {
    setDetails({
      ...details,
      [key]: value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    socket.emit('UPDATE_VENDOR', { ...vendor, ...details });
    socket.on('UPDATE_VENDOR_SUCCESS', () => {
      console.log('Vendor update success');
      notification.success({
        key: 'vendore-edti',
        message: 'Success!',
        description: 'Your profile has been successfully updated',
      });
    });
  };
  console.log('subcategories', subCategories);
  console.log('details', details);
  return (
    <form className='ps-form--account-settings'>
      <div className='row'>
        <div className='col-sm-6'>
          <div className='form-group'>
            <label>Full Name</label>
            <input
              className='form-control'
              type='text'
              placeholder=''
              value={details?.fullName}
              onChange={(e) => setDetail('fullName', e.target.value)}
            />
          </div>
        </div>
        <div className='col-sm-6'>
          <div className='form-group'>
            <label>Salon Name</label>
            <input
              className='form-control'
              type='text'
              placeholder=''
              value={details?.storeName}
              onChange={(e) => setDetail('storeName', e.target.value)}
            />
          </div>
        </div>
        <div className='col-sm-12'>
          <div className='form-group'>
            <label>Email</label>
            <input
              className='form-control'
              type='text'
              placeholder=''
              value={details?.email}
              onChange={(e) => setDetail('email', e.target.value)}
            />
          </div>
        </div>
        <div className='col-sm-12'>
          <div className='form-group'>
            <label>Contact Number</label>
            <input
              className='form-control'
              type='text'
              placeholder=''
              value={details?.cell}
              onChange={(e) => setDetail('cell', e.target.value)}
            />
          </div>
        </div>
        <div className='col-sm-12'>
          <div className='form-group'>
            <label>Address</label>
            <AutoComplete
              value={details?.address}
              onChange={(address) => setDetail('address', address)}
              onSelect={(address, coordinates) => {
                setDetails({
                  ...details,
                  ['address']: address,
                  ['location']: { type: 'Point', coordinates },
                });
              }}
            />
          </div>
        </div>
        <div className='col-sm-12'>
          <div className='form-group'>
            <label>Salon Main Category</label>
            <Select
              className='ps-ant-dropdown'
              defaultValue={details?.category.id}
              onChange={(value) => {
                const category = subCategories.find((c) => c.id === value);
                setDetail('category', category);
              }}
            >
              {subCategories?.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category?.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        <div className='col-sm-12'>
          <div className='form-group'>
            <label>Salon Bio</label>
            <textarea
              className='form-control'
              rows='6'
              placeholder=''
              value={details?.bio}
              onChange={(e) => setDetail('bio', e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className='col-sm-12'>
          <div className='form-group'>
            <label>Stylist Commision</label>
            <Select
              className='ps-ant-dropdown'
              defaultValue={details?.stylistCommision}
              onChange={(value) => setDetail('stylistCommision', value)}
            >
              <Select.Option value={0}>0%</Select.Option>
              <Select.Option value={5}>5%</Select.Option>
              <Select.Option value={10}>10%</Select.Option>
              <Select.Option value={15}>15%</Select.Option>
              <Select.Option value={20}>20%</Select.Option>
              <Select.Option value={25}>25%</Select.Option>
              <Select.Option value={30}>30%</Select.Option>
              <Select.Option value={35}>35%</Select.Option>
              <Select.Option value={40}>40%</Select.Option>
              <Select.Option value={45}>45%</Select.Option>
              <Select.Option value={50}>50%</Select.Option>
            </Select>
          </div>
        </div>
        <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
          <figure className='ps-block--form-box'>
            <figcaption>Salon profile Image</figcaption>
            <div className='ps-block__content'>
              <p>Please upload 1 square cropped image </p>
              <div className='form-group'>
                <Upload
                  existingFileList={
                    details?.avatar ? [{ url: details.avatar }] : []
                  }
                  onExistingFileDelete={() => setDetail('avatar', '')}
                  onUploadComplete={(url) => setDetail('avatar', url)}
                />
              </div>
            </div>
          </figure>
        </div>
        <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
          <figure className='ps-block--form-box'>
            <figcaption>Salon banner images</figcaption>
            <div className='ps-block__content'>
              <p>
                Please upload up to 4 images. Images must have 1650 × 650
                dimensions{' '}
              </p>
              <div className='form-group'>
                <Upload
                  existingFileList={
                    details?.bannerImages
                      ? details.bannerImages.map((i) => ({ url: i }))
                      : []
                  }
                  onExistingFileDelete={(img) => {
                    const images = details?.bannerImages ?? [];
                    console.log('removing', img);
                    const bannerImages = images.filter((i) => i !== img.url);
                    setDetail('bannerImages', bannerImages);
                  }}
                  onUploadComplete={(url) => {
                    const images = details?.bannerImages ?? [];
                    const bannerImages = [...images, url];
                    setDetail('bannerImages', bannerImages);
                  }}
                />
              </div>
            </div>
          </figure>
        </div>
      </div>
      <div className='ps-form__submit text-center'>
        <button className='ps-btn success' onClick={onSubmit}>
          Update Profile
        </button>
      </div>
    </form>
  );
};

export default FormAccountSettings;
