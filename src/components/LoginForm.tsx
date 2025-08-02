import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  onForgotPasswordClick?: () => void;
}

export default function LoginForm({ onSuccess, onRegisterClick, onForgotPasswordClick }: LoginFormProps) {
  const { login, loginMFA } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mfaMode, setMfaMode] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [tempEmail, setTempEmail] = useState('');

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await login(values);
      
      if (result.requiresMFA) {
        setMfaMode(true);
        setTempEmail(values.email);
      } else if (result.success) {
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

  const handleMFALogin = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setError('Código MFA deve ter 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await loginMFA(mfaCode);
      
      if (result.success) {
        onSuccess?.();
      } else {
        setError('Código MFA inválido');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro na verificação MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setMfaMode(false);
    setMfaCode('');
    setError('');
  };

  if (mfaMode) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <SafetyOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <Title level={3}>Verificação MFA</Title>
              <Text type="secondary">
                Digite o código de 6 dígitos enviado para {tempEmail}
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

            <Form layout="vertical">
              <Form.Item>
                <Input
                  size="large"
                  placeholder="000000"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  onClick={handleMFALogin}
                  disabled={mfaCode.length !== 6}
                >
                  Verificar Código
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  type="link"
                  block
                  onClick={handleBackToLogin}
                  disabled={loading}
                >
                  ← Voltar ao Login
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </motion.div>
    );
  }

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
              name="email"
              rules={[
                { required: true, message: 'Por favor, insira seu email!' },
                { type: 'email', message: 'Por favor, insira um email válido!' }
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Email"
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