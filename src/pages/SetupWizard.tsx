import { useState } from 'react';
import { Steps, Button, Form, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Step } = Steps;

const initialConfig = {
  APP_NAME: 'BASE',
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_NAME: 'BASE',
  DB_USER: 'BASE',
  DB_PASSWORD: '',
  DB_SCHEMA: 'BASE',
  VITE_API_URL: 'http://localhost:8000/api',
};

function parseEnvFile(content: string) {
  const lines = content.split(/\r?\n/);
  const config: Record<string, string> = {};
  lines.forEach(line => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) {
      config[match[1]] = match[2];
    }
  });
  return config;
}

export default function SetupWizard() {
  const [current, setCurrent] = useState(0);
  const [config, setConfig] = useState(initialConfig);
  const [form] = Form.useForm();

  const steps = [
    {
      title: 'Geral',
      content: (
        <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
          <Form.Item label="Nome do Sistema" name="APP_NAME" rules={[{ required: true }]}> <Input /> </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Banco de Dados',
      content: (
        <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
          <Form.Item label="Host" name="DB_HOST" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item label="Porta" name="DB_PORT" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item label="Nome do Banco" name="DB_NAME" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item label="Usuário" name="DB_USER" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item label="Senha" name="DB_PASSWORD" rules={[{ required: true }]}> <Input.Password /> </Form.Item>
        </Form>
      ),
    },
    {
      title: 'API/Frontend',
      content: (
        <Form form={form} layout="vertical" initialValues={config} onValuesChange={(_, values) => setConfig({ ...config, ...values })}>
          <Form.Item label="URL da API (VITE_API_URL)" name="VITE_API_URL" rules={[{ required: true }]}> <Input /> </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Finalizar',
      content: (
        <div>
          <h3>Resumo das Configurações</h3>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            {Object.entries(config).map(([k, v]) => `${k}=${v}`).join('\n')}
          </pre>
          <Button type="primary" onClick={() => downloadEnv(config)} style={{ marginTop: 16 }}>Baixar .env</Button>
          <div style={{ marginTop: 24 }}>
            <Upload accept=".env,.txt" showUploadList={false} beforeUpload={file => {
              const reader = new FileReader();
              reader.onload = e => {
                const text = e.target?.result as string;
                const parsed = parseEnvFile(text);
                setConfig(prev => ({ ...prev, ...parsed }));
                message.success('Configuração carregada do arquivo!');
              };
              reader.readAsText(file);
              return false;
            }}>
              <Button icon={<UploadOutlined />}>Carregar .env existente</Button>
            </Upload>
          </div>
        </div>
      ),
    },
  ];

  function next() {
    if (current < steps.length - 1) setCurrent(current + 1);
  }
  function prev() {
    if (current > 0) setCurrent(current - 1);
  }

  function downloadEnv(cfg: typeof initialConfig) {
    const content = Object.entries(cfg).map(([k, v]) => `${k}=${v}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);
    message.success('Arquivo .env gerado!');
  }

  const handleFinish = async () => {
    try {
      message.loading('Criando banco de dados...', 0);
      
      // Primeiro, criar o banco de dados
      const dbResponse = await fetch(`${import.meta.env.VITE_API_URL}/files/create-database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin': 'true' // Mock para admin
        },
        body: JSON.stringify({
          DB_NAME: config.DB_NAME,
          DB_USER: config.DB_USER,
          DB_PASSWORD: config.DB_PASSWORD,
          DB_SCHEMA: config.DB_SCHEMA || config.DB_NAME
        })
      });
      
      if (!dbResponse.ok) {
        const errorData = await dbResponse.json();
        message.destroy();
        message.error(`Erro ao criar banco: ${errorData.detail}`);
        return;
      }
      
      const dbResult = await dbResponse.json();
      message.destroy();
      message.success(dbResult.message);
      
      // Aguardar um pouco para o banco estar pronto
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.loading('Salvando configurações...', 0);
      
      // Salvar configurações no .env
      const configResponse = await fetch(`${import.meta.env.VITE_API_URL}/files/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin': 'true'
        },
        body: JSON.stringify(config)
      });
      
      if (!configResponse.ok) {
        message.destroy();
        message.error('Erro ao salvar configurações');
        return;
      }
      
      message.destroy();
      message.success('Configuração concluída com sucesso!');
      
      // Aguardar um pouco antes de redirecionar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para a página principal
      window.location.href = '/';
    } catch (error) {
      message.destroy();
      message.error('Erro ao finalizar configuração');
      console.error('Erro:', error);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h2>Configuração Inicial do Sistema</h2>
      <Steps current={current} style={{ marginBottom: 32 }}>
        {steps.map(s => <Step key={s.title} title={s.title} />)}
      </Steps>
      <div style={{ minHeight: 220 }}>{steps[current].content}</div>
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        {current > 0 && <Button style={{ marginRight: 8 }} onClick={prev}>Voltar</Button>}
        {current < steps.length - 1 && <Button type="primary" onClick={next}>Próximo</Button>}
        {current === steps.length - 1 && <Button type="primary" onClick={handleFinish}>Finalizar Configuração</Button>}
      </div>
    </div>
  );
} 