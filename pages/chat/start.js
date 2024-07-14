import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaSearch, FaUserAlt, FaStoreAlt } from 'react-icons/fa';
import { Layout, Input, Button, List, Avatar, Alert, Spin } from 'antd';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ContainerDashboard from '~/components/layouts/ContainerDashboard';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';

const { Header, Content } = Layout;

const Container = styled.div`
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(to top, #00c6ff, #0072ff);
`;

const CustomButton = styled(Button)`
  margin-right: 8px;
`;

const StartChat = ({ user }) => {
  const router = useRouter();
  const { id: vendorId } = router.query;
  const [vendors, setVendors] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(vendorId || '');
  const [selectedStylist, setSelectedStylist] = useState('');
  const [chatType, setChatType] = useState('');
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingStylists, setLoadingStylists] = useState(false);
  const [chatCreateLoading, setChatCreateLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [chatError, setChatError] = useState(null);

  useEffect(() => {
    if (vendorId) {
      fetchStylists(vendorId);
    }
  }, [vendorId]);

  const fetchStylists = async (id) => {
    setChatType('stylist');
    setLoadingStylists(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vendors/find/${id}`
      );
      setStylists(response.data.stylists);
      setSelectedVendor(id);
    } catch (error) {
      console.error('Error fetching stylists:', error);
    }
    setLoadingStylists(false);
  };

  const searchVendors = async (term) => {
    setLoadingVendors(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vendors/find-by-name?name=${term}`
      );
      setVendors(response.data);
    } catch (error) {
      console.error('Error searching vendors:', error);
    }
    setLoadingVendors(false);
  };

  const createChat = async (entityId, entityType) => {
    try {
      setChatCreateLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/create`,
        {
          userId: user.id,
          with: entityId,
          type: entityType,
        }
      );
      if (response.data) {
        setConversation(response.data);
        setChatCreateLoading(false);
        setChatError(null);
      }
      if (response.error) {
        setChatError('Something went wrong creating chat. Please try again.');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleVendorSearch = (e) => {
    e.preventDefault();
    const term = e.target.vendorSearch.value;
    searchVendors(term);
  };

  const handleStartChat = () => {
    const entityId = chatType === 'vendor' ? selectedVendor : selectedStylist;
    const entityType = chatType;
    createChat(entityId, entityType);
  };

  const placeholderImage = 'https://via.placeholder.com/50';

  const canStartChat =
    user && (chatType === 'vendor' ? selectedVendor : selectedStylist);

  return (
    <ContainerDashboard title='Start chat'>
      <HeaderDashboard
        title='Customers'
        description='Dollup Customer Listing'
      />
      <Header>
        <h1 style={{ color: 'white' }}>Start a Chat</h1>
      </Header>
      <Content>
        <Container>
          {!user && (
            <Alert
              message='You are not logged in!'
              description='To start a chat, you must be logged in.'
              type='error'
              showIcon
              action={
                <Button
                  type='primary'
                  onClick={() =>
                    router.push(
                      `/login?backto=/chat/start${
                        vendorId ? `?id=${vendorId}` : ''
                      }`
                    )
                  }
                >
                  Log in
                </Button>
              }
              style={{ marginBottom: 24 }}
            />
          )}

          <p>
            Welcome to the chat feature! You can start a conversation with a
            vendor or one of their stylists. Please follow the steps below to
            initiate a chat.
          </p>

          {!vendorId && (
            <form onSubmit={handleVendorSearch} style={{ marginBottom: 24 }}>
              <Input.Search
                name='vendorSearch'
                placeholder='Search for a vendor'
                enterButton={<FaSearch />}
                onSearch={(value) => searchVendors(value)}
              />
            </form>
          )}

          {loadingVendors && (
            <Spin tip='Finding vendors...' style={{ marginBottom: 24 }} />
          )}

          {vendors?.length > 0 && (
            <List
              header={<div>Select a Vendor</div>}
              bordered
              dataSource={vendors}
              renderItem={(vendor) => (
                <List.Item
                  onClick={() => setSelectedVendor(vendor.id)}
                  style={{
                    cursor: 'pointer',
                    background:
                      selectedVendor === vendor.id ? '#e6f7ff' : 'white',
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={vendor.avatar || placeholderImage} />}
                    title={vendor.storeName}
                  />
                  <Button
                    type={selectedVendor === vendor.id ? 'default' : 'primary'}
                  >
                    Chat
                  </Button>
                </List.Item>
              )}
            />
          )}

          {selectedVendor && (
            <div style={{ marginBottom: 24 }}>
              <h2>Chat with the Salon or a Stylist?</h2>
              <div>
                <CustomButton
                  type={chatType === 'vendor' ? 'primary' : 'default'}
                  icon={<FaStoreAlt />}
                  onClick={() => setChatType('vendor')}
                >
                  Chat with Salon
                </CustomButton>
                <CustomButton
                  type={chatType === 'stylist' ? 'primary' : 'default'}
                  icon={<FaUserAlt />}
                  onClick={() => fetchStylists(selectedVendor)}
                >
                  Chat with Stylist
                </CustomButton>
              </div>
            </div>
          )}

          {loadingStylists && (
            <Spin tip='Loading stylists...' style={{ marginBottom: 24 }} />
          )}

          {chatType === 'stylist' && stylists?.length > 0 && (
            <List
              header={<div>Select a Stylist</div>}
              bordered
              dataSource={stylists}
              renderItem={(stylist) => (
                <List.Item
                  onClick={() => setSelectedStylist(stylist.id)}
                  style={{
                    cursor: 'pointer',
                    background:
                      selectedStylist === stylist.id ? '#e6f7ff' : 'white',
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={stylist.avatar || placeholderImage} />}
                    title={stylist.name}
                  />
                  <Button
                    type={
                      selectedStylist === stylist.id ? 'default' : 'primary'
                    }
                  >
                    Chat
                  </Button>
                </List.Item>
              )}
            />
          )}

          {chatType === 'stylist' &&
            stylists?.length === 0 &&
            !loadingStylists && (
              <Alert message='No stylists for vendor' type='info' showIcon />
            )}

          <div style={{ marginTop: 24 }}>
            <Button
              type='primary'
              onClick={handleStartChat}
              disabled={!canStartChat}
              loading={chatCreateLoading}
            >
              Start Chat
            </Button>
            {conversation && (
              <Button
                type='success'
                onClick={() =>
                  router.push(
                    `/chat?with=${conversation.with.id}&type=${conversation.type}`
                  )
                }
                style={{ marginLeft: 8 }}
              >
                Go to chat
              </Button>
            )}
          </div>
          {chatError && (
            <Alert
              message='Error'
              description={chatError}
              type='error'
              showIcon
              action={
                <Button type='default' onClick={() => router.push('/')}>
                  Go to home
                </Button>
              }
              style={{ marginTop: 24 }}
            />
          )}
        </Container>
      </Content>
    </ContainerDashboard>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth, // Assuming your user state is stored under 'auth'
  };
};

export default connect(mapStateToProps)(StartChat);
