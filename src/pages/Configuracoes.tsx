// Para usar este componente, instale @mui/material:
// npm install @mui/material @emotion/react @emotion/styled
import { useState, useEffect } from 'react';
import { Tabs, Form, Input, Button, message, Upload } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const { TabPane } = Tabs;

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

  useEffect(() => {
    // Verificar se é admin
    if (!user || user.perfil?.toLowerCase() !== 'administrador') {
      message.error('Acesso restrito a administradores!');
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
        message.warning('Configurações não encontradas, usando padrões.');
      }
    } catch {
      message.error('Erro ao carregar configurações do backend.');
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
        message.success('Configurações salvas no backend com sucesso!');
      } else {
        const error = await response.json();
        message.error(`Erro ao salvar: ${error.detail || 'Erro desconhecido'}`);
      }
    } catch {
      message.error('Erro de conexão ao salvar configurações.');
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
    message.success('Arquivo .env gerado!');
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
      message.success('Configuração carregada do arquivo!');
    };
    reader.readAsText(file);
    return false;
  }

  // Verificar se é admin
  if (!user || user.perfil?.toLowerCase() !== 'administrador') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 32, textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>Acesso Restrito</h2>
        <p>Esta área é restrita a administradores do sistema.</p>
      </motion.div>
    );
  }

  if (loadingConfig) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 32, textAlign: 'center' }}>
        <h2>Carregando Configurações...</h2>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>Configurações do Sistema</h2>
      <Upload accept=".env,.txt" showUploadList={false} beforeUpload={handleUpload}>
        <Button icon={<UploadOutlined />}>Carregar .env existente</Button>
      </Upload>
      <Tabs activeKey={aba} onChange={setAba} style={{ marginTop: 24 }}>
        <TabPane tab="Geral" key="geral">
          <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
            <Form.Item label="Nome do Sistema" name="APP_NAME" rules={[{ required: true, min: 2, message: 'Informe o nome do sistema' }]}> <Input /> </Form.Item>
            <Form.Item label="URL da API (VITE_API_URL)" name="VITE_API_URL" rules={[{ required: true, type: 'url', message: 'Informe uma URL válida' }]}> <Input /> </Form.Item>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ marginRight: 8 }}>Salvar</Button>
            <Button onClick={handleDownload}>Baixar .env</Button>
          </Form>
        </TabPane>
        <TabPane tab="Banco de Dados" key="banco">
          <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
            <Form.Item label="Host" name="DB_HOST" rules={[{ required: true }]}> <Input /> </Form.Item>
            <Form.Item label="Porta" name="DB_PORT" rules={[{ required: true, pattern: /^\d+$/, message: 'Informe um número' }]}> <Input /> </Form.Item>
            <Form.Item label="Nome do Banco" name="DB_NAME" rules={[{ required: true }]}> <Input /> </Form.Item>
            <Form.Item label="Usuário" name="DB_USER" rules={[{ required: true }]}> <Input /> </Form.Item>
            <Form.Item label="Senha" name="DB_PASSWORD" rules={[{ required: true }]}> <Input.Password /> </Form.Item>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ marginRight: 8 }}>Salvar</Button>
            <Button onClick={handleDownload}>Baixar .env</Button>
          </Form>
        </TabPane>
        <TabPane tab="Redis" key="redis">
          <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
            <Form.Item label="Host" name="REDIS_HOST" rules={[{ required: true }]}> <Input /> </Form.Item>
            <Form.Item label="Porta" name="REDIS_PORT" rules={[{ required: true, pattern: /^\d+$/, message: 'Informe um número' }]}> <Input /> </Form.Item>
            <Form.Item label="Senha" name="REDIS_PASSWORD"> <Input.Password /> </Form.Item>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ marginRight: 8 }}>Salvar</Button>
            <Button onClick={handleDownload}>Baixar .env</Button>
          </Form>
        </TabPane>
        <TabPane tab="RabbitMQ" key="rabbitmq">
          <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
            <Form.Item label="Host" name="RABBITMQ_HOST" rules={[{ required: true }]}> <Input /> </Form.Item>
            <Form.Item label="Porta" name="RABBITMQ_PORT" rules={[{ required: true, pattern: /^\d+$/, message: 'Informe um número' }]}> <Input /> </Form.Item>
            <Form.Item label="Usuário" name="RABBITMQ_USER" rules={[{ required: true }]}> <Input /> </Form.Item>
            <Form.Item label="Senha" name="RABBITMQ_PASSWORD"> <Input.Password /> </Form.Item>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ marginRight: 8 }}>Salvar</Button>
            <Button onClick={handleDownload}>Baixar .env</Button>
          </Form>
        </TabPane>
        <TabPane tab="E-mail (SMTP)" key="email">
          <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
            <Form.Item label="Host SMTP" name="SMTP_HOST"> <Input /> </Form.Item>
            <Form.Item label="Porta SMTP" name="SMTP_PORT" rules={[{ pattern: /^\d+$/, message: 'Informe um número' }]}> <Input /> </Form.Item>
            <Form.Item label="Usuário SMTP" name="SMTP_USER"> <Input /> </Form.Item>
            <Form.Item label="Senha SMTP" name="SMTP_PASSWORD"> <Input.Password /> </Form.Item>
            <Form.Item label="Remetente (FROM)" name="SMTP_FROM"> <Input /> </Form.Item>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ marginRight: 8 }}>Salvar</Button>
            <Button onClick={handleDownload}>Baixar .env</Button>
          </Form>
        </TabPane>
      </Tabs>
    </motion.div>
  );
} 