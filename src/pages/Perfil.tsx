
import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Row, 
  Col, 
  Avatar, 
  Statistic, 
  Space, 
  Typography,
  Divider,
  message
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  CalendarOutlined,
  SaveOutlined,
  EditOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

// Dados mockados do usuário
const mockUser = {
  id: 1,
  nome: 'Renata Ferreira',
  email: 'renata@email.com',
  perfil: 'Administrador',
  dataCriacao: '2024-01-15',
  ultimoLogin: '2024-01-20',
  tentativasLogin: 0,
  mfaAtivo: true,
  avatar: 'RF'
};

export default function Perfil() {
  const [user, setUser] = useState(mockUser);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ ...user, ...values });
      message.success('PERFIL ATUALIZADO COM SUCESSO!');
    } catch {
      message.error('ERRO AO ATUALIZAR PERFIL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Cards de Métricas */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card size="small" bodyStyle={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>PERFIL</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                    {user.perfil.toUpperCase()}
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
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>MFA</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: user.mfaAtivo ? '#52c41a' : '#ff4d4f' }}>
                    {user.mfaAtivo ? 'ATIVO' : 'INATIVO'}
                  </div>
                </div>
                <LockOutlined style={{ fontSize: 20, color: user.mfaAtivo ? '#52c41a' : '#ff4d4f' }} />
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card size="small" bodyStyle={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>CADASTRO</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#722ed1' }}>
                    {new Date(user.dataCriacao).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <CalendarOutlined style={{ fontSize: 20, color: '#722ed1' }} />
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
                icon={<SaveOutlined />} 
                loading={loading}
                onClick={() => form.submit()}
              >
                SALVAR
              </Button>
            </motion.div>
          </div>
        </Col>
      </Row>

      {/* Conteúdo Principal */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Card>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar 
                  size={80} 
                  style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
                >
                  {user.avatar}
                </Avatar>
                <Title level={3} style={{ margin: '8px 0 4px 0' }}>{user.nome}</Title>
                <Text type="secondary">{user.email}</Text>
              </div>
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <UserOutlined />
                    <Text type="secondary">PERFIL</Text>
                  </Space>
                  <Text strong>{user.perfil.toUpperCase()}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <LockOutlined />
                    <Text type="secondary">MFA</Text>
                  </Space>
                  <Text strong style={{ color: user.mfaAtivo ? '#52c41a' : '#ff4d4f' }}>
                    {user.mfaAtivo ? 'ATIVO' : 'INATIVO'}
                  </Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <CalendarOutlined />
                    <Text type="secondary">ÚLTIMO LOGIN</Text>
                  </Space>
                  <Text>{new Date(user.ultimoLogin).toLocaleDateString('pt-BR')}</Text>
                </div>
              </Space>
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} lg={16}>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Card title="EDITAR PERFIL" style={{ borderRadius: 12 }}>
              <Form 
                form={form}
                layout="vertical" 
                initialValues={user}
                onFinish={handleSave}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item 
                      label="NOME" 
                      name="nome" 
                      rules={[{ required: true, message: 'INFORME SEU NOME' }]}
                    >
                      <Input 
                        placeholder="DIGITE SEU NOME"
                        prefix={<UserOutlined />}
                        style={{ textTransform: 'uppercase' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item 
                      label="EMAIL" 
                      name="email" 
                      rules={[
                        { required: true, message: 'INFORME SEU EMAIL' },
                        { type: 'email', message: 'EMAIL INVÁLIDO' }
                      ]}
                    >
                      <Input 
                        placeholder="DIGITE SEU EMAIL"
                        prefix={<MailOutlined />}
                        type="email"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Divider />
                
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item 
                      label="NOVA SENHA" 
                      name="senha"
                      rules={[
                        { min: 6, message: 'SENHA DEVE TER PELO MENOS 6 CARACTERES' }
                      ]}
                    >
                      <Input.Password 
                        placeholder="DIGITE UMA NOVA SENHA"
                        prefix={<LockOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item 
                      label="CONFIRMAR SENHA" 
                      name="confirmarSenha"
                      dependencies={['senha']}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('senha') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('SENHAS NÃO COINCIDEM'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password 
                        placeholder="CONFIRME A NOVA SENHA"
                        prefix={<LockOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <div style={{ textAlign: 'right', marginTop: 24 }}>
                  <Space>
                    <Button size="large">
                      CANCELAR
                    </Button>
                    <Button 
                      type="primary" 
                      size="large"
                      icon={<SaveOutlined />} 
                      loading={loading}
                      htmlType="submit"
                    >
                      SALVAR ALTERAÇÕES
                    </Button>
                  </Space>
                </div>
              </Form>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
} 