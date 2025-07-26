
import { Form, Input, Button, Card } from 'antd';

export default function Perfil() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 32 }}>
      <Card title="Editar Perfil" bordered={false} style={{ borderRadius: 12 }}>
        <Form layout="vertical">
          <Form.Item label="Nome" name="nome" required>
            <Input placeholder="Digite seu nome" />
          </Form.Item>
          <Form.Item label="Email" name="email" required>
            <Input placeholder="Digite seu email" type="email" />
          </Form.Item>
          <Form.Item label="Senha" name="senha">
            <Input.Password placeholder="Digite uma nova senha" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 