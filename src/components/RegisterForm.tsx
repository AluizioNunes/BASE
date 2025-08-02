import { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Space, Progress, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export default function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
  const { register, validatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    score: number;
  } | null>(null);

  const handlePasswordChange = async (password: string) => {
    if (password.length >= 8) {
      try {
        const validation = await validatePassword(password);
        setPasswordValidation(validation);
      } catch (err) {
        console.error('Erro na validação de senha:', err);
      }
    } else {
      setPasswordValidation(null);
    }
  };

  const handleRegister = async (values: any) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await register(values);
      
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.message || 'Erro no registro');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro no registro');
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const cpf = value.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const validateCPF = (_: any, value: string) => {
    if (!value) return Promise.resolve();
    
    const cpf = value.replace(/\D/g, '');
    if (cpf.length !== 11) {
      return Promise.reject('CPF deve ter 11 dígitos');
    }
    
    // Validação básica de CPF
    if (cpf === cpf[0].repeat(11)) {
      return Promise.reject('CPF inválido');
    }
    
    return Promise.resolve();
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    if (score >= 40) return '#fa8c16';
    return '#ff4d4f';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score >= 80) return 'Muito Forte';
    if (score >= 60) return 'Forte';
    if (score >= 40) return 'Média';
    if (score >= 20) return 'Fraca';
    return 'Muito Fraca';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card style={{ width: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <UserOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={3}>Registro</Title>
            <Text type="secondary">
              Crie sua conta para acessar o sistema
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
            name="register"
            onFinish={handleRegister}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="nome"
              rules={[
                { required: true, message: 'Por favor, insira seu nome!' },
                { min: 2, message: 'Nome deve ter pelo menos 2 caracteres!' }
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Nome Completo"
                autoComplete="name"
              />
            </Form.Item>

            <Form.Item
              name="cpf"
              rules={[
                { required: true, message: 'Por favor, insira seu CPF!' },
                { validator: validateCPF }
              ]}
            >
              <Input
                size="large"
                prefix={<IdcardOutlined />}
                placeholder="000.000.000-00"
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value);
                  e.target.value = formatted;
                }}
                maxLength={14}
              />
            </Form.Item>

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
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="usuario"
              rules={[
                { required: true, message: 'Por favor, insira um nome de usuário!' },
                { min: 3, message: 'Nome de usuário deve ter pelo menos 3 caracteres!' },
                { pattern: /^[a-zA-Z0-9._-]+$/, message: 'Nome de usuário deve conter apenas letras, números, pontos, hífens e underscores!' }
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Nome de Usuário"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="funcao"
              rules={[
                { required: true, message: 'Por favor, selecione sua função!' }
              ]}
            >
              <Select
                size="large"
                placeholder="Selecione sua função"
              >
                <Option value="Administrador">Administrador</Option>
                <Option value="Gerente">Gerente</Option>
                <Option value="Analista">Analista</Option>
                <Option value="Usuário">Usuário</Option>
                <Option value="Estagiário">Estagiário</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="perfil"
              rules={[
                { required: true, message: 'Por favor, selecione seu perfil!' }
              ]}
            >
              <Select
                size="large"
                placeholder="Selecione seu perfil"
              >
                <Option value="Administrador">Administrador</Option>
                <Option value="Usuário">Usuário</Option>
                <Option value="Visualizador">Visualizador</Option>
              </Select>
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
                autoComplete="new-password"
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
            </Form.Item>

            {passwordValidation && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Força da senha:</Text>
                  <Text style={{ color: getPasswordStrengthColor(passwordValidation.score) }}>
                    {getPasswordStrengthText(passwordValidation.score)}
                  </Text>
                </div>
                <Progress
                  percent={passwordValidation.score}
                  strokeColor={getPasswordStrengthColor(passwordValidation.score)}
                  showInfo={false}
                />
                
                {passwordValidation.errors.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {passwordValidation.errors.map((error, index) => (
                      <div key={index} style={{ color: '#ff4d4f', fontSize: 12 }}>
                        ❌ {error}
                      </div>
                    ))}
                  </div>
                )}
                
                {passwordValidation.warnings.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {passwordValidation.warnings.map((warning, index) => (
                      <div key={index} style={{ color: '#faad14', fontSize: 12 }}>
                        ⚠️ {warning}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Form.Item
              name="cadastrante"
              initialValue="Sistema"
              hidden
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={loading}
                disabled={passwordValidation ? !passwordValidation.valid : false}
              >
                Registrar
              </Button>
            </Form.Item>
          </Form>

          {onLoginClick && (
            <div style={{ textAlign: 'center' }}>
              <Button
                type="link"
                onClick={onLoginClick}
                disabled={loading}
              >
                Já tem uma conta? Faça login
              </Button>
            </div>
          )}
        </Space>
      </Card>
    </motion.div>
  );
} 