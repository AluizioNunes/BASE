import { Button, type ButtonProps } from 'antd';
import { motion } from 'framer-motion';

export default function IconButton(props: ButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }} style={{ display: 'inline-block' }}>
      <Button shape="circle" {...props} />
    </motion.div>
  );
} 