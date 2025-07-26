

import { Modal as AntdModal } from 'antd';
import type { ModalProps } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal(props: ModalProps) {
  return (
    <AntdModal
      centered
      maskClosable={false}
      {...props}
      footer={props.footer}
      modalRender={modal => (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {modal}
          </motion.div>
        </AnimatePresence>
      )}
    >
      {props.children}
    </AntdModal>
  );
} 