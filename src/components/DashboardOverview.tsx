import { Card, Row, Col, Button } from 'antd';
import { 
  DollarOutlined, 
  ShoppingOutlined, 
  TeamOutlined,
  ToolOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function DashboardOverview() {
  const navigate = useNavigate();

  const dashboards = [
    {
      title: 'Financeiro',
      icon: <DollarOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      kpi: 'R$ 450.000',
      desc: 'Receita Total',
      badge: '+18% vs ano anterior',
      badgeColor: 'green',
      route: '/dashboard/financeiro',
      color: '#52c41a'
    },
    {
      title: 'Vendas',
      icon: <ShoppingOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      kpi: '6.500',
      desc: 'Vendas Totais',
      badge: '+15% vs ano anterior',
      badgeColor: 'green',
      route: '/dashboard/vendas',
      color: '#1890ff'
    },
    {
      title: 'Clientes',
      icon: <TeamOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      kpi: '1.750',
      desc: 'Clientes Ativos',
      badge: '+12% vs ano anterior',
      badgeColor: 'green',
      route: '/dashboard/clientes',
      color: '#722ed1'
    },
    {
      title: 'Operacional',
      icon: <ToolOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      kpi: '98.5%',
      desc: 'Taxa de Entrega',
      badge: '+2% vs mês anterior',
      badgeColor: 'green',
      route: '/dashboard/operacional',
      color: '#faad14'
    }
  ];

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: '#222' }}>
        Dashboards Específicos
      </div>
      <div style={{ color: '#888', marginBottom: 24 }}>
        Acesse dashboards detalhados para análises específicas de cada área do negócio
      </div>
      
      <Row gutter={24}>
        {dashboards.map((dashboard, idx) => (
          <Col key={idx} xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
            >
              <Card 
                variant="outlined" 
                style={{ 
                  borderRadius: 12, 
                  minHeight: 160, 
                  boxShadow: '0 2px 8px #f0f1f2',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                hoverable
                onClick={() => navigate(dashboard.route)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, color: '#555', fontSize: 16 }}>{dashboard.title}</div>
                    {dashboard.icon}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                      {dashboard.kpi}
                    </div>
                    <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
                      {dashboard.desc}
                    </div>
                    {dashboard.badge && (
                      <div style={{ color: dashboard.badgeColor, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                        {dashboard.badge}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    type="text" 
                    size="small"
                    icon={<ArrowRightOutlined />}
                    style={{ 
                      color: dashboard.color, 
                      padding: 0, 
                      height: 'auto',
                      fontWeight: 600
                    }}
                  >
                    Ver Dashboard
                  </Button>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
} 