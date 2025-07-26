import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const { Content } = Layout;

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Layout style={{ minHeight: '100vh', flexDirection: 'row' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Navbar now={new Date()} />
        <Content
          style={{
            margin: 0,
            padding: '12px 12px',
            background: '#f5f6fa',
            minHeight: '100vh',
            maxWidth: 1600,
            marginLeft: '2px',
            marginRight: '2px',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
} 