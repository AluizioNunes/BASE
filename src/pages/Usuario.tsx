import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Table, 
  Avatar, 
  Tag, 
  Input, 
  Select, 
  Space, 
  Tooltip, 
  Badge,
  Switch,
  Dropdown,
  Menu,
  message,
  Typography
} from 'antd';
import { 
  UserAddOutlined, 
  SearchOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  CrownOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  MailOutlined,
  CalendarOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  TableOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import UsuarioModal from '../components/UsuarioModal';

const { Title, Text } = Typography;
const { Option } = Select;

// Tipos TypeScript
interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: 'Administrador' | 'Gerente' | 'Usuário';
  status: 'ativo' | 'inativo' | 'bloqueado';
  dataCriacao: string;
  ultimoLogin: string;
  tentativasLogin: number;
  mfaAtivo: boolean;
  avatar: string;
}

// Dados mockados para demonstração
const mockUsuarios: Usuario[] = [
  { 
    id: 1, 
    nome: 'Renata Ferreira', 
    email: 'renata@email.com', 
    perfil: 'Administrador',
    status: 'ativo',
    dataCriacao: '2024-01-15',
    ultimoLogin: '2024-01-20',
    tentativasLogin: 0,
    mfaAtivo: true,
    avatar: 'RF'
  },
  { 
    id: 2, 
    nome: 'João Silva', 
    email: 'joao@email.com', 
    perfil: 'Usuário',
    status: 'ativo',
    dataCriacao: '2024-01-10',
    ultimoLogin: '2024-01-19',
    tentativasLogin: 0,
    mfaAtivo: false,
    avatar: 'JS'
  },
  { 
    id: 3, 
    nome: 'Maria Souza', 
    email: 'maria@email.com', 
    perfil: 'Usuário',
    status: 'inativo',
    dataCriacao: '2024-01-05',
    ultimoLogin: '2024-01-15',
    tentativasLogin: 3,
    mfaAtivo: true,
    avatar: 'MS'
  },
  { 
    id: 4, 
    nome: 'Carlos Santos', 
    email: 'carlos@email.com', 
    perfil: 'Gerente',
    status: 'ativo',
    dataCriacao: '2024-01-12',
    ultimoLogin: '2024-01-20',
    tentativasLogin: 0,
    mfaAtivo: true,
    avatar: 'CS'
  },
  { 
    id: 5, 
    nome: 'Ana Costa', 
    email: 'ana@email.com', 
    perfil: 'Usuário',
    status: 'bloqueado',
    dataCriacao: '2024-01-08',
    ultimoLogin: '2024-01-18',
    tentativasLogin: 5,
    mfaAtivo: false,
    avatar: 'AC'
  }
];

export default function Usuario() {
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [searchText, setSearchText] = useState('');
  const [filterPerfil, setFilterPerfil] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [viewMode, setViewMode] = useState('grid');



  // Filtrar usuários
  const filteredUsuarios = usuarios.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesPerfil = filterPerfil === 'todos' || user.perfil === filterPerfil;
    const matchesStatus = filterStatus === 'todos' || user.status === filterStatus;
    
    return matchesSearch && matchesPerfil && matchesStatus;
  });

  // Colunas da tabela
  const columns = [
    {
      title: 'USUÁRIO',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string, record: Usuario) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: getAvatarColor(record.perfil) }}>
            {record.avatar}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'PERFIL',
      dataIndex: 'perfil',
      key: 'perfil',
      render: (perfil: Usuario['perfil']) => (
        <Tag color={getPerfilColor(perfil)} icon={getPerfilIcon(perfil)}>
          {perfil.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: Usuario['status']) => (
        <Badge 
          status={getStatusBadge(status) as any} 
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: 'MFA',
      dataIndex: 'mfaAtivo',
      key: 'mfaAtivo',
      render: (mfaAtivo: boolean) => (
        <Tag color={mfaAtivo ? 'green' : 'default'} icon={mfaAtivo ? <LockOutlined /> : <UnlockOutlined />}>
          {mfaAtivo ? 'ATIVO' : 'INATIVO'}
        </Tag>
      ),
    },
    {
      title: 'ÚLTIMO LOGIN',
      dataIndex: 'ultimoLogin',
      key: 'ultimoLogin',
      render: (data: string) => (
        <Space>
          <CalendarOutlined />
          <Text>{formatDate(data)}</Text>
        </Space>
      ),
    },
    {
      title: 'AÇÕES',
      key: 'actions',
      render: (_: any, record: Usuario) => (
        <Space>
          <Tooltip title="Visualizar">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Editar">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Funções auxiliares
  function getAvatarColor(perfil: Usuario['perfil']): string {
    const colors: Record<Usuario['perfil'], string> = {
      'Administrador': '#f5222d',
      'Gerente': '#1890ff',
      'Usuário': '#52c41a'
    };
    return colors[perfil] || '#d9d9d9';
  }

  function getPerfilColor(perfil: Usuario['perfil']): string {
    const colors: Record<Usuario['perfil'], string> = {
      'Administrador': 'red',
      'Gerente': 'blue',
      'Usuário': 'green'
    };
    return colors[perfil] || 'default';
  }

  function getPerfilIcon(perfil: Usuario['perfil']) {
    const icons: Record<Usuario['perfil'], React.ReactElement> = {
      'Administrador': <CrownOutlined />,
      'Gerente': <UserSwitchOutlined />,
      'Usuário': <UserOutlined />
    };
    return icons[perfil];
  }

  function getStatusBadge(status: Usuario['status']): string {
    const badges: Record<Usuario['status'], string> = {
      'ativo': 'success',
      'inativo': 'default',
      'bloqueado': 'error'
    };
    return badges[status] || 'default';
  }

  function getStatusText(status: Usuario['status']): string {
    const texts: Record<Usuario['status'], string> = {
      'ativo': 'ATIVO',
      'inativo': 'INATIVO',
      'bloqueado': 'BLOQUEADO'
    };
    return texts[status] || status;
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  function getActionMenu(user: Usuario) {
    return (
      <Menu>
        <Menu.Item key="view" icon={<EyeOutlined />}>
          Visualizar Detalhes
        </Menu.Item>
        <Menu.Item key="edit" icon={<EditOutlined />}>
          Editar Usuário
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item 
          key="toggleStatus" 
          icon={user.status === 'ativo' ? <LockOutlined /> : <UnlockOutlined />}
          onClick={() => toggleUserStatus(user)}
        >
          {user.status === 'ativo' ? 'Desativar' : 'Ativar'}
        </Menu.Item>
        <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
          Excluir
        </Menu.Item>
      </Menu>
    );
  }

  function toggleUserStatus(user: Usuario) {
    const newStatus = user.status === 'ativo' ? 'inativo' : 'ativo';
    setUsuarios(prev => prev.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
    message.success(`Usuário ${user.nome} ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso!`);
  }



  // Renderizar visualização em grid
  const renderGridView = () => (
    <Row gutter={[16, 16]}>
      {filteredUsuarios.map((user) => (
        <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              hoverable
              style={{ borderRadius: 12, height: '100%' }}
              actions={[
                <Tooltip title="Visualizar">
                  <EyeOutlined key="view" />
                </Tooltip>,
                <Tooltip title="Editar">
                  <EditOutlined key="edit" />
                </Tooltip>,
                <Dropdown overlay={getActionMenu(user)} trigger={['click']}>
                  <MoreOutlined key="more" />
                </Dropdown>
              ]}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Avatar 
                  size={64} 
                  style={{ backgroundColor: getAvatarColor(user.perfil), marginBottom: 8 }}
                >
                  {user.avatar}
                </Avatar>
                <Title level={4} style={{ margin: '8px 0 4px 0' }}>{user.nome}</Title>
                <Text type="secondary">{user.email}</Text>
              </div>
              
                             <Space direction="vertical" style={{ width: '100%' }}>
                 <Tag color={getPerfilColor(user.perfil)} icon={getPerfilIcon(user.perfil)}>
                   {user.perfil.toUpperCase()}
                 </Tag>
                <Badge 
                  status={getStatusBadge(user.status)} 
                  text={getStatusText(user.status)}
                />
                                 <div>
                   <Text type="secondary">MFA: </Text>
                   <Tag color={user.mfaAtivo ? 'green' : 'default'}>
                     {user.mfaAtivo ? 'ATIVO' : 'INATIVO'}
                   </Tag>
                 </div>
                <div>
                  <Text type="secondary">Último login: </Text>
                  <Text>{formatDate(user.ultimoLogin)}</Text>
                </div>
              </Space>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  );

  // Renderizar visualização em cards
  const renderCardView = () => (
    <Row gutter={[16, 16]}>
      {filteredUsuarios.map((user) => (
        <Col xs={24} sm={12} md={8} key={user.id}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              hoverable
              style={{ borderRadius: 12 }}
              bodyStyle={{ padding: 20 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <Avatar 
                  size={48} 
                  style={{ backgroundColor: getAvatarColor(user.perfil), marginRight: 12 }}
                >
                  {user.avatar}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ margin: 0 }}>{user.nome}</Title>
                  <Text type="secondary">{user.email}</Text>
                </div>
                <Dropdown overlay={getActionMenu(user)} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </div>
              
              <Space direction="vertical" style={{ width: '100%' }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Tag color={getPerfilColor(user.perfil)} icon={getPerfilIcon(user.perfil)}>
                     {user.perfil.toUpperCase()}
                   </Tag>
                  <Badge 
                    status={getStatusBadge(user.status)} 
                    text={getStatusText(user.status)}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <MailOutlined />
                    <Text type="secondary">MFA</Text>
                  </Space>
                  <Switch 
                    size="small" 
                    checked={user.mfaAtivo} 
                    disabled 
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <CalendarOutlined />
                    <Text type="secondary">Último login</Text>
                  </Space>
                  <Text>{formatDate(user.ultimoLogin)}</Text>
                </div>
              </Space>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  );

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      {/* Cards de Métricas e Botão */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card size="small" bodyStyle={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>CADASTRADOS</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                    {usuarios.length}
                  </div>
                </div>
                <UserOutlined style={{ fontSize: 20, color: '#1890ff' }} />
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card size="small" bodyStyle={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>ATIVOS</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                    {usuarios.filter(u => u.status === 'ativo').length}
                  </div>
                </div>
                <UserOutlined style={{ fontSize: 20, color: '#52c41a' }} />
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card size="small" bodyStyle={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>DESATIVADOS</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f' }}>
                    {usuarios.filter(u => u.status === 'inativo' || u.status === 'bloqueado').length}
                  </div>
                </div>
                <UserOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="primary" 
                size="large"
                icon={<UserAddOutlined />} 
                onClick={() => setModalOpen(true)}
              >
                NOVO USUÁRIO
              </Button>
            </motion.div>
          </div>
        </Col>
      </Row>



      {/* Filtros e Controles */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="BUSCAR POR NOME OU EMAIL..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="PERFIL"
              value={filterPerfil}
              onChange={setFilterPerfil}
              style={{ width: '100%' }}
            >
              <Option value="todos">TODOS OS PERFIS</Option>
              <Option value="Administrador">ADMINISTRADOR</Option>
              <Option value="Gerente">GERENTE</Option>
              <Option value="Usuário">USUÁRIO</Option>
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="STATUS"
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '100%' }}
            >
              <Option value="todos">TODOS OS STATUS</Option>
              <Option value="ativo">ATIVO</Option>
              <Option value="inativo">INATIVO</Option>
              <Option value="bloqueado">BLOQUEADO</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Space>
                             <Button 
                 type={viewMode === 'grid' ? 'primary' : 'default'}
                 icon={<AppstoreOutlined />}
                 onClick={() => setViewMode('grid')}
               >
                 GRID
               </Button>
               <Button 
                 type={viewMode === 'cards' ? 'primary' : 'default'}
                 icon={<BarChartOutlined />}
                 onClick={() => setViewMode('cards')}
               >
                 CARDS
               </Button>
               <Button 
                 type={viewMode === 'table' ? 'primary' : 'default'}
                 icon={<TableOutlined />}
                 onClick={() => setViewMode('table')}
               >
                 TABELA
               </Button>
            </Space>
          </Col>
        </Row>
      </Card>

            {/* Conteúdo Principal */}
      <Card>
        {viewMode === 'grid' && renderGridView()}
        {viewMode === 'cards' && renderCardView()}
        {viewMode === 'table' && (
          <Table
            columns={columns}
            dataSource={filteredUsuarios}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} usuários`
            }}
          />
        )}
      </Card>

      {/* Modal */}
      <UsuarioModal open={modalOpen} onCancel={() => setModalOpen(false)} />
    </div>
  );
} 