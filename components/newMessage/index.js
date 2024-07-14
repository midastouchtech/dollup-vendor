// pages/new-message.js

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Select, Input, Tag } from 'antd';
import { assoc } from 'ramda';

const { TextArea } = Input;
const { Option } = Select;

const Container = styled.div`
  padding: 24px;
  background-color: #f9f9f9;
  border: 2px solid #ececec;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  .tag-select {
    display: flex;
    margin-top: 16px;
    align-items: center;
    justify-content: start;
  }
`;

const NewMessage = ({ message, onSend, vendor }) => {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [messageContent, setMessageContent] = useState(message?.message);
  const [taggedServices, setTaggedServices] = useState(
    message?.taggedServices || []
  );
  const [taggedStylists, setTaggedStylists] = useState(
    message?.taggedStylists || []
  );
  const [taggedProducts, setTaggedProducts] = useState(
    message?.taggedProducts || []
  );
  const [tagType, setTagType] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const fetchFullVendor = async () => {
    console.log('fetching full vendor');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/vendors/find/${vendor.id}`
    );
    const data = await response.json();
    console.log('data', data);
    setServices(data.services);
    setProducts(data.products);
    setStylists(data.stylists);
    return data;
  };

  const handleSave = () => {
    onSend({
      ...message,
      message: messageContent,
      taggedServices,
      taggedStylists,
      taggedProducts,
    });
    setMessageContent('');
    setTaggedServices([]);
    setTaggedStylists([]);
    setTaggedProducts([]);
  };

  const handleAddTag = () => {
    if (tagType && selectedTag) {
      switch (tagType) {
        case 'service':
          setTaggedServices([...taggedServices, selectedTag]);
          break;
        case 'product':
          setTaggedProducts([...taggedProducts, selectedTag]);
          break;
        case 'stylist':
          setTaggedStylists([...taggedStylists, selectedTag]);
          break;
        default:
          break;
      }
      setTagType('');
      setSelectedTag(null);
    }
  };

  useEffect(() => {
    fetchFullVendor();
  }, []);

  console.log('vendor', vendor);

  return (
    <Container>
      <TextArea
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder='Type your message?...'
        rows={4}
      />
      <div className='tags'>
        {taggedServices.map((service) => (
          <Tag color='blue' key={service.id}>
            {service.name}
          </Tag>
        ))}
        {taggedProducts.map((product) => (
          <Tag color='gold' key={product.id}>
            {product.title}
          </Tag>
        ))}
        {taggedStylists.map((stylist) => (
          <Tag color='magenta' key={stylist.id}>
            {stylist.name}
          </Tag>
        ))}
      </div>
      <div className='tag-select'>
        <Select
          value={tagType}
          size='large'
          onChange={(value) => setTagType(value)}
          placeholder='Select tag type'
          style={{ width: 120, marginRight: 8 }}
        >
          <Option value='service'>Service</Option>
          <Option value='product'>Product</Option>
          <Option value='stylist'>Stylist</Option>
        </Select>
        {tagType && (
          <Select
            value={selectedTag ? selectedTag.id : ''}
            onChange={(value) => {
              const tagList =
                tagType === 'service'
                  ? services
                  : tagType === 'product'
                  ? products
                  : stylists;
              const tag = tagList.find((item) => item.id === value);
              setSelectedTag(tag);
            }}
            placeholder={`Select ${tagType}`}
            style={{ width: 240, marginRight: 8 }}
            size='large'
            showSearch
            optionFilterProp={tagType === 'product' ? 'title' : 'name'}
            filterSort={(optionA, optionB) => {
              console.log('optionA', optionA);
              console.log('optionB', optionB);
              return optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase());
            }}
          >
            {(tagType === 'service'
              ? services
              : tagType === 'product'
              ? products
              : stylists
            ).map((tag) => (
              <Option key={tag.id} value={tag.id}>
                {tag.name || tag.title}
              </Option>
            ))}
          </Select>
        )}
        <Button size='large' type='warning' onClick={handleAddTag}>
          Add Tag
        </Button>
      </div>
      <Button
        type='primary'
        size='large'
        onClick={handleSave}
        style={{ marginTop: 16 }}
      >
        Send
      </Button>
    </Container>
  );
};

export default NewMessage;
