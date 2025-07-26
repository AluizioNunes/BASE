import React from 'react';
import { Button, ButtonProps } from 'antd';
import { motion } from 'framer-motion';

export default function PrimaryButton(props: ButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
      <Button type="primary" {...props} />
    </motion.div>
  );
} 