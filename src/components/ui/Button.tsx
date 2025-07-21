import React, { forwardRef, ReactElement, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader } from "lucide-react";
import { cn } from "../../utils/cn";

interface BaseButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  loading?: boolean;
  icon?: ReactElement;
  children?: ReactNode;
}

export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ loading, icon, children, className, ...props }, ref) => {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.03 }}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-white font-medium transition-colors hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed",
          className
        )}
        disabled={loading || props.disabled}
        ref={ref}
        {...props}
      >
        {loading ? <Loader className="animate-spin" size={18} /> : icon}
        {children}
      </motion.button>
    );
  }
);
BaseButton.displayName = "BaseButton"; 