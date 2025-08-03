import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Form, 
  Input, 
  Button, 
  message, 
  Upload,
  Card,
  Row,
  Col,
  Space,
  Typography,
  Divider,
  Tag,
  Progress
} from 'antd';
import { 
  UploadOutlined, 
  SaveOutlined,
  SettingOutlined,
  DatabaseOutlined,
  CloudOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const initialConfig = {
  APP_NAME: 'BASE',
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_NAME: 'BASE',
  DB_USER: 'BASE',
  DB_PASSWORD: '',
  VITE_API_URL: 'http://localhost:8000/api',
  REDIS_HOST: 'localhost',
  REDIS_PORT: '6379',
  REDIS_PASSWORD: '',
  RABBITMQ_HOST: 'localhost',
  RABBITMQ_PORT: '5672',
  RABBITMQ_USER: 'BASE',
  RABBITMQ_PASSWORD: '',
  SMTP_HOST: '',
  SMTP_PORT: '587',
  SMTP_USER: '',
  SMTP_PASSWORD: '',
  SMTP_FROM: '',
};

function generateEnv(cfg: Record<string, string>) {
  return Object.entries(cfg).map(([k, v]) => `${k}=${v}`).join('\n');
}

export default function Configuracoes() {
  const [aba, setAba] = useState('geral');
  const [config, setConfig] = useState(initialConfig);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const { user } = useAuth();

  // Calcular métricas
  const totalConfiguracoes = Object.keys(initialConfig).length;
  const configuracoesPreenchidas = Object.values(config).filter(v => v && v.trim() !== '').length;
  const percentualPreenchido = (configuracoesPreenchidas / totalConfiguracoes) * 100;

  // Status dos serviços
  const servicosStatus = {
    database: config.DB_HOST && config.DB_NAME ? 'CONECTADO' : 'DESCONECTADO',
    redis: config.REDIS_HOST ? 'CONECTADO' : 'DESCONECTADO',
    rabbitmq: config.RABBITMQ_HOST ? 'CONECTADO' : 'DESCONECTADO',
    smtp: config.SMTP_HOST ? 'CONECTADO' : 'DESCONECTADO'
  };

  const servicosAtivos = Object.values(servicosStatus).filter(s => s === 'CONECTADO').length;

  useEffect(() => {
    // Verificar se é admin
    if (!user || user.perfil?.toLowerCase() !== 'administrador') {
      message.error('ACESSO RESTRITO A ADMINISTRADORES!');
      return;
    }
    // Carregar configurações do backend
    loadConfig();
  }, [user]);

  async function loadConfig() {
    try {
      setLoadingConfig(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/files/config`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-admin': 'true'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const mergedConfig = { ...initialConfig, ...data };
        setConfig(mergedConfig as typeof initialConfig);
        form.setFieldsValue(mergedConfig);
      } else {
        message.warning('CONFIGURAÇÕES NÃO ENCONTRADAS, USANDO PADRÕES.');
      }
    } catch {
      message.error('ERRO AO CARREGAR CONFIGURAÇÕES DO BACKEND.');
    } finally {
      setLoadingConfig(false);
    }
  }

  async function handleSave() {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/files/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-admin': 'true'
        },
        body: JSON.stringify(config)
      });
      
      if (response.ok) {
        message.success('CONFIGURAÇÕES SALVAS NO BACKEND COM SUCESSO!');
      } else {
        const error = await response.json();
        message.error(`ERRO AO SALVAR: ${error.detail || 'ERRO DESCONHECIDO'}`);
      }
    } catch {
      message.error('ERRO DE CONEXÃO AO SALVAR CONFIGURAÇÕES.');
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    const content = generateEnv(config);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);
    message.success('ARQUIVO .ENV GERADO!');
  }

  function handleUpload(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/);
      const parsed: Record<string, string> = { ...config };
      lines.forEach(line => {
        const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (match) parsed[match[1]] = match[2];
      });
      setConfig(parsed as typeof initialConfig);
      form.setFieldsValue(parsed);
      message.success('CONFIGURAÇÃO CARREGADA DO ARQUIVO!');
    };
    reader.readAsText(file);
    return false;
  }

  // Verificar se é admin
  if (!user || user.perfil?.toLowerCase() !== 'administrador') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 32, textAlign: 'center' }}>
        <Title level={2} style={{ color: 'red' }}>ACESSO RESTRITO</Title>
        <Text>ESTA ÁREA É RESTRITA A ADMINISTRADORES DO SISTEMA.</Text>
      </motion.div>
    );
  }

  if (loadingConfig) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 32, textAlign: 'center' }}>
        <Title level={2}>CARREGANDO CONFIGURAÇÕES...</Title>
      </motion.div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      {/* Cards de Métricas */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card size="small" bodyStyle={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>CONFIGURAÇÕES</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                    {totalConfiguracoes}
                  </div>
                </div>
                <SettingOutlined style={{ fontSize: 20, color: '#1890ff' }} />
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card size="small" bodyStyle={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>PREENCHIDAS</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                    {configuracoesPreenchidas}
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
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>SERVIÇOS</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#722ed1' }}>
                    {servicosAtivos}/4
                  </div>
                </div>
                <CloudOutlined style={{ fontSize: 20, color: '#722ed1' }} />
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
                onClick={handleSave}
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
            <Card title="RESUMO DAS CONFIGURAÇÕES" style={{ borderRadius: 12 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <SettingOutlined />
                    <Text type="secondary">TOTAL DE CONFIGURAÇÕES</Text>
                  </Space>
                  <Text strong>{totalConfiguracoes}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <CheckCircleOutlined />
                    <Text type="secondary">CONFIGURAÇÕES PREENCHIDAS</Text>
                  </Space>
                  <Text strong style={{ color: '#52c41a' }}>{configuracoesPreenchidas}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <CloseCircleOutlined />
                    <Text type="secondary">CONFIGURAÇÕES VAZIAS</Text>
                  </Space>
                  <Text strong style={{ color: '#ff4d4f' }}>{totalConfiguracoes - configuracoesPreenchidas}</Text>
                </div>
                
                <Divider />
                
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>PROGRESSO</Text>
                  <Progress 
                    percent={percentualPreenchido} 
                    strokeColor="#52c41a"
                    showInfo={false}
                    style={{ marginTop: 8 }}
                  />
                  <Text style={{ fontSize: '12px', color: '#666' }}>
                    {percentualPreenchido.toFixed(1)}% DAS CONFIGURAÇÕES PREENCHIDAS
                  </Text>
                </div>
                
                <Divider />
                
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
                    STATUS DOS SERVIÇOS
                  </Text>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <DatabaseOutlined />
                        <Text>BANCO DE DADOS</Text>
                      </Space>
                      <Tag color={servicosStatus.database === 'CONECTADO' ? 'green' : 'red'}>
                        {servicosStatus.database}
                      </Tag>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <CloudOutlined />
                        <Text>REDIS</Text>
                      </Space>
                      <Tag color={servicosStatus.redis === 'CONECTADO' ? 'green' : 'red'}>
                        {servicosStatus.redis}
                      </Tag>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <CloudOutlined />
                        <Text>RABBITMQ</Text>
                      </Space>
                      <Tag color={servicosStatus.rabbitmq === 'CONECTADO' ? 'green' : 'red'}>
                        {servicosStatus.rabbitmq}
                      </Tag>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <MailOutlined />
                        <Text>SMTP</Text>
                      </Space>
                      <Tag color={servicosStatus.smtp === 'CONECTADO' ? 'green' : 'red'}>
                        {servicosStatus.smtp}
                      </Tag>
                    </div>
                  </Space>
                </div>
              </Space>
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} lg={16}>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Card title="CONFIGURAÇÕES DO SISTEMA" style={{ borderRadius: 12 }}>
              <div style={{ marginBottom: 16 }}>
                <Upload accept=".env,.txt" showUploadList={false} beforeUpload={handleUpload}>
                  <Button icon={<UploadOutlined />} style={{ marginRight: 8 }}>
                    CARREGAR .ENV EXISTENTE
                  </Button>
                </Upload>
                <Button onClick={handleDownload}>
                  BAIXAR .ENV
                </Button>
              </div>
              
              <Tabs activeKey={aba} onChange={setAba}>
                <TabPane tab="GERAL" key="geral">
                  <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item 
                          label="NOME DO SISTEMA" 
                          name="APP_NAME" 
                          rules={[{ required: true, min: 2, message: 'INFORME O NOME DO SISTEMA' }]}
                        >
                          <Input placeholder="NOME DO SISTEMA" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item 
                          label="URL DA API (VITE_API_URL)" 
                          name="VITE_API_URL" 
                          rules={[{ required: true, type: 'url', message: 'INFORME UMA URL VÁLIDA' }]}
                        >
                          <Input placeholder="HTTP://LOCALHOST:8000/API" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
                
                <TabPane tab="BANCO DE DADOS" key="banco">
                  <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item label="HOST" name="DB_HOST" rules={[{ required: true }]}>
                          <Input placeholder="LOCALHOST" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="PORTA" name="DB_PORT" rules={[{ required: true, pattern: /^\d+$/, message: 'INFORME UM NÚMERO' }]}>
                          <Input placeholder="5432" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="NOME DO BANCO" name="DB_NAME" rules={[{ required: true }]}>
                          <Input placeholder="NOME_DO_BANCO" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="USUÁRIO" name="DB_USER" rules={[{ required: true }]}>
                          <Input placeholder="USUÁRIO_DO_BANCO" />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label="SENHA" name="DB_PASSWORD" rules={[{ required: true }]}>
                          <Input.Password placeholder="SENHA_DO_BANCO" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
                
                <TabPane tab="REDIS" key="redis">
                  <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item label="HOST" name="REDIS_HOST" rules={[{ required: true }]}>
                          <Input placeholder="LOCALHOST" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="PORTA" name="REDIS_PORT" rules={[{ required: true, pattern: /^\d+$/, message: 'INFORME UM NÚMERO' }]}>
                          <Input placeholder="6379" />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label="SENHA" name="REDIS_PASSWORD">
                          <Input.Password placeholder="SENHA_DO_REDIS" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
                
                <TabPane tab="RABBITMQ" key="rabbitmq">
                  <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item label="HOST" name="RABBITMQ_HOST" rules={[{ required: true }]}>
                          <Input placeholder="LOCALHOST" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="PORTA" name="RABBITMQ_PORT" rules={[{ required: true, pattern: /^\d+$/, message: 'INFORME UM NÚMERO' }]}>
                          <Input placeholder="5672" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="USUÁRIO" name="RABBITMQ_USER" rules={[{ required: true }]}>
                          <Input placeholder="USUÁRIO_RABBITMQ" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="SENHA" name="RABBITMQ_PASSWORD">
                          <Input.Password placeholder="SENHA_RABBITMQ" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
                
                <TabPane tab="E-MAIL (SMTP)" key="email">
                  <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item label="HOST SMTP" name="SMTP_HOST">
                          <Input placeholder="SMTP.GMAIL.COM" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="PORTA SMTP" name="SMTP_PORT" rules={[{ pattern: /^\d+$/, message: 'INFORME UM NÚMERO' }]}>
                          <Input placeholder="587" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="USUÁRIO SMTP" name="SMTP_USER">
                          <Input placeholder="SEU_EMAIL@GMAIL.COM" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="SENHA SMTP" name="SMTP_PASSWORD">
                          <Input.Password placeholder="SENHA_DO_EMAIL" />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label="REMETENTE (FROM)" name="SMTP_FROM">
                          <Input placeholder="SEU_EMAIL@GMAIL.COM" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
              </Tabs>
              
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
                    onClick={handleSave}
                  >
                    SALVAR CONFIGURAÇÕES
                  </Button>
                </Space>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
} 