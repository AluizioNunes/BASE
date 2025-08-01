import { useState } from 'react';
import { Card, Row, Col, Select, Progress, Table, Tag, Avatar } from 'antd';
import { 
  ShoppingOutlined, 
  UserOutlined, 
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  TeamOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Dados simulados para métricas de vendas
const dadosVendas = {
  vendas: [300, 320, 350, 380, 420, 450, 480, 520, 550, 580, 620, 650],
  receita: [12000, 15000, 18000, 16000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000],
  ticket: [40, 46.9, 51.4, 42.1, 52.4, 55.6, 58.3, 61.5, 63.6, 65.5, 67.7, 69.2]
};

const produtosMaisVendidos = [
  { nome: 'Produto A', vendas: 150, receita: 7500, crescimento: 25, categoria: 'Eletrônicos' },
  { nome: 'Produto B', vendas: 120, receita: 6000, crescimento: 15, categoria: 'Informática' },
  { nome: 'Produto C', vendas: 100, receita: 5000, crescimento: -5, categoria: 'Acessórios' },
  { nome: 'Produto D', vendas: 80, receita: 4000, crescimento: 30, categoria: 'Eletrônicos' },
  { nome: 'Produto E', vendas: 60, receita: 3000, crescimento: 10, categoria: 'Informática' }
];

const vendedores = [
  { nome: 'João Silva', vendas: 85, receita: 4250, meta: 80, avatar: 'JS' },
  { nome: 'Maria Santos', vendas: 92, receita: 4600, meta: 80, avatar: 'MS' },
  { nome: 'Pedro Costa', vendas: 78, receita: 3900, meta: 80, avatar: 'PC' },
  { nome: 'Ana Oliveira', vendas: 95, receita: 4750, meta: 80, avatar: 'AO' },
  { nome: 'Carlos Lima', vendas: 88, receita: 4400, meta: 80, avatar: 'CL' }
];

const funilVendas = [
  { etapa: 'Leads', quantidade: 1000, conversao: 100 },
  { etapa: 'Prospecção', quantidade: 800, conversao: 80 },
  { etapa: 'Proposta', quantidade: 400, conversao: 50 },
  { etapa: 'Negociação', quantidade: 200, conversao: 50 },
  { etapa: 'Fechamento', quantidade: 100, conversao: 50 }
];

const canaisVenda = [
  { canal: 'Site', vendas: 300, receita: 15000, crescimento: 20 },
  { canal: 'Marketplace', vendas: 250, receita: 12500, crescimento: 15 },
  { canal: 'Loja Física', vendas: 200, receita: 10000, crescimento: 10 },
  { canal: 'Telefone', vendas: 150, receita: 7500, crescimento: 5 },
  { canal: 'WhatsApp', vendas: 100, receita: 5000, crescimento: 30 }
];

export default function DashboardVendas() {
  const [periodo, setPeriodo] = useState('12M');
  const [categoria, setCategoria] = useState('Todas');

  // Cálculos de KPIs
  const totalVendas = dadosVendas.vendas.reduce((a, b) => a + b, 0);
  const totalReceita = dadosVendas.receita.reduce((a, b) => a + b, 0);
  const ticketMedio = (totalReceita / totalVendas).toFixed(2);
  const crescimentoVendas = ((dadosVendas.vendas[11] - dadosVendas.vendas[0]) / dadosVendas.vendas[0] * 100).toFixed(1);

  // Gráfico de Vendas por Mês
  const vendasOption = {
    title: { text: 'Evolução de Vendas (Últimos 12 meses)', left: 'center' },
    tooltip: { 
      trigger: 'axis',
      formatter: function(params: any) {
        return `${params[0].name}<br/>
                Vendas: ${params[0].value} unidades<br/>
                Receita: R$ ${params[1].value.toLocaleString()}<br/>
                Ticket: R$ ${(params[1].value / params[0].value).toFixed(2)}`;
      }
    },
    legend: { data: ['Vendas', 'Receita'], top: 30 },
    xAxis: { type: 'category', data: meses },
    yAxis: [
      { type: 'value', name: 'Vendas', position: 'left' },
      { type: 'value', name: 'Receita (R$)', position: 'right' }
    ],
    series: [
      {
        name: 'Vendas',
        type: 'bar',
        data: dadosVendas.vendas,
        itemStyle: { color: '#1890ff' },
        yAxisIndex: 0
      },
      {
        name: 'Receita',
        type: 'line',
        data: dadosVendas.receita,
        itemStyle: { color: '#52c41a' },
        yAxisIndex: 1,
        smooth: true
      }
    ]
  };

  // Gráfico de Ticket Médio
  const ticketOption = {
    title: { text: 'Ticket Médio por Mês', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: meses },
    yAxis: { type: 'value', name: 'R$' },
    series: [
      {
        name: 'Ticket Médio',
        type: 'line',
        data: dadosVendas.ticket,
        itemStyle: { color: '#722ed1' },
        areaStyle: { color: 'rgba(114, 46, 209, 0.1)' },
        smooth: true
      }
    ]
  };

  // Gráfico de Produtos Mais Vendidos
  const produtosOption = {
    title: { text: 'Top 5 Produtos Mais Vendidos', left: 'center' },
    tooltip: { 
      trigger: 'axis',
      formatter: function(params: any) {
        return `${params[0].name}<br/>
                Vendas: ${params[0].value} unidades<br/>
                Receita: R$ ${params[1].value.toLocaleString()}`;
      }
    },
    legend: { data: ['Vendas', 'Receita'], top: 30 },
    xAxis: { type: 'category', data: produtosMaisVendidos.map(p => p.nome) },
    yAxis: [
      { type: 'value', name: 'Vendas', position: 'left' },
      { type: 'value', name: 'Receita (R$)', position: 'right' }
    ],
    series: [
      {
        name: 'Vendas',
        type: 'bar',
        data: produtosMaisVendidos.map(p => p.vendas),
        itemStyle: { color: '#1890ff' },
        yAxisIndex: 0
      },
      {
        name: 'Receita',
        type: 'line',
        data: produtosMaisVendidos.map(p => p.receita),
        itemStyle: { color: '#52c41a' },
        yAxisIndex: 1
      }
    ]
  };

  // Gráfico de Funil de Vendas
  const funilOption = {
    title: { text: 'Funil de Vendas', left: 'center' },
    tooltip: { 
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} leads ({d}%)'
    },
    series: [
      {
        name: 'Funil',
        type: 'funnel',
        left: '10%',
        top: 60,
        width: '80%',
        height: '80%',
        min: 0,
        max: 1000,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: funilVendas.map(item => ({
          value: item.quantidade,
          name: `${item.etapa} (${item.conversao}%)`
        }))
      }
    ]
  };

  // Colunas da tabela de vendedores
  const colunasVendedores = [
    {
      title: 'Vendedor',
      dataIndex: 'nome',
      key: 'nome',
      render: (nome: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
            {record.avatar}
          </Avatar>
          {nome}
        </div>
      )
    },
    { 
      title: 'Vendas', 
      dataIndex: 'vendas', 
      key: 'vendas',
      sorter: (a: any, b: any) => a.vendas - b.vendas
    },
    { 
      title: 'Receita', 
      dataIndex: 'receita', 
      key: 'receita',
      render: (receita: number) => `R$ ${receita.toLocaleString()}`,
      sorter: (a: any, b: any) => a.receita - b.receita
    },
    {
      title: 'Meta',
      dataIndex: 'meta',
      key: 'meta',
      render: (meta: number, record: any) => (
        <Progress 
          percent={Math.round((record.vendas / meta) * 100)} 
          size="small"
          strokeColor={record.vendas >= meta ? '#52c41a' : '#faad14'}
        />
      )
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (record: any) => {
        const percentual = Math.round((record.vendas / record.meta) * 100);
        return (
          <Tag color={percentual >= 100 ? 'green' : percentual >= 80 ? 'orange' : 'red'}>
            {percentual}%
          </Tag>
        );
      }
    }
  ];

  const kpis = [
    {
      title: 'Total de Vendas',
      value: totalVendas.toLocaleString(),
      icon: <ShoppingOutlined style={{ fontSize: 32, color: '#1890ff', opacity: 0.2 }} />,
      desc: 'Unidades vendidas',
      badge: `+${crescimentoVendas}% vs ano anterior`,
      badgeColor: 'green'
    },
    {
      title: 'Receita Total',
      value: `R$ ${totalReceita.toLocaleString()}`,
      icon: <RiseOutlined style={{ fontSize: 32, color: '#52c41a', opacity: 0.2 }} />,
      desc: 'Faturamento bruto',
      badge: '+18% vs ano anterior',
      badgeColor: 'green'
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${ticketMedio}`,
      icon: <BarChartOutlined style={{ fontSize: 32, color: '#722ed1', opacity: 0.2 }} />,
      desc: 'Por venda',
      badge: '+12% vs ano anterior',
      badgeColor: 'blue'
    },
    {
      title: 'Taxa de Conversão',
      value: '10%',
      icon: <TrophyOutlined style={{ fontSize: 32, color: '#faad14', opacity: 0.2 }} />,
      desc: 'Leads para vendas',
      badge: '+2% vs mês anterior',
      badgeColor: 'green'
    }
  ];

  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Dashboard de Vendas</div>
      <div style={{ color: '#888', marginBottom: 32 }}>
        Análise detalhada de performance de vendas, produtos e equipe comercial
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Select value={periodo} onChange={setPeriodo} style={{ width: 120 }}>
          <Select.Option value="3M">Últimos 3M</Select.Option>
          <Select.Option value="6M">Últimos 6M</Select.Option>
          <Select.Option value="12M">Últimos 12M</Select.Option>
        </Select>
        <Select value={categoria} onChange={setCategoria} style={{ width: 150 }}>
          <Select.Option value="Todas">Todas Categorias</Select.Option>
          <Select.Option value="Eletrônicos">Eletrônicos</Select.Option>
          <Select.Option value="Informática">Informática</Select.Option>
          <Select.Option value="Acessórios">Acessórios</Select.Option>
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
              <ReactECharts option={vendasOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={ticketOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Produtos e Canais */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={produtosOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <div style={{ padding: '20px 0' }}>
                <h4 style={{ marginBottom: 20 }}>Performance por Canal</h4>
                {canaisVenda.map((canal, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>{canal.canal}</span>
                      <span style={{ fontWeight: 600 }}>
                        R$ {canal.receita.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      percent={Math.round((canal.receita / totalReceita) * 100)} 
                      strokeColor={canal.crescimento > 0 ? '#52c41a' : '#ff4d4f'}
                      format={() => `${canal.vendas} vendas`}
                    />
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                      {canal.crescimento > 0 ? '+' : ''}{canal.crescimento}% vs mês anterior
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Funil de Vendas */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={funilOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <div style={{ padding: '20px 0' }}>
                <h4 style={{ marginBottom: 20 }}>Taxas de Conversão</h4>
                {funilVendas.map((etapa, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>{etapa.etapa}</span>
                      <span style={{ fontWeight: 600 }}>
                        {etapa.quantidade} leads
                      </span>
                    </div>
                    <Progress 
                      percent={etapa.conversao} 
                      strokeColor={etapa.conversao > 60 ? '#52c41a' : etapa.conversao > 40 ? '#faad14' : '#ff4d4f'}
                      format={() => `${etapa.conversao}%`}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Tabela de Vendedores */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
        <Card variant="outlined" style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}>
          <h4 style={{ marginBottom: 20 }}>Performance da Equipe de Vendas</h4>
          <Table 
            columns={colunasVendedores} 
            dataSource={vendedores} 
            pagination={false}
            size="small"
          />
        </Card>
      </motion.div>
    </div>
  );
} 