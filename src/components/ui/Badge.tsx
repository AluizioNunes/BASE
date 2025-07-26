import { Badge as AntdBadge, type BadgeProps } from 'antd';
import { motion } from 'framer-motion';

export default function Badge(props: BadgeProps) {
  return (
    <motion.div whileHover={{ scale: 1.1, rotate: 2 }} style={{ display: 'inline-block' }}>
      <AntdBadge {...props} />
    </motion.div>
  );
} 