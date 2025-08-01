import { useState } from 'react';
import { Card, Row, Col, Select, Progress, Table, Tag } from 'antd';
import { 
  DollarOutlined, 
  BankOutlined,
  WalletOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Dados simulados para métricas financeiras
const dadosFinanceiros = {
  receita: [12000, 15000, 18000, 16000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000],
  custos: [8000, 10000, 12000, 11000, 15000, 17000, 19000, 22000, 24000, 26000, 29000, 31000],
  lucro: [4000, 5000, 6000, 5000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000],
  margem: [33.3, 33.3, 33.3, 31.3, 31.8, 32.0, 32.1, 31.3, 31.4, 31.6, 31.0, 31.1]
};

const dadosPagamentos = [
  { metodo: 'Cartão de Crédito', valor: 45000, percentual: 45, crescimento: 12 },
  { metodo: 'PIX', valor: 35000, percentual: 35, crescimento: 25 },
  { metodo: 'Boleto', valor: 15000, percentual: 15, crescimento: -5 },
  { metodo: 'Dinheiro', valor: 5000, percentual: 5, crescimento: -15 }
];

const dadosContas = [
  { descricao: 'Fornecedor ABC', valor: 15000, vencimento: '2024-02-15', status: 'Pendente' },
  { descricao: 'Aluguel', valor: 8000, vencimento: '2024-02-05', status: 'Pago' },
  { descricao: 'Energia', valor: 2500, vencimento: '2024-02-10', status: 'Pendente' },
  { descricao: 'Internet', valor: 500, vencimento: '2024-02-08', status: 'Pago' }
];

export default function DashboardFinanceiro() {
  const [periodo, setPeriodo] = useState('12M');

  // Cálculos de KPIs
  const receitaTotal = dadosFinanceiros.receita.reduce((a, b) => a + b, 0);
  const custosTotal = dadosFinanceiros.custos.reduce((a, b) => a + b, 0);
  const lucroTotal = dadosFinanceiros.lucro.reduce((a, b) => a + b, 0);
  const margemMedia = (lucroTotal / receitaTotal * 100).toFixed(1);
  const crescimentoReceita = ((dadosFinanceiros.receita[11] - dadosFinanceiros.receita[0]) / dadosFinanceiros.receita[0] * 100).toFixed(1);

  // Gráfico de Receita vs Custos
  const receitaCustosOption = {
    title: { text: 'Receita vs Custos (Últimos 12 meses)', left: 'center' },
    tooltip: { 
      trigger: 'axis',
      formatter: function(params: any) {
        return `${params[0].name}<br/>
                Receita: R$ ${params[0].value.toLocaleString()}<br/>
                Custos: R$ ${params[1].value.toLocaleString()}<br/>
                Lucro: R$ ${(params[0].value - params[1].value).toLocaleString()}`;
      }
    },
    legend: { data: ['Receita', 'Custos'], top: 30 },
    xAxis: { type: 'category', data: meses },
    yAxis: { type: 'value', name: 'R$' },
    series: [
      {
        name: 'Receita',
        type: 'line',
        data: dadosFinanceiros.receita,
        itemStyle: { color: '#52c41a' },
        areaStyle: { color: 'rgba(82, 196, 26, 0.1)' },
        smooth: true
      },
      {
        name: 'Custos',
        type: 'line',
        data: dadosFinanceiros.custos,
        itemStyle: { color: '#ff4d4f' },
        areaStyle: { color: 'rgba(255, 77, 79, 0.1)' },
        smooth: true
      }
    ]
  };

  // Gráfico de Margem de Lucro
  const margemOption = {
    title: { text: 'Margem de Lucro (%)', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: meses },
    yAxis: { type: 'value', name: '%', min: 25, max: 35 },
    series: [
      {
        name: 'Margem',
        type: 'bar',
        data: dadosFinanceiros.margem,
        itemStyle: { 
          color: function(params: any) {
            const value = params.value;
            return value > 32 ? '#52c41a' : value > 30 ? '#faad14' : '#ff4d4f';
          }
        }
      }
    ]
  };

  // Gráfico de Métodos de Pagamento
  const pagamentosOption = {
    title: { text: 'Distribuição por Método de Pagamento', left: 'center' },
    tooltip: { 
      trigger: 'item',
      formatter: '{a} <br/>{b}: R$ {c} ({d}%)'
    },
    series: [
      {
        name: 'Pagamentos',
        type: 'pie',
        radius: '60%',
        data: dadosPagamentos.map(item => ({
          value: item.valor,
          name: item.metodo,
          itemStyle: {
            color: item.crescimento > 0 ? '#52c41a' : '#ff4d4f'
          }
        })),
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
        }
      }
    ]
  };

  // Colunas da tabela de contas
  const colunasContas = [
    { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
    { 
      title: 'Valor', 
      dataIndex: 'valor', 
      key: 'valor',
      render: (valor: number) => `R$ ${valor.toLocaleString()}`
    },
    { title: 'Vencimento', dataIndex: 'vencimento', key: 'vencimento' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Pago' ? 'green' : 'orange'}>
          {status}
        </Tag>
      )
    }
  ];

  const kpis = [
    {
      title: 'Receita Total',
      value: `R$ ${receitaTotal.toLocaleString()}`,
      icon: <DollarOutlined style={{ fontSize: 32, color: '#52c41a', opacity: 0.2 }} />,
      desc: 'Últimos 12 meses',
      badge: `+${crescimentoReceita}% vs ano anterior`,
      badgeColor: 'green'
    },
    {
      title: 'Lucro Bruto',
      value: `R$ ${lucroTotal.toLocaleString()}`,
      icon: <DollarOutlined style={{ fontSize: 32, color: '#1890ff', opacity: 0.2 }} />,
      desc: 'Margem média',
      badge: `${margemMedia}%`,
      badgeColor: 'blue'
    },
    {
      title: 'Contas a Pagar',
      value: `R$ ${dadosContas.filter(c => c.status === 'Pendente').reduce((acc, c) => acc + c.valor, 0).toLocaleString()}`,
      icon: <BankOutlined style={{ fontSize: 32, color: '#faad14', opacity: 0.2 }} />,
      desc: 'Vencimento este mês',
      badge: `${dadosContas.filter(c => c.status === 'Pendente').length} contas`,
      badgeColor: 'orange'
    },
    {
      title: 'Fluxo de Caixa',
      value: `R$ ${(receitaTotal - custosTotal).toLocaleString()}`,
      icon: <WalletOutlined style={{ fontSize: 32, color: '#722ed1', opacity: 0.2 }} />,
      desc: 'Saldo projetado',
      badge: 'Positivo',
      badgeColor: 'green'
    }
  ];

  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Dashboard Financeiro</div>
      <div style={{ color: '#888', marginBottom: 32 }}>
        Análise completa das métricas financeiras e performance do negócio
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Select value={periodo} onChange={setPeriodo} style={{ width: 120 }}>
          <Select.Option value="3M">Últimos 3M</Select.Option>
          <Select.Option value="6M">Últimos 6M</Select.Option>
          <Select.Option value="12M">Últimos 12M</Select.Option>
        </Select>
      </div>

      {/* KPIs Principais */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        {kpis.map((kpi, idx) => (
          <Col key={idx} xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
            >
              <Card variant="outlined" style={{ borderRadius: 12, minHeight: 120, boxShadow: '0 2px 8px #f0f1f2' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#555', marginBottom: 4 }}>{kpi.title}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#222' }}>{kpi.value}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>{kpi.desc}</div>
                    {kpi.badge && (
                      <div style={{ color: kpi.badgeColor, fontSize: 13, fontWeight: 600 }}>
                        {kpi.badge}
                      </div>
                    )}
                  </div>
                  {kpi.icon}
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Métodos de Pagamento */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={pagamentosOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <div style={{ padding: '20px 0' }}>
                <h4 style={{ marginBottom: 20 }}>Performance por Método de Pagamento</h4>
                {dadosPagamentos.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>{item.metodo}</span>
                      <span style={{ fontWeight: 600 }}>
                        R$ {item.valor.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      percent={item.percentual} 
                      strokeColor={item.crescimento > 0 ? '#52c41a' : '#ff4d4f'}
                      format={() => `${item.percentual}%`}
                    />
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                      {item.crescimento > 0 ? '+' : ''}{item.crescimento}% vs mês anterior
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Gráficos de Análise */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={receitaCustosOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={margemOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Tabela de Contas */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
        <Card variant="outlined" style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}>
          <h4 style={{ marginBottom: 20 }}>Contas a Pagar - Próximos Vencimentos</h4>
          <Table 
            columns={colunasContas} 
            dataSource={dadosContas} 
            pagination={false}
            size="small"
          />
        </Card>
      </motion.div>
    </div>
  );
} 