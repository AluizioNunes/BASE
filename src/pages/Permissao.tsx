
import React, { useState } from 'react';
import { 
  Form, 
  Checkbox, 
  Button, 
  Card, 
  Row, 
  Col, 
  Space, 
  Typography,
  Divider,
  message,
  Tag,
  Progress
} from 'antd';
import { 
  SafetyOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  SaveOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

// Dados mockados de permissões
const permissoes = [
  { key: 'visualizar_usuarios', label: 'VISUALIZAR USUÁRIOS', categoria: 'USUÁRIOS' },
  { key: 'editar_usuarios', label: 'EDITAR USUÁRIOS', categoria: 'USUÁRIOS' },
  { key: 'excluir_usuarios', label: 'EXCLUIR USUÁRIOS', categoria: 'USUÁRIOS' },
  { key: 'criar_usuarios', label: 'CRIAR USUÁRIOS', categoria: 'USUÁRIOS' },
  { key: 'visualizar_relatorios', label: 'VISUALIZAR RELATÓRIOS', categoria: 'RELATÓRIOS' },
  { key: 'editar_relatorios', label: 'EDITAR RELATÓRIOS', categoria: 'RELATÓRIOS' },
  { key: 'excluir_relatorios', label: 'EXCLUIR RELATÓRIOS', categoria: 'RELATÓRIOS' },
  { key: 'editar_configuracoes', label: 'EDITAR CONFIGURAÇÕES', categoria: 'SISTEMA' },
  { key: 'visualizar_logs', label: 'VISUALIZAR LOGS', categoria: 'SISTEMA' },
  { key: 'gerenciar_backup', label: 'GERENCIAR BACKUP', categoria: 'SISTEMA' },
  { key: 'acesso_admin', label: 'ACESSO ADMIN', categoria: 'SISTEMA' },
  { key: 'gerenciar_permissoes', label: 'GERENCIAR PERMISSÕES', categoria: 'SISTEMA' }
];

// Permissões ativas mockadas
const permissoesAtivas = [
  'visualizar_usuarios',
  'editar_usuarios', 
  'visualizar_relatorios',
  'editar_configuracoes'
];

export default function Permissoes() {
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState(permissoesAtivas);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Calcular métricas
  const totalPermissoes = permissoes.length;
  const permissoesAtivasCount = permissoesSelecionadas.length;
  const percentualAtivas = (permissoesAtivasCount / totalPermissoes) * 100;

  // Agrupar por categoria
  const permissoesPorCategoria = permissoes.reduce((acc, permissao) => {
    if (!acc[permissao.categoria]) {
      acc[permissao.categoria] = [];
    }
    acc[permissao.categoria].push(permissao);
    return acc;
  }, {} as Record<string, typeof permissoes>);

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPermissoesSelecionadas(values.permissoes || []);
      message.success('PERMISSÕES SALVAS COM SUCESSO!');
    } catch {
      message.error('ERRO AO SALVAR PERMISSÕES');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (categoria: string) => {
    const permissoesCategoria = permissoesPorCategoria[categoria].map(p => p.key);
    const novasPermissoes = [...new Set([...permissoesSelecionadas, ...permissoesCategoria])];
    setPermissoesSelecionadas(novasPermissoes);
    form.setFieldsValue({ permissoes: novasPermissoes });
  };

  const handleUnselectAll = (categoria: string) => {
    const permissoesCategoria = permissoesPorCategoria[categoria].map(p => p.key);
    const novasPermissoes = permissoesSelecionadas.filter(p => !permissoesCategoria.includes(p));
    setPermissoesSelecionadas(novasPermissoes);
    form.setFieldsValue({ permissoes: novasPermissoes });
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
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>TOTAL</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                    {totalPermissoes}
                  </div>
                </div>
                <SafetyOutlined style={{ fontSize: 20, color: '#1890ff' }} />
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card size="small" bodyStyle={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>ATIVAS</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                    {permissoesAtivasCount}
                  </div>
                </div>
                <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card size="small" bodyStyle={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>PERCENTUAL</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#722ed1' }}>
                    {percentualAtivas.toFixed(0)}%
                  </div>
                </div>
                <Progress 
                  type="circle" 
                  percent={percentualAtivas} 
                  size={40}
                  strokeColor="#722ed1"
                  showInfo={false}
                />
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
            <Card title="RESUMO DAS PERMISSÕES" style={{ borderRadius: 12 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <SafetyOutlined />
                    <Text type="secondary">TOTAL DE PERMISSÕES</Text>
                  </Space>
                  <Text strong>{totalPermissoes}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <CheckCircleOutlined />
                    <Text type="secondary">PERMISSÕES ATIVAS</Text>
                  </Space>
                  <Text strong style={{ color: '#52c41a' }}>{permissoesAtivasCount}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <CloseCircleOutlined />
                    <Text type="secondary">PERMISSÕES INATIVAS</Text>
                  </Space>
                  <Text strong style={{ color: '#ff4d4f' }}>{totalPermissoes - permissoesAtivasCount}</Text>
                </div>
                
                <Divider />
                
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>PROGRESSO</Text>
                  <Progress 
                    percent={percentualAtivas} 
                    strokeColor="#52c41a"
                    showInfo={false}
                    style={{ marginTop: 8 }}
                  />
                  <Text style={{ fontSize: '12px', color: '#666' }}>
                    {percentualAtivas.toFixed(1)}% DAS PERMISSÕES ATIVAS
                  </Text>
                </div>
              </Space>
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} lg={16}>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Card title="GERENCIAR PERMISSÕES" style={{ borderRadius: 12 }}>
              <Form 
                form={form}
                layout="vertical" 
                initialValues={{ permissoes: permissoesSelecionadas }}
                onFinish={handleSave}
              >
                {Object.entries(permissoesPorCategoria).map(([categoria, permissaoList]) => (
                  <div key={categoria} style={{ marginBottom: 24 }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: 16,
                      padding: '8px 12px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: 6
                    }}>
                      <Title level={5} style={{ margin: 0, textTransform: 'uppercase' }}>
                        {categoria}
                      </Title>
                      <Space>
                        <Button 
                          size="small" 
                          type="link"
                          onClick={() => handleSelectAll(categoria)}
                        >
                          SELECIONAR TODAS
                        </Button>
                        <Button 
                          size="small" 
                          type="link"
                          onClick={() => handleUnselectAll(categoria)}
                        >
                          DESMARCAR TODAS
                        </Button>
                      </Space>
                    </div>
                    
                    <Row gutter={[16, 8]}>
                      {permissaoList.map(permissao => (
                        <Col xs={24} sm={12} key={permissao.key}>
                          <Form.Item 
                            name="permissoes" 
                            valuePropName="checked"
                            style={{ marginBottom: 8 }}
                          >
                            <Checkbox 
                              value={permissao.key}
                              style={{ width: '100%' }}
                            >
                              <Space>
                                {permissoesSelecionadas.includes(permissao.key) ? (
                                  <LockOutlined style={{ color: '#52c41a' }} />
                                ) : (
                                  <UnlockOutlined style={{ color: '#d9d9d9' }} />
                                )}
                                {permissao.label}
                              </Space>
                            </Checkbox>
                          </Form.Item>
                        </Col>
                      ))}
                    </Row>
                    
                    <Divider />
                  </div>
                ))}
                
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
                      SALVAR PERMISSÕES
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