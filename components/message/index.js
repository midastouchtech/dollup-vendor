// pages/message.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { Popover, Button, Tag } from 'antd';

const placeholder = 'https://via.placeholder.com/150';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  cursor: pointer;
  color: #fff;
`;

const SenderInfo = styled.div`
  display: flex;
  cursor: pointer;
  color: #0891b2;
  width: 100%;
`;

const AvatarContainer = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  background-color: ${(props) => (props.primary ? '#2b3334' : '#e5e7eb')};
  color: #fff;
  p {
    color: ${(props) => (props.primary ? '#fff' : '#2b3334')};
  }
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 48px;
  padding: 4px;
  border-radius: 4px;
`;

const CustomPopoverContent = styled.div`
  width: 384px;
  padding: 12px;
  background-color: #f9fafb;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 8px;
`;

const Message = ({ message }) => {
  const tags = [
    ...(message?.servicesTagged || []),
    ...(message?.stylistsTagged || []),
    ...(message?.productsTagged || []),
  ];

  const [popoverContent, setPopoverContent] = useState(null);

  const handleTagClick = (tag) => {
    setPopoverContent(renderTagPopoverContent(tag));
  };

  const renderTagPopoverContent = (tag) => {
    if (tag.salePrice) {
      // Product or Service
      return (
        <CustomPopoverContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <Button type='default' size='small'>
                  {tag.title ? 'Product' : 'Service'}
                </Button>
                <Button
                  type='primary'
                  size='small'
                  style={{ marginLeft: '8px' }}
                >
                  {tag.title ? 'Buy' : 'Book'}
                </Button>
              </div>
              <h3 style={{ fontWeight: 'bold', color: '#111827' }}>
                {tag.name || tag.title}
              </h3>
              <p>{tag.subTitle || 'No subtitle'}</p>
              <p
                style={{
                  color: '#10b981',
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              >
                R{tag.salePrice}
              </p>
              {tag.category && (
                <div style={{ marginBottom: '8px' }}>
                  <Tag color='cyan'>{tag.category.name}</Tag>
                </div>
              )}
              {tag.subCategory && (
                <div style={{ marginBottom: '8px' }}>
                  <Tag color='geekblue'>{tag.subCategory.name}</Tag>
                </div>
              )}
              {tag.duration && (
                <p>
                  Duration: {tag.duration.hours}h {tag.duration.minutes}m
                </p>
              )}
              <p>
                <Tag color={tag.active ? 'green' : 'red'}>
                  {tag.active ? 'Active' : 'Inactive'}
                </Tag>
              </p>
            </div>
            <img
              src={tag.thumbnail || placeholder}
              alt={tag.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>
        </CustomPopoverContent>
      );
    } else {
      // Stylist
      return (
        <CustomPopoverContent>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <a href='#'>
              <img
                src={tag.avatar || placeholder}
                alt={tag.name}
                style={{ width: '48px', height: '48px', borderRadius: '50%' }}
              />
            </a>
            <Button type='primary' size='small'>
              Book
            </Button>
          </div>
          <p style={{ fontWeight: 'bold', marginTop: '8px' }}>{tag.name}</p>
          {tag.email && (
            <div style={{ marginBottom: '8px' }}>
              <Tag color='blue'>{tag.email}</Tag>
            </div>
          )}
          {tag.cellphone && (
            <div style={{ marginBottom: '8px' }}>
              <Tag color='cyan'>{tag.cellphone}</Tag>
            </div>
          )}
          <p>
            <Tag color={tag.active ? 'green' : 'red'}>
              {tag.active ? 'Active' : 'Inactive'}
            </Tag>
          </p>
        </CustomPopoverContent>
      );
    }
  };

  return (
    <Container>
      <SenderInfo>
        {message.senderType === 'vendor' ? (
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'end' }}
          >
            <MessageContent primary>
              <p
                className='font-semibold'
                style={{ fontSize: '10px', fontWeight: 'light' }}
              >
                {message.sender?.name || message.sender?.storeName}
              </p>
              <p style={{ fontSize: '14px' }}>{message.message}</p>
            </MessageContent>
            <AvatarContainer>
              <img
                src={message.sender.avatar || placeholder}
                alt='User Avatar'
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              />
            </AvatarContainer>
          </div>
        ) : (
          <>
            <AvatarContainer>
              <img
                src={message.sender.avatar || placeholder}
                alt='User Avatar'
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              />
            </AvatarContainer>
            <MessageContent>
              <p
                className='font-semibold'
                style={{ fontSize: '10px', fontWeight: 'light' }}
              >
                {message.sender?.name || message.sender?.storeName}
              </p>
              <p style={{ fontSize: '14px' }}>{message.message}</p>
            </MessageContent>
          </>
        )}
      </SenderInfo>
      {tags.length > 0 && (
        <TagContainer>
          {tags.map((tag) => (
            <Popover
              key={tag.id}
              content={popoverContent}
              title={null}
              placement='bottom'
              trigger='hover'
            >
              <Button
                type='link'
                style={{ padding: 0, margin: '0 8px 8px 0' }}
                onMouseEnter={() => handleTagClick(tag)}
              >
                @{tag.name || tag.title}
              </Button>
            </Popover>
          ))}
        </TagContainer>
      )}
    </Container>
  );
};

export default Message;
