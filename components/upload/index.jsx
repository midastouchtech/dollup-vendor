import React, { useEffect, useState } from 'react';
import { message, Upload, Progress, Space } from 'antd';
import axios from 'axios';
import { isEmpty, isNil } from 'ramda';
import dynamic from 'next/dynamic';

const ImgCrop = dynamic(import('antd-img-crop'), { ssr: false });

const exists = (i) => !isEmpty(i) && !isNil(i);

const App = ({ onUploadComplete, existingFileList, onExistingFileDelete }) => {
  let [fileList, setFileList] = useState();
  useEffect(() => {
    if (exists(existingFileList)) {
      setFileList(existingFileList);
    }
  }, [existingFileList]);
  const [canUpload, setCanUpload] = useState(true);
  const [progress, setProgress] = useState(0);
  const onChange = ({ fileList }) => {
    if (canUpload) {
      setFileList(fileList);
      const file = fileList[0]?.originFileObj;
      const url =
        'https://api.cloudinary.com/v1_1/midas-touch-technoogies/raw/upload';
      const formData = new FormData();
      if (file) {
        console.log('uploading', file);
        formData.append('file', file);
        formData.append('upload_preset', 'lcemibrf');
        formData.append('api_key', '529993435491544');
        axios({
          method: 'POST',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentage =
              (progressEvent.loaded * 100) / progressEvent.total;
            setProgress(+percentage.toFixed(2));
          },
          url,
        })
          .then((response) => {
            console.log('upload complete', response.data.secure_url);
            onUploadComplete(response.data.secure_url);
          })
          .then((data) => {});
      }
    } else {
      setCanUpload(true);
    }
  };

  const beforeUpload = (file) => {
    setFileList([]);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      setCanUpload(false);
    }
    return false;
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onRemove = (file) => {
    onExistingFileDelete(file);
  };
  return (
    <Upload
      listType='picture-card'
      fileList={fileList}
      onChange={onChange}
      onPreview={onPreview}
      onRemove={onRemove}
      beforeUpload={beforeUpload}
    >
      {(progress === 0 || progress === 100) && '+ Upload'}
      {progress > 0 && progress < 100 && (
        <Space wrap>
          <Progress size='small' percent={progress} />
        </Space>
      )}
    </Upload>
  );
};
export default App;
