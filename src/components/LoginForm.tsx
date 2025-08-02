import { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  onForgotPasswordClick?: () => void;
}

export default function LoginForm({ onSuccess, onRegisterClick, onForgotPasswordClick }: LoginFormProps) {
  const { login, loginDev } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (values: { email_or_username: string; password: string }) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await login(values);
      
      if (result.success) {
        onSuccess?.();
      } else {
        setError('Credenciais inválidas');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro no login');
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await loginDev();
      
      if (result.success) {
        onSuccess?.();
      } else {
        setError('Erro no login de desenvolvimento');
      }
    } catch (err: any) {
      setError('Erro no login de desenvolvimento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <UserOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={3}>Login</Title>
            <Text type="secondary">
              Entre com suas credenciais para acessar o sistema
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
            />
          )}

          <Form
            name="login"
            onFinish={handleLogin}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="email_or_username"
              rules={[
                { required: true, message: 'Por favor, insira seu email ou usuário!' }
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Email ou Usuário"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Por favor, insira sua senha!' },
                { min: 8, message: 'Senha deve ter pelo menos 8 caracteres!' }
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Senha"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={loading}
              >
                Entrar
              </Button>
            </Form.Item>

            <Form.Item>
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '8px',
                fontSize: '12px',
                color: '#999'
              }}>
                ⚠️ Apenas para desenvolvimento
              </div>
              <Button
                type="dashed"
                size="large"
                block
                onClick={handleDevLogin}
                loading={loading}
                style={{ 
                  borderColor: '#ff4d4f', 
                  color: '#ff4d4f',
                  marginTop: '4px'
                }}
              >
                🔧 Login de Desenvolvimento
              </Button>
            </Form.Item>
          </Form>

          <Divider />

          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {onForgotPasswordClick && (
              <Button
                type="link"
                block
                onClick={onForgotPasswordClick}
                disabled={loading}
              >
                Esqueceu sua senha?
              </Button>
            )}

            {onRegisterClick && (
              <Button
                type="link"
                block
                onClick={onRegisterClick}
                disabled={loading}
              >
                Não tem uma conta? Registre-se
              </Button>
            )}
          </Space>
        </Space>
      </Card>
    </motion.div>
  );
} 