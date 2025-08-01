import { useState } from 'react';
import { Card, Row, Col, Select, Progress, Table, Tag, Alert } from 'antd';
import { 
  ShoppingOutlined, 
  CarOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Dados simulados para métricas operacionais
const dadosOperacionais = {
  pedidos: [150, 180, 200, 220, 250, 280, 300, 320, 350, 380, 400, 420],
  entregas: [140, 170, 190, 210, 240, 270, 290, 310, 340, 370, 390, 410],
  tempoEntrega: [2.5, 2.3, 2.1, 2.0, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1],
  satisfacao: [4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.8, 4.9, 4.9, 5.0, 5.0]
};

const estoqueProdutos = [
  { produto: 'Produto A', estoque: 150, minimo: 50, maximo: 200, status: 'Normal', categoria: 'Eletrônicos' },
  { produto: 'Produto B', estoque: 30, minimo: 50, maximo: 200, status: 'Baixo', categoria: 'Informática' },
  { produto: 'Produto C', estoque: 80, minimo: 30, maximo: 150, status: 'Normal', categoria: 'Acessórios' },
  { produto: 'Produto D', estoque: 250, minimo: 100, maximo: 300, status: 'Alto', categoria: 'Eletrônicos' },
  { produto: 'Produto E', estoque: 15, minimo: 40, maximo: 120, status: 'Crítico', categoria: 'Informática' }
];

const pedidosPendentes = [
  { id: 'PED001', cliente: 'João Silva', valor: 2500, status: 'Em Separação', tempo: '2h', prioridade: 'Alta' },
  { id: 'PED002', cliente: 'Maria Santos', valor: 1800, status: 'Em Transporte', tempo: '1h', prioridade: 'Média' },
  { id: 'PED003', cliente: 'Pedro Costa', valor: 3200, status: 'Aguardando Pagamento', tempo: '4h', prioridade: 'Baixa' },
  { id: 'PED004', cliente: 'Ana Oliveira', valor: 1200, status: 'Em Separação', tempo: '3h', prioridade: 'Alta' },
  { id: 'PED005', cliente: 'Carlos Lima', valor: 4500, status: 'Entregue', tempo: '0h', prioridade: 'Média' }
];

const metricasQualidade = [
  { mes: 'Jan', defeitos: 15, retornos: 8, satisfacao: 4.2 },
  { mes: 'Fev', defeitos: 12, retornos: 6, satisfacao: 4.3 },
  { mes: 'Mar', defeitos: 10, retornos: 5, satisfacao: 4.4 },
  { mes: 'Abr', defeitos: 8, retornos: 4, satisfacao: 4.5 },
  { mes: 'Mai', defeitos: 6, retornos: 3, satisfacao: 4.6 },
  { mes: 'Jun', defeitos: 5, retornos: 2, satisfacao: 4.7 }
];

const produtividadeEquipe = [
  { funcionario: 'João Silva', pedidos: 85, tempo: '6.5h', eficiencia: 95, status: 'Excelente' },
  { funcionario: 'Maria Santos', pedidos: 92, tempo: '7.2h', eficiencia: 88, status: 'Bom' },
  { funcionario: 'Pedro Costa', pedidos: 78, tempo: '8.1h', eficiencia: 82, status: 'Bom' },
  { funcionario: 'Ana Oliveira', pedidos: 95, tempo: '6.8h', eficiencia: 92, status: 'Excelente' },
  { funcionario: 'Carlos Lima', pedidos: 88, tempo: '7.5h', eficiencia: 85, status: 'Bom' }
];

const alertasOperacionais = [
  { tipo: 'Estoque Baixo', produto: 'Produto B', nivel: '30 unidades', prioridade: 'Alta' },
  { tipo: 'Estoque Crítico', produto: 'Produto E', nivel: '15 unidades', prioridade: 'Crítica' },
  { tipo: 'Pedido Atrasado', cliente: 'João Silva', tempo: '2h atraso', prioridade: 'Média' },
  { tipo: 'Qualidade', produto: 'Produto C', defeito: '3% taxa', prioridade: 'Baixa' }
];

export default function DashboardOperacional() {
  const [periodo, setPeriodo] = useState('12M');
  const [categoria, setCategoria] = useState('Todas');

  // Cálculos de KPIs
  const totalPedidos = dadosOperacionais.pedidos.reduce((a, b) => a + b, 0);
  const totalEntregas = dadosOperacionais.entregas.reduce((a, b) => a + b, 0);
  const taxaEntrega = ((totalEntregas / totalPedidos) * 100).toFixed(1);
  const tempoMedioEntrega = (dadosOperacionais.tempoEntrega.reduce((a, b) => a + b, 0) / 12).toFixed(1);
  const satisfacaoMedia = (dadosOperacionais.satisfacao.reduce((a, b) => a + b, 0) / 12).toFixed(1);

  // Gráfico de Pedidos vs Entregas
  const pedidosEntregasOption = {
    title: { text: 'Pedidos vs Entregas (Últimos 12 meses)', left: 'center' },
    tooltip: { 
      trigger: 'axis',
      formatter: function(params: any) {
        return `${params[0].name}<br/>
                Pedidos: ${params[0].value}<br/>
                Entregas: ${params[1].value}<br/>
                Taxa: ${((params[1].value / params[0].value) * 100).toFixed(1)}%`;
      }
    },
    legend: { data: ['Pedidos', 'Entregas'], top: 30 },
    xAxis: { type: 'category', data: meses },
    yAxis: { type: 'value', name: 'Quantidade' },
    series: [
      {
        name: 'Pedidos',
        type: 'bar',
        data: dadosOperacionais.pedidos,
        itemStyle: { color: '#1890ff' }
      },
      {
        name: 'Entregas',
        type: 'bar',
        data: dadosOperacionais.entregas,
        itemStyle: { color: '#52c41a' }
      }
    ]
  };

  // Gráfico de Tempo de Entrega
  const tempoEntregaOption = {
    title: { text: 'Tempo Médio de Entrega (dias)', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: meses },
    yAxis: { type: 'value', name: 'Dias', min: 0, max: 3 },
    series: [
      {
        name: 'Tempo de Entrega',
        type: 'line',
        data: dadosOperacionais.tempoEntrega,
        itemStyle: { color: '#722ed1' },
        areaStyle: { color: 'rgba(114, 46, 209, 0.1)' },
        smooth: true
      }
    ]
  };

  // Gráfico de Qualidade
  const qualidadeOption = {
    title: { text: 'Métricas de Qualidade', left: 'center' },
    tooltip: { 
      trigger: 'axis',
      formatter: function(params: any) {
        return `${params[0].name}<br/>
                Defeitos: ${params[0].value}<br/>
                Retornos: ${params[1].value}<br/>
                Satisfação: ${params[2].value}/5`;
      }
    },
    legend: { data: ['Defeitos', 'Retornos', 'Satisfação'], top: 30 },
    xAxis: { type: 'category', data: metricasQualidade.map(m => m.mes) },
    yAxis: [
      { type: 'value', name: 'Quantidade', position: 'left' },
      { type: 'value', name: 'Satisfação', min: 0, max: 5, position: 'right' }
    ],
    series: [
      {
        name: 'Defeitos',
        type: 'bar',
        data: metricasQualidade.map(m => m.defeitos),
        itemStyle: { color: '#ff4d4f' },
        yAxisIndex: 0
      },
      {
        name: 'Retornos',
        type: 'bar',
        data: metricasQualidade.map(m => m.retornos),
        itemStyle: { color: '#faad14' },
        yAxisIndex: 0
      },
      {
        name: 'Satisfação',
        type: 'line',
        data: metricasQualidade.map(m => m.satisfacao),
        itemStyle: { color: '#52c41a' },
        yAxisIndex: 1,
        smooth: true
      }
    ]
  };

  // Gráfico de Estoque
  const estoqueOption = {
    title: { text: 'Status do Estoque', left: 'center' },
    tooltip: { 
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} produtos ({d}%)'
    },
    series: [
      {
        name: 'Estoque',
        type: 'pie',
        radius: '60%',
        data: [
          { value: estoqueProdutos.filter(p => p.status === 'Normal').length, name: 'Normal', itemStyle: { color: '#52c41a' } },
          { value: estoqueProdutos.filter(p => p.status === 'Baixo').length, name: 'Baixo', itemStyle: { color: '#faad14' } },
          { value: estoqueProdutos.filter(p => p.status === 'Alto').length, name: 'Alto', itemStyle: { color: '#1890ff' } },
          { value: estoqueProdutos.filter(p => p.status === 'Crítico').length, name: 'Crítico', itemStyle: { color: '#ff4d4f' } }
        ],
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
        }
      }
    ]
  };

  // Colunas da tabela de estoque
  const colunasEstoque = [
    { title: 'Produto', dataIndex: 'produto', key: 'produto' },
    { 
      title: 'Estoque', 
      dataIndex: 'estoque', 
      key: 'estoque',
      render: (estoque: number, record: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{estoque} unidades</div>
          <div style={{ fontSize: 12, color: '#888' }}>
            Min: {record.minimo} | Max: {record.maximo}
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'Normal' ? 'green' : 
          status === 'Baixo' ? 'orange' : 
          status === 'Alto' ? 'blue' : 'red'
        }>
          {status}
        </Tag>
      )
    },
    { title: 'Categoria', dataIndex: 'categoria', key: 'categoria' }
  ];

  // Colunas da tabela de pedidos
  const colunasPedidos = [
    { title: 'Pedido', dataIndex: 'id', key: 'id' },
    { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
    { 
      title: 'Valor', 
      dataIndex: 'valor', 
      key: 'valor',
      render: (valor: number) => `R$ ${valor.toLocaleString()}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'Entregue' ? 'green' : 
          status === 'Em Transporte' ? 'blue' : 
          status === 'Em Separação' ? 'orange' : 'red'
        }>
          {status}
        </Tag>
      )
    },
    { title: 'Tempo', dataIndex: 'tempo', key: 'tempo' },
    {
      title: 'Prioridade',
      dataIndex: 'prioridade',
      key: 'prioridade',
      render: (prioridade: string) => (
        <Tag color={
          prioridade === 'Alta' ? 'red' : 
          prioridade === 'Média' ? 'orange' : 'green'
        }>
          {prioridade}
        </Tag>
      )
    }
  ];

  const kpis = [
    {
      title: 'Total de Pedidos',
      value: totalPedidos.toLocaleString(),
      icon: <ShoppingOutlined style={{ fontSize: 32, color: '#1890ff', opacity: 0.2 }} />,
      desc: 'Últimos 12 meses',
      badge: '+15% vs ano anterior',
      badgeColor: 'green'
    },
    {
      title: 'Taxa de Entrega',
      value: `${taxaEntrega}%`,
      icon: <CarOutlined style={{ fontSize: 32, color: '#52c41a', opacity: 0.2 }} />,
      desc: 'Pedidos entregues',
      badge: '+2% vs mês anterior',
      badgeColor: 'green'
    },
    {
      title: 'Tempo Médio',
      value: `${tempoMedioEntrega} dias`,
      icon: <ClockCircleOutlined style={{ fontSize: 32, color: '#722ed1', opacity: 0.2 }} />,
      desc: 'Entrega',
      badge: '-0.3 dias vs mês anterior',
      badgeColor: 'blue'
    },
    {
      title: 'Satisfação',
      value: `${satisfacaoMedia}/5`,
      icon: <CheckCircleOutlined style={{ fontSize: 32, color: '#faad14', opacity: 0.2 }} />,
      desc: 'Cliente',
      badge: '+0.2 vs mês anterior',
      badgeColor: 'green'
    }
  ];

  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Dashboard Operacional</div>
      <div style={{ color: '#888', marginBottom: 32 }}>
        Monitoramento de operações, estoque, logística e qualidade
      </div>

      {/* Alertas */}
      {alertasOperacionais.filter(a => a.prioridade === 'Crítica').length > 0 && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Alert
            message="Alertas Críticos"
            description={`${alertasOperacionais.filter(a => a.prioridade === 'Crítica').length} alerta(s) crítico(s) requerem atenção imediata`}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        </motion.div>
      )}

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
              <ReactECharts option={pedidosEntregasOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={tempoEntregaOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Qualidade e Estoque */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={qualidadeOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={estoqueOption} style={{ height: 300 }} />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Produtividade da Equipe */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <div style={{ padding: '20px 0' }}>
                <h4 style={{ marginBottom: 20 }}>Produtividade da Equipe</h4>
                {produtividadeEquipe.map((func, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>{func.funcionario}</span>
                      <span style={{ fontWeight: 600 }}>
                        {func.pedidos} pedidos
                      </span>
                    </div>
                    <Progress 
                      percent={func.eficiencia} 
                      strokeColor={func.eficiencia > 90 ? '#52c41a' : func.eficiencia > 80 ? '#faad14' : '#ff4d4f'}
                      format={() => `${func.eficiencia}%`}
                    />
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                      {func.tempo} | {func.status}
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
                <h4 style={{ marginBottom: 20 }}>Alertas Operacionais</h4>
                {alertasOperacionais.map((alerta, idx) => (
                  <div key={idx} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{alerta.tipo}</span>
                      <Tag color={
                        alerta.prioridade === 'Crítica' ? 'red' : 
                        alerta.prioridade === 'Alta' ? 'orange' : 'green'
                      }>
                        {alerta.prioridade}
                      </Tag>
                    </div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      {alerta.produto || alerta.cliente} - {alerta.nivel || alerta.tempo || alerta.defeito}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Tabelas */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
            <Card variant="outlined" style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}>
              <h4 style={{ marginBottom: 20 }}>Status do Estoque</h4>
              <Table 
                columns={colunasEstoque} 
                dataSource={estoqueProdutos} 
                pagination={false}
                size="small"
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }}>
            <Card variant="outlined" style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}>
              <h4 style={{ marginBottom: 20 }}>Pedidos Pendentes</h4>
              <Table 
                columns={colunasPedidos} 
                dataSource={pedidosPendentes} 
                pagination={false}
                size="small"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
} 