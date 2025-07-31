

import { Modal, Form, Input, Button } from 'antd';
import type { ModalProps } from 'antd';

export default function UsuarioModal(props: ModalProps) {
  return (
    <Modal title="Novo Usuário" {...props} footer={null}>
      <Form layout="vertical">
        <Form.Item label="Nome" name="nome" required>
          <Input placeholder="Digite o nome do usuário" />
        </Form.Item>
        <Form.Item label="Email" name="email" required>
          <Input placeholder="Digite o email" type="email" />
        </Form.Item>
        <Form.Item label="Perfil" name="perfil" required>
          <Input placeholder="Administrador, Usuário, etc." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
} 