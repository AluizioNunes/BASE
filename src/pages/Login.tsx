import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tabs } from 'antd';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { motion } from 'framer-motion';

const { TabPane } = Tabs;

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  const handleLoginSuccess = () => {
    navigate('/');
  };

  const handleRegisterSuccess = () => {
    setActiveTab('login');
    // Mostrar mensagem de sucesso
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card style={{ 
          width: 500, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            centered
            size="large"
          >
            <TabPane tab="Login" key="login">
              <LoginForm 
                onSuccess={handleLoginSuccess}
                onRegisterClick={() => setActiveTab('register')}
              />
            </TabPane>
            <TabPane tab="Registro" key="register">
              <RegisterForm 
                onSuccess={handleRegisterSuccess}
                onLoginClick={() => setActiveTab('login')}
              />
            </TabPane>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
} 