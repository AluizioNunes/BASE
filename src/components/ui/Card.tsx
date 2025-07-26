import { Card as AntdCard, type CardProps } from 'antd';
import { motion } from 'framer-motion';

export default function Card(props: CardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02, boxShadow: '0 4px 16px #e0e0e0' }} style={{ display: 'block' }}>
      <AntdCard bordered={false} style={{ borderRadius: 12, ...props.style }} {...props} />
    </motion.div>
  );
} 