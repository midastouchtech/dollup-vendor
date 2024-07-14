import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  Layout,
  Menu,
  Button,
  List,
  Avatar,
  Input,
  message as antdMessage,
  theme,
} from 'antd';
import moment from 'moment';
import { last } from 'ramda';
import ContainerDashboard from '~/components/layouts/ContainerDashboard';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import NewMessage from '~/components/newMessage';
import Message from '~/components/message';

const { Header, Sider, Content, Footer } = Layout;
const { TextArea } = Input;

const ChatWrapper = styled.div`
  max-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: center;
  background: #fff;
`;

const ChatLayout = styled(Layout)`
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const ChatHeader = styled(Header)`
  color: white;
  padding: 24px;
`;

const ChatSider = styled(Sider)`
  overflow-y: auto;
`;

const ChatContent = styled(Content)`
  background: #fff;
  overflow-y: auto;
`;

const Chat = ({ vendor }) => {
  const router = useRouter();
  const { query } = router;
  const entity = query.with;
  const entityType = query.type;

  const [conversation, setConversation] = useState([]);
  const [menuVisible, setMenuVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [fetchedConversation, setFetchedConversation] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState({
    message: '',
    taggedServices: [],
    taggedStylists: [],
    taggedProducts: [],
  });

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const fetchConversation = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/conversations/${vendor?.id}?with=${entity}&type=${entityType}`
      );
      const data = await response.json();
      setConversation(data);
      setFetchedConversation(true);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllUserConversations = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/conversations/user/${vendor?.id}`
      );
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const startNewConversation = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/conversations/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: vendor?.id,
            with: entity,
            type: entityType,
          }),
        }
      );
      const data = await response.json();
      setConversation(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchConversationMessages = async (conversationId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/conversations/${conversationId}/messages`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    fetchConversationMessages(conversation.id);
  };

  const handleSendMessage = async (m) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/conversations/add/message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderType: 'vendor',
            sender: vendor,
            receipient: conversation?.user,
            message: m?.message,
            attachments: [],
            servicesTagged: m?.taggedServices,
            stylistsTagged: m?.taggedStylists,
            productsTagged: m?.taggedProducts,
            timeSent: new Date(),
            read: false,
            conversation: {
              id: selectedConversation.id,
              user: {
                id: selectedConversation?.user.id,
                firstName: selectedConversation?.user?.firstName,
                lastName: selectedConversation?.user?.lastName,
              },
              with: {
                id: selectedConversation?.with?.id,
                name:
                  selectedConversation?.with?.salonName ||
                  selectedConversation?.with?.name,
              },
              type: selectedConversation?.type,
            },
          }),
        }
      );
      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage({
        message: '',
        taggedServices: [],
        taggedStylists: [],
        taggedProducts: [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (vendor) {
      fetchAllUserConversations();
    }
  }, [vendor]);

  const handleStartConvClick = async () => {
    await startNewConversation();
    await fetchAllUserConversations();
    handleConversationClick(last(conversations));
  };

  const placeholder = 'https://via.placeholder.com/150';
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <ContainerDashboard title='Start chat'>
      <ChatWrapper>
        <ChatLayout>
          <ChatSider
            collapsible
            collapsed={!menuVisible}
            theme='light'
            className='red-9'
          >
            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode='inline'
              theme='light'
              inlineCollapsed={menuVisible}
              items={[
                { key: '1', icon: '', label: 'New Chat' },
                { key: '2', icon: '', label: 'Refresh' },
                {
                  key: 'stylistchats',
                  label: 'Stylist Chats',

                  children: conversations
                    .filter((c) => c.type === 'stylist')
                    .map((conv) => ({
                      key: conv.id
                        .split('')
                        .map((c) => c.charCodeAt(0))
                        .join('')
                        .toString()
                        .slice(0, 8)
                        .toUpperCase(),
                      icon: <Avatar src={conv?.with?.avatar} />,
                      label: conv.with.name,
                      onClick: () => handleConversationClick(conv),
                    })),
                },
                {
                  key: 'salonchats',
                  label: 'Salon Chats',

                  children: conversations
                    .filter((c) => c.type !== 'stylist')
                    .map((conv) => ({
                      key: conv.id
                        .split('')
                        .map((c) => c.charCodeAt(0))
                        .join('')
                        .toString()
                        .slice(0, 8)
                        .toUpperCase(),
                      icon: <Avatar src={conv.user.avatar} />,
                      onClick: () => handleConversationClick(conv),
                      label: conv.user.name,
                    })),
                },
              ]}
            />
            {/* <Menu
              defaultSelectedKeys={['1']}
              style={{ height: '100%' }}
              defaultOpenKeys={['sub1']}
              mode='inline'
              theme='dark'
              inlineCollapsed={menuVisible}
              items={[
                { key: '1', title: 'New Chat' },
                { key: '2', title: 'Refresh' },
              ]}
            >
              <Menu.Item key='1'>
                <Button type='primary' onClick={handleStartConvClick}>
                  New Chat
                </Button>
              </Menu.Item>
              <Menu.Item key='2'>
                <Button type='default' onClick={fetchAllUserConversations}>
                  Refresh
                </Button>
              </Menu.Item>
              {conversations.map((conv) => (
                <Menu.Item
                  key={conv.id}
                  onClick={() => handleConversationClick(conv)}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={conv?.with?.avatar || placeholder} />}
                    title={conv?.user?.name || conv.user.storeName}
                    description={moment(conv?.creationDate).fromNow()}
                  />
                </Menu.Item>
              ))}
            </Menu> */}
          </ChatSider>
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
              <Button
                type='text'
                icon={
                  menuVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                }
                onClick={() => toggleMenu()}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              Chat with{' '}
              {selectedConversation?.with?.name ||
                selectedConversation?.with?.storeName}
            </Header>
            <Content style={{ margin: '20px 50px', overflowY: 'scroll' }}>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                {selectedConversation ? (
                  <List
                    dataSource={messages}
                    renderItem={(message) => <Message message={message} />}
                  />
                ) : (
                  <div>
                    <p>Select a conversation to view messages</p>
                    <Button type='primary' onClick={handleStartConvClick}>
                      New Chat
                    </Button>
                    <Button type='default' onClick={fetchAllUserConversations}>
                      Refresh
                    </Button>
                    {!vendor && (
                      <div>
                        <p>
                          You are not logged in, please sign in to start a chat.
                        </p>
                        <Link href='/login'>Login to chat</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Content>
            <Footer
              style={{
                textAlign: 'center',
                background: 'transparent',
                padding: '0px',
              }}
            >
              {selectedConversation && (
                <NewMessage
                  value={newMessage}
                  onChange={setNewMessage}
                  onSend={handleSendMessage}
                  vendor={vendor}
                />
              )}
            </Footer>
          </Layout>
        </ChatLayout>
      </ChatWrapper>
    </ContainerDashboard>
  );
};

export default connect((state) => state.app)(Chat);
