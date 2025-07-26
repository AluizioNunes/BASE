import { useState } from 'react';
import { Card, Row, Col, Button } from 'antd';
import UsuarioModal from '../components/UsuarioModal';

const usuarios = [
  { id: 1, nome: 'Renata F.', email: 'renata@email.com', perfil: 'Administrador' },
  { id: 2, nome: 'João Silva', email: 'joao@email.com', perfil: 'Usuário' },
  { id: 3, nome: 'Maria Souza', email: 'maria@email.com', perfil: 'Usuário' },
];

export default function Usuario() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Usuários</h2>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          NOVO USUÁRIO
        </Button>
      </div>
      <Row gutter={[24, 24]}>
        {usuarios.map((user) => (
          <Col xs={24} sm={12} md={8} key={user.id}>
            <Card title={user.nome} bordered style={{ borderRadius: 12 }}>
              <div><b>Email:</b> {user.email}</div>
              <div><b>Perfil:</b> {user.perfil}</div>
            </Card>
          </Col>
        ))}
      </Row>
      <UsuarioModal open={modalOpen} onCancel={() => setModalOpen(false)} />
    </div>
  );
} 