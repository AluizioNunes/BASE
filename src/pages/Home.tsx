import React, { useState } from 'react';
import { Card, List, Alert, Row, Col, Badge, Select } from 'antd';
import { DollarOutlined, TeamOutlined, ShoppingOutlined, UserAddOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';

const canais = ['Todos', 'Online', 'Loja Física', 'Marketplace', 'Representantes'];
const meses = ['Todos', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];

const dadosOriginais = [
  { canal: 'Online', mes: 'Jan', vendas: 300, faturamento: 12000 },
  { canal: 'Online', mes: 'Fev', vendas: 320, faturamento: 15000 },
  { canal: 'Loja Física', mes: 'Jan', vendas: 200, faturamento: 8000 },
  { canal: 'Loja Física', mes: 'Fev', vendas: 220, faturamento: 9000 },
  { canal: 'Marketplace', mes: 'Jan', vendas: 150, faturamento: 6000 },
  { canal: 'Marketplace', mes: 'Fev', vendas: 180, faturamento: 7000 },
  { canal: 'Representantes', mes: 'Jan', vendas: 100, faturamento: 4000 },
  { canal: 'Representantes', mes: 'Fev', vendas: 120, faturamento: 5000 },
];

export default function Home() {
  const [canal, setCanal] = useState('Todos');
  const [mes, setMes] = useState('Todos');

  // Filtro cruzado
  const dadosFiltrados = dadosOriginais.filter(d =>
    (canal === 'Todos' || d.canal === canal) &&
    (mes === 'Todos' || d.mes === mes)
  );

  // Dados para gráfico de pizza (distribuição por canal)
  const pizzaData = canais.filter(c => c !== 'Todos').map(canal => ({
    value: dadosFiltrados.filter(d => d.canal === canal).reduce((acc, d) => acc + d.vendas, 0),
    name: canal,
  }));

  // Dados para gráfico de barras (vendas por mês)
  const mesesUnicos = meses.filter(m => m !== 'Todos');
  const barraData = mesesUnicos.map(mes => dadosFiltrados.filter(d => d.mes === mes).reduce((acc, d) => acc + d.vendas, 0));

  // Dados para gráfico de linha (faturamento por mês)
  const linhaData = mesesUnicos.map(mes => dadosFiltrados.filter(d => d.mes === mes).reduce((acc, d) => acc + d.faturamento, 0));

  const pieOption = {
    title: { text: 'Distribuição de Vendas por Canal', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: 'Vendas',
        type: 'pie',
        radius: '60%',
        data: pizzaData,
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
      },
    ],
  };

  const barOption = {
    title: { text: 'Vendas por Mês', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: mesesUnicos },
    yAxis: { type: 'value', name: 'Vendas' },
    series: [
      {
        name: 'Vendas',
        type: 'bar',
        data: barraData,
        itemStyle: { color: '#2563eb' },
      },
    ],
  };

  const lineOption = {
    title: { text: 'Faturamento por Mês', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: mesesUnicos },
    yAxis: { type: 'value', name: 'R$' },
    series: [
      {
        name: 'Faturamento',
        type: 'line',
        data: linhaData,
        areaStyle: {},
        itemStyle: { color: '#52c41a' },
        smooth: true,
      },
    ],
  };

  const cardsResumo = [
    {
      title: 'Total de Clientes',
      value: 3,
      icon: <TeamOutlined style={{ fontSize: 32, color: '#2563eb', opacity: 0.2 }} />,
      desc: 'Clientes ativos',
      badge: '+12% este mês',
      badgeColor: 'green',
    },
    {
      title: 'Produtos Cadastrados',
      value: 5,
      icon: <ShoppingOutlined style={{ fontSize: 32, color: '#52c41a', opacity: 0.2 }} />,
      desc: 'Itens no catálogo',
      badge: '+5% este mês',
      badgeColor: 'green',
    },
    {
      title: 'Fornecedores',
      value: 2,
      icon: <UserAddOutlined style={{ fontSize: 32, color: '#faad14', opacity: 0.2 }} />,
      desc: 'Parceiros ativos',
    },
    {
      title: 'Faturamento do Mês',
      value: 'R$ 0,00',
      icon: <DollarOutlined style={{ fontSize: 32, color: '#fa541c', opacity: 0.2 }} />,
      desc: 'Receita confirmada',
      badge: '+8% vs mês anterior',
      badgeColor: 'green',
    },
  ];

  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Painel</div>
      <div style={{ color: '#888', marginBottom: 32 }}>Bem-vindo de volta, Renata F. ! Aqui está um resumo do seu negócio.</div>
      {/* Cards de resumo */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        {cardsResumo.map((card, idx) => (
          <Col key={idx} xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
            >
              <Card variant="outlined" style={{ borderRadius: 12, minHeight: 120, boxShadow: '0 2px 8px #f0f1f2' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#555', marginBottom: 4 }}>{card.title}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#222' }}>{card.value}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>{card.desc}</div>
                    {card.badge && <div style={{ color: card.badgeColor, fontSize: 13, fontWeight: 600 }}>{card.badge}</div>}
                  </div>
                  {card.icon}
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
      {/* Filtros dinâmicos */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Select value={canal} onChange={setCanal} style={{ width: 180 }}>
          {canais.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
        </Select>
        <Select value={mes} onChange={setMes} style={{ width: 120 }}>
          {meses.map(m => <Select.Option key={m} value={m}>{m}</Select.Option>)}
        </Select>
      </div>
      {/* Gráficos com filtros cruzados */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={pieOption} style={{ height: 280 }} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={barOption} style={{ height: 280 }} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={24}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card variant="outlined" style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
              <ReactECharts option={lineOption} style={{ height: 280 }} />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
} 