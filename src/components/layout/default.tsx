import React, {useState} from 'react'
import Meta from '@/components/meta'
import Footer from '@/components/footer'
import {Avatar, Button, Dropdown, Image, Layout, Menu} from 'antd'
import {LoginOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined,} from '@ant-design/icons';
import styles from './Layout.module.scss';
import {useAuth} from "@/hooks/useAuth";
import {removeCookies} from "@/utils/cookies";
import {KEY_ACCESS_TOKEN, KEY_ORG_TOKEN, KEY_USER} from "@/constants/common";
import {useRouter} from "next/router";

type LayoutProps = {
  children: React.ReactNode;
};

const {Content, Sider, Header} = Layout;

const LayoutDefault = ({children}: LayoutProps) => {
  const {user} = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await removeCookies(KEY_ORG_TOKEN);
    await removeCookies(KEY_ACCESS_TOKEN);
    await removeCookies(KEY_USER);
    router.push('/login');
  }

  return (
    <Layout className={`${styles.layoutContainer} site-layout`}>
      <Meta/>
      <Sider trigger={null}
             collapsible
             collapsed={collapsed}>
        <div className={styles.logo} onClick={() => router.push('/invoices')}>
          <Image src='/images/logo2x.png'/>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined/>,
              label: 'Invoices',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className={styles.header}>

          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
          {user?.data ?
            <Dropdown
              overlay={
                <Menu
                  style={{width: 160}}
                  items={[
                    {
                      key: '3',
                      label: (
                        <Button type='link' onClick={(e) => {
                          e?.preventDefault();
                          handleLogout();
                        }}>Logout</Button>
                      ),
                      icon: <LoginOutlined/>,
                    },
                  ]}
                />
              }
              placement="bottomRight"
            >
              <a onClick={e => e.preventDefault()}>
                <Avatar
                  size={24}
                  icon={<UserOutlined/>}
                /> <span
                className={styles.headerProfile}>Hi, {`${user?.data?.firstName} ${user?.data?.lastName}`}</span>
              </a>
            </Dropdown> : null
          }
        </Header>
        <Content className={styles.content}>
          {children}
        </Content>
        <Footer/>
      </Layout>
    </Layout>
  );
}

export default LayoutDefault;
