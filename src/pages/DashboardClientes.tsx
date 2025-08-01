import { useState } from 'react';
import { Card, Row, Col, Select, Progress, Table, Tag, Avatar, Rate } from 'antd';
import { 
  UserOutlined, 
  HeartOutlined, 
  StarOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  CrownOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Dados simulados para métricas de clientes
const dadosClientes = {
  total: [1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750],
  novos: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105],
  ativos: [1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550],
  churn: [20, 18, 15, 12, 10, 8, 5, 3, 2, 1, 1, 1]
};

const segmentacaoClientes = [
  { segmento: 'Premium', quantidade: 350, receita: 175000, ltv: 500, percentual: 20 },
  { segmento: 'Gold', quantidade: 525, receita: 157500, ltv: 300, percentual: 30 },
  { segmento: 'Silver', quantidade: 700, receita: 140000, ltv: 200, percentual: 40 },
  { segmento: 'Bronze', quantidade: 175, receita: 17500, ltv: 100, percentual: 10 }
];

const clientesRecentes = [
  { nome: 'João Silva', email: 'joao@email.com', valor: 2500, compras: 3, ultimaCompra: '2024-02-01', status: 'Ativo', avatar: 'JS' },
  { nome: 'Maria Santos', email: 'maria@email.com', valor: 1800, compras: 2, ultimaCompra: '2024-01-28', status: 'Ativo', avatar: 'MS' },
  { nome: 'Pedro Costa', email: 'pedro@email.com', valor: 3200, compras: 5, ultimaCompra: '2024-01-25', status: 'Premium', avatar: 'PC' },
  { nome: 'Ana Oliveira', email: 'ana@email.com', valor: 1200, compras: 1, ultimaCompra: '2024-01-20', status: 'Inativo', avatar: 'AO' },
  { nome: 'Carlos Lima', email: 'carlos@email.com', valor: 4500, compras: 8, ultimaCompra: '2024-01-15', status: 'Premium', avatar: 'CL' }
];

const satisfacaoClientes = [
  { mes: 'Jan', satisfacao: 4.2, reclamacoes: 15, elogios: 45 },
  { mes: 'Fev', satisfacao: 4.3, reclamacoes: 12, elogios: 52 },
  { mes: 'Mar', satisfacao: 4.4, reclamacoes: 10, elogios: 58 },
  { mes: 'Abr', satisfacao: 4.5, reclamacoes: 8, elogios: 65 },
  { mes: 'Mai', satisfacao: 4.6, reclamacoes: 6, elogios: 72 },
  { mes: 'Jun', satisfacao: 4.7, reclamacoes: 5, elogios: 78 }
];

const canaisAquiscao = [
  { canal: 'Google Ads', clientes: 400, custo: 8000, cac: 20, conversao: 15 },
  { canal: 'Facebook', clientes: 300, custo: 6000, cac: 20, conversao: 12 },
  { canal: 'Instagram', clientes: 250, custo: 4000, cac: 16, conversao: 18 },
  { canal: 'Indicação', clientes: 200, custo: 0, cac: 0, conversao: 25 },
  { canal: 'Email Marketing', clientes: 150, custo: 1500, cac: 10, conversao: 8 }
];

export default function DashboardClientes() {
  const [periodo, setPeriodo] = useState('12M');
  const [segmento, setSegmento] = useState('Todos');

  // Cálculos de KPIs
  const totalClientes = dadosClientes.total[11];
  const novosClientes = dadosClientes.novos.reduce((a, b) => a + b, 0);
  const taxaRetencao = ((dadosClientes.ativos[11] / dadosClientes.total[11]) * 100).toFixed(1);
  const ltvMedio = (segmentacaoClientes.reduce((acc, seg) => acc + seg.ltv * seg.quantidade, 0) / totalClientes).toFixed(0);
  const crescimentoClientes = ((dadosClientes.total[11] - dadosClientes.total[0]) / dadosClientes.total[0] * 100).toFixed(1);

  // Gráfico de Evolução de Clientes
  const evolucaoOption = {
    title: { text: 'Evolução da Base de Clientes', left: 'center' },
    tooltip: { 
      trigger: 'axis',
      formatter: function(params: any) {
        return `${params[0].name}<br/>
                Total: ${params[0].value} clientes<br/>
                Novos: ${params[1].value} clientes<br/>
                Ativos: ${params[2].value} clientes`;
      }
    },
    legend: { data: ['Total', 'Novos', 'Ativos'], top: 30 },
    xAxis: { type: 'category', data: meses },
    yAxis: { type: 'value', name: 'Clientes' },
    series: [
      {
        name: 'Total',
        type: 'line',
        data: dadosClientes.total,
        itemStyle: { color: '#1890ff' },
        smooth: true
      },
      {
        name: 'Novos',
        type: 'bar',
        data: dadosClientes.novos,
        itemStyle: { color: '#52c41a' }
      },
      {
        name: 'Ativos',
        type: 'line',
        data: dadosClientes.ativos,
        itemStyle: { color: '#722ed1' },
        smooth: true
      }
    ]
  };

  // Gráfico de Segmentação
  const segmentacaoOption = {
    title: { text: 'Segmentação de Clientes', left: 'center' },
    tooltip: { 
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} clientes ({d}%)<br/>LTV: R$ {e}'
    },
    series: [
      {
        name: 'Segmentação',
        type: 'pie',
        radius: '60%',
        data: segmentacaoClientes.map(item => ({
          value: item.quantidade,
          name: item.segmento,
          itemStyle: {
            color: item.segmento === 'Premium' ? '#faad14' : 
                   item.segmento === 'Gold' ? '#722ed1' :
                   item.segmento === 'Silver' ? '#1890ff' : '#d9d9d9'
          }
        })),
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
        }
      }
    ]
  };

  // Gráfico de Satisfação
  const satisfacaoOption = {
    title: { text: 'Satisfação do Cliente', left: 'center' },
    tooltip: { 
      trigger: 'axis',
      formatter: function(params: any) {
        return `${params[0].name}<br/>
                Satisfação: ${params[0].value}/5<br/>
                Reclamações: ${params[1].value}<br/>
                Elogios: ${params[2].value}`;
      }
    },
    legend: { data: ['Satisfação', 'Reclamações', 'Elogios'], top: 30 },
    xAxis: { type: 'category', data: satisfacaoClientes.map(s => s.mes) },
    yAxis: [
      { type: 'value', name: 'Satisfação', min: 0, max: 5, position: 'left' },
      { type: 'value', name: 'Quantidade', position: 'right' }
    ],
    series: [
      {
        name: 'Satisfação',
        type: 'line',
        data: satisfacaoClientes.map(s => s.satisfacao),
        itemStyle: { color: '#52c41a' },
        yAxisIndex: 0,
        smooth: true
      },
      {
        name: 'Reclamações',
        type: 'bar',
        data: satisfacaoClientes.map(s => s.reclamacoes),
        itemStyle: { color: '#ff4d4f' },
        yAxisIndex: 1
      },
      {
        name: 'Elogios',
        type: 'bar',
        data: satisfacaoClientes.map(s => s.elogios),
        itemStyle: { color: '#1890ff' },
        yAxisIndex: 1
      }
    ]
  };

  // Gráfico de Canais de Aquisição
  const canaisOption = {
    title: { text: 'Canais de Aquisição', left: 'center' },
    tooltip: { 
      trigger: 'axis',
      formatter: function(params: any) {
        return `${params[0].name}<br/>
                Clientes: ${params[0].value}<br/>
                CAC: R$ ${params[1].value}<br/>
                Conversão: ${params[2].value}%`;
      }
    },
    legend: { data: ['Clientes', 'CAC', 'Conversão'], top: 30 },
    xAxis: { type: 'category', data: canaisAquiscao.map(c => c.canal) },
    yAxis: [
      { type: 'value', name: 'Clientes', position: 'left' },
      { type: 'value', name: 'CAC (R$)', position: 'right' }
    ],
    series: [
      {
        name: 'Clientes',
        type: 'bar',
        data: canaisAquiscao.map(c => c.clientes),
        itemStyle: { color: '#1890ff' },
        yAxisIndex: 0
      },
      {
        name: 'CAC',
        type: 'line',
        data: canaisAquiscao.map(c => c.cac),
        itemStyle: { color: '#ff4d4f' },
        yAxisIndex: 1
      },
      {
        name: 'Conversão',
        type: 'line',
        data: canaisAquiscao.map(c => c.conversao),
        itemStyle: { color: '#52c41a' },
        yAxisIndex: 1
      }
    ]
  };

  // Colunas da tabela de clientes
  const colunasClientes = [
    {
      title: 'Cliente',
      dataIndex: 'nome',
      key: 'nome',
      render: (nome: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
            {record.avatar}
          </Avatar>
          <div>
            <div>{nome}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
          </div>
        </div>
      )
    },
    { 
      title: 'Valor Total', 
      dataIndex: 'valor', 
      key: 'valor',
      render: (valor: number) => `R$ ${valor.toLocaleString()}`,
      sorter: (a: any, b: any) => a.valor - b.valor
    },
    { 
      title: 'Compras', 
      dataIndex: 'compras', 
      key: 'compras',
      sorter: (a: any, b: any) => a.compras - b.compras
    },
    { 
      title: 'Última Compra', 
      dataIndex: 'ultimaCompra', 
      key: 'ultimaCompra' 
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'Premium' ? 'gold' : 
          status === 'Ativo' ? 'green' : 
          'red'
        }>
          {status}
        </Tag>
      )
    }
  ];

  const kpis = [
    {
      title: 'Total de Clientes',
      value: totalClientes.toLocaleString(),
      icon: <UserOutlined style={{ fontSize: 32, color: '#1890ff', opacity: 0.2 }} />,
      desc: 'Base ativa',
      badge: `+${crescimentoClientes}% vs ano anterior`,
      badgeColor: 'green'
    },
    {
      title: 'Taxa de Retenção',
      value: `${taxaRetencao}%`,
      icon: <HeartOutlined style={{ fontSize: 32, color: '#52c41a', opacity: 0.2 }} />,
      desc: 'Clientes ativos',
      badge: '+5% vs mês anterior',
      badgeColor: 'green'
    },
    {
      title: 'LTV Médio',
      value: `R$ ${ltvMedio}`,
      icon: <DollarOutlined style={{ fontSize: 32, color: '#722ed1', opacity: 0.2 }} />,
      desc: 'Lifetime Value',
      badge: '+15% vs ano anterior',
      badgeColor: 'blue'
    },
    {
      title: 'Satisfação',
      value: '4.7/5',
      icon: <StarOutlined style={{ fontSize: 32, color: '#faad14', opacity: 0.2 }} />,
      desc: 'NPS Score',
      badge: '+0.3 vs mês anterior',
      badgeColor: 'green'
    }
  ];

  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Dashboard de Clientes</div>
      <div style={{ color: '#888', marginBottom: 32 }}>
        Análise completa de comportamento, satisfação e valor dos clientes
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Select value={periodo} onChange={setPeriodo} style={{ width: 120 }}>
          <Select.Option value="3M">Últimos 3M</Select.Option>
          <Select.Option value="6M">Últimos 6M</Select.Option>
          <Select.Option value="12M">Últimos 12M</Select.Option>
        </Select>
        <Select value={segmento} onChange={setSegmento} style={{ width: 150 }}>
          <Select.Option value="Todos">Todos Segmentos</Select.Option>
          <Select.Option value="Premium">Premium</Select.Option>
          <Select.Option value="Gold">Gold</Select.Option>
          <Select.Option value="Silver">Silver</Select.Option>
          <Select.Option value="Bronze">Bronze</Select.Option>
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

      {/* Gráficos de Análise */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={evolucaoOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={segmentacaoOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Satisfação e Canais */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={satisfacaoOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={canaisOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Segmentação Detalhada */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <div style={{ padding: '20px 0' }}>
                <h4 style={{ marginBottom: 20 }}>Segmentação por Valor</h4>
                {segmentacaoClientes.map((seg, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>{seg.segmento}</span>
                      <span style={{ fontWeight: 600 }}>
                        R$ {seg.receita.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      percent={seg.percentual} 
                      strokeColor={
                        seg.segmento === 'Premium' ? '#faad14' : 
                        seg.segmento === 'Gold' ? '#722ed1' :
                        seg.segmento === 'Silver' ? '#1890ff' : '#d9d9d9'
                      }
                      format={() => `${seg.quantidade} clientes`}
                    />
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                      LTV: R$ {seg.ltv} | {seg.percentual}% da base
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <div style={{ padding: '20px 0' }}>
                <h4 style={{ marginBottom: 20 }}>Performance por Canal</h4>
                {canaisAquiscao.map((canal, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>{canal.canal}</span>
                      <span style={{ fontWeight: 600 }}>
                        {canal.clientes} clientes
                      </span>
                    </div>
                    <Progress 
                      percent={Math.round((canal.clientes / canaisAquiscao.reduce((acc, c) => acc + c.clientes, 0)) * 100)} 
                      strokeColor={canal.conversao > 15 ? '#52c41a' : '#faad14'}
                      format={() => `${canal.conversao}% conversão`}
                    />
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                      CAC: R$ {canal.cac} | Custo: R$ {canal.custo.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Tabela de Clientes */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
        <Card variant="outlined" style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}>
          <h4 style={{ marginBottom: 20 }}>Clientes Recentes</h4>
          <Table 
            columns={colunasClientes} 
            dataSource={clientesRecentes} 
            pagination={false}
            size="small"
          />
        </Card>
      </motion.div>
    </div>
  );
} 