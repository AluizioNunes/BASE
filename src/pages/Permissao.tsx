import React from 'react';
import { Form, Checkbox, Button, Card } from 'antd';

const permissoes = [
  'Visualizar Usuários',
  'Editar Usuários',
  'Excluir Usuários',
  'Visualizar Relatórios',
  'Editar Configurações',
];

export default function Permissoes() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 32 }}>
      <Card title="Permissões do Perfil" bordered={false} style={{ borderRadius: 12 }}>
        <Form layout="vertical">
          <Form.Item label="Permissões">
            <Checkbox.Group options={permissoes} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Salvar Permissões
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 