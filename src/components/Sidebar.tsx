
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserAddOutlined,
  SettingOutlined,
  DollarOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  SyncOutlined,
  TeamOutlined,
  BarChartOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const { Sider } = Layout;

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (c: boolean) => void }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ height: '100%' }}
    >
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ background: '#fff', boxShadow: '2px 0 8px #f0f1f2', height: '100vh' }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={['painel']}
          style={{ height: '100%', borderRight: 0, fontWeight: 600, fontSize: 16 }}
          onClick={({ key }) => {
            if (key === 'painel') navigate('/');
            if (key === 'dashboard-financeiro') navigate('/dashboard/financeiro');
            if (key === 'dashboard-vendas') navigate('/dashboard/vendas');
            if (key === 'dashboard-clientes') navigate('/dashboard/clientes');
            if (key === 'dashboard-operacional') navigate('/dashboard/operacional');
            if (key === 'cadastros') navigate('/cadastros');
            if (key === 'financeiro') navigate('/financeiro');
            if (key === 'estoque') navigate('/estoque');
            if (key === 'relatorios') navigate('/relatorios');
            if (key === 'integracoes') navigate('/integracoes');
            if (key === 'usuarios') navigate('/usuarios');
            if (key === 'perfil') navigate('/perfil');
            if (key === 'permissao') navigate('/permissao');
            if (key === 'configuracoes') navigate('/configuracoes');
          }}
        >
          <Menu.Item key="painel" icon={<DashboardOutlined style={{ fontSize: 24, marginRight: 16 }} />}>
            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>PAINEL GERAL</motion.div>
          </Menu.Item>
          
          {/* Submenu de Dashboards Específicos */}
          <Menu.SubMenu 
            key="dashboards" 
            icon={<BarChartOutlined style={{ fontSize: 24, marginRight: 16 }} />} 
            title={<motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>DASHBOARDS</motion.div>}
          >
            <Menu.Item key="dashboard-financeiro" icon={<DollarOutlined style={{ fontSize: 18, marginRight: 12 }} />}>
              <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>Financeiro</motion.div>
            </Menu.Item>
            <Menu.Item key="dashboard-vendas" icon={<ShoppingOutlined style={{ fontSize: 18, marginRight: 12 }} />}>
              <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>Vendas</motion.div>
            </Menu.Item>
            <Menu.Item key="dashboard-clientes" icon={<TeamOutlined style={{ fontSize: 18, marginRight: 12 }} />}>
              <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>Clientes</motion.div>
            </Menu.Item>
            <Menu.Item key="dashboard-operacional" icon={<ToolOutlined style={{ fontSize: 18, marginRight: 12 }} />}>
              <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>Operacional</motion.div>
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.Item key="cadastros" icon={<UserAddOutlined style={{ fontSize: 24, marginRight: 16 }} />}>
            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>CADASTROS</motion.div>
          </Menu.Item>
          <Menu.Item key="financeiro" icon={<DollarOutlined style={{ fontSize: 24, marginRight: 16 }} />}>
            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>FINANCEIRO</motion.div>
          </Menu.Item>
          <Menu.Item key="estoque" icon={<ShoppingOutlined style={{ fontSize: 24, marginRight: 16 }} />}>
            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>ESTOQUE</motion.div>
          </Menu.Item>
          <Menu.Item key="relatorios" icon={<FileTextOutlined style={{ fontSize: 24, marginRight: 16 }} />}>
            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>RELATÓRIOS</motion.div>
          </Menu.Item>
          <Menu.Item key="integracoes" icon={<SyncOutlined style={{ fontSize: 24, marginRight: 16 }} />}>
            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>INTEGRAÇÕES</motion.div>
          </Menu.Item>
          <Menu.SubMenu key="sistema" icon={<SettingOutlined style={{ fontSize: 24, marginRight: 16 }} />} title={<motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>SISTEMA</motion.div>}>
            <Menu.Item key="usuarios"><motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>USUÁRIOS</motion.div></Menu.Item>
            <Menu.Item key="perfil"><motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>PERFIL</motion.div></Menu.Item>
            <Menu.Item key="permissao"><motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>PERMISSÕES</motion.div></Menu.Item>
            <Menu.Item key="configuracoes"><motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>CONFIGURAÇÕES</motion.div></Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
    </motion.div>
  );
} 