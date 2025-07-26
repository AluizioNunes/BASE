
import { Layout, Avatar, Badge, Button } from 'antd';
import { CalendarOutlined, SettingOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

const { Header } = Layout;

export default function Navbar({ now }: { now: Date }) {
  return (
    <Header style={{ background: '#fff', boxShadow: '0 2px 8px #f0f1f2', height: 64, padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <CalendarOutlined style={{ fontSize: 18, color: '#888' }} />
        <span style={{ color: '#888', fontWeight: 500 }}>{format(now, 'dd/MM/yyyy, HH:mm:ss')}</span>
        <Badge color="green" text="Conectado há 00:00:00" style={{ marginLeft: 16 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Avatar style={{ backgroundColor: '#2563eb' }}>RF</Avatar>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', minWidth: 100 }}>
          <span style={{ fontWeight: 700, lineHeight: 1 }}>ALUIZIO NUNES</span>
          <span style={{ fontSize: 12, color: '#888', lineHeight: 1.2 }}>Administrador</span>
        </div>
        <Button shape="circle" icon={<SettingOutlined />} style={{ marginLeft: 8 }} />
      </div>
    </Header>
  );
} 