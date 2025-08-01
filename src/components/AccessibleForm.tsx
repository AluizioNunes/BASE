import React from 'react';
import { Form, type FormProps, type FormItemProps, Input, type InputProps, Select, type SelectProps } from 'antd';
import { motion } from 'framer-motion';

interface AccessibleFormProps extends FormProps {
  /** Título do formulário para leitores de tela */
  formTitle?: string;
  /** Descrição do formulário */
  formDescription?: string;
  /** Indica se o formulário está em modo de erro */
  hasErrors?: boolean;
}

interface AccessibleFormItemProps extends FormItemProps {
  /** Descrição adicional para o campo */
  fieldDescription?: string;
  /** Indica se o campo é obrigatório */
  required?: boolean;
  /** Texto de ajuda para o campo */
  helpText?: string;
}

interface AccessibleInputProps extends InputProps {
  /** Descrição para leitores de tela */
  ariaDescription?: string;
  /** Indica se o campo é obrigatório */
  required?: boolean;
  /** Texto de ajuda */
  helpText?: string;
}

interface AccessibleSelectProps extends SelectProps {
  /** Descrição para leitores de tela */
  ariaDescription?: string;
  /** Indica se o campo é obrigatório */
  required?: boolean;
  /** Texto de ajuda */
  helpText?: string;
}

// Componente de Formulário Acessível
export const AccessibleForm: React.FC<AccessibleFormProps> = ({
  children,
  formTitle,
  formDescription,
  hasErrors = false,
  className = '',
  ...props
}) => {
  const formId = React.useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Form
        id={formId}
        className={`accessible-form ${hasErrors ? 'has-errors' : ''} ${className}`}
        aria-labelledby={formTitle ? `${formId}-title` : undefined}
        aria-describedby={formDescription ? `${formId}-description` : undefined}
        {...props}
      >
        {formTitle && (
          <h2 id={`${formId}-title`} className="form-title">
            {formTitle}
          </h2>
        )}
        
        {formDescription && (
          <p id={`${formId}-description`} className="form-description">
            {formDescription}
          </p>
        )}
        
        {hasErrors && (
          <div className="form-errors" role="alert" aria-live="assertive">
            <p>Este formulário contém erros. Por favor, corrija-os antes de continuar.</p>
          </div>
        )}
        
        {children as React.ReactNode}
      </Form>
      
      <style>{`
        .accessible-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .form-title {
          margin-bottom: 16px;
          font-size: 24px;
          font-weight: 600;
          color: #262626;
        }
        
        .form-description {
          margin-bottom: 24px;
          color: #595959;
          line-height: 1.5;
        }
        
        .form-errors {
          margin-bottom: 16px;
          padding: 12px;
          background-color: #fff2f0;
          border: 1px solid #ffccc7;
          border-radius: 6px;
          color: #cf1322;
        }
        
        .form-errors p {
          margin: 0;
          font-weight: 500;
        }
        
        .has-errors {
          border: 2px solid #ff4d4f;
          border-radius: 8px;
          padding: 16px;
        }
        
        /* Melhora contraste e legibilidade */
        .accessible-form .ant-form-item-label > label {
          color: #262626;
          font-weight: 500;
        }
        
        .accessible-form .ant-form-item-required::before {
          color: #ff4d4f;
        }
        
        .accessible-form .ant-input,
        .accessible-form .ant-select-selector {
          border-color: #d9d9d9;
          transition: all 0.3s ease;
        }
        
        .accessible-form .ant-input:focus,
        .accessible-form .ant-select-focused .ant-select-selector {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        
        .accessible-form .ant-input:hover,
        .accessible-form .ant-select:hover .ant-select-selector {
          border-color: #40a9ff;
        }
        
        /* Estados de erro */
        .accessible-form .ant-form-item-has-error .ant-input,
        .accessible-form .ant-form-item-has-error .ant-select-selector {
          border-color: #ff4d4f;
        }
        
        .accessible-form .ant-form-item-has-error .ant-input:focus,
        .accessible-form .ant-form-item-has-error .ant-select-focused .ant-select-selector {
          border-color: #ff4d4f;
          box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
        }
      `}</style>
    </motion.div>
  );
};

// Componente de Item de Formulário Acessível
export const AccessibleFormItem: React.FC<AccessibleFormItemProps> = ({
  children,
  fieldDescription,
  required = false,
  helpText,
  className = '',
  ...props
}) => {
  const itemId = React.useId();

  return (
    <Form.Item
      id={itemId}
      className={`accessible-form-item ${className}`}
      required={required}
      {...props}
    >
      {fieldDescription && (
        <div
          id={`${itemId}-description`}
          className="field-description"
          aria-live="polite"
        >
          {fieldDescription}
        </div>
      )}
      
      {children as React.ReactNode}
      
      {helpText && (
        <div className="help-text">
          {helpText}
        </div>
      )}
      
      <style>{`
        .accessible-form-item {
          margin-bottom: 24px;
        }
        
        .field-description {
          margin-bottom: 8px;
          color: #595959;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .help-text {
          margin-top: 4px;
          color: #8c8c8c;
          font-size: 12px;
          line-height: 1.4;
        }
        
        /* Melhora espaçamento e legibilidade */
        .accessible-form-item .ant-form-item-label {
          margin-bottom: 8px;
        }
        
        .accessible-form-item .ant-form-item-explain {
          margin-top: 4px;
          color: #ff4d4f;
          font-size: 14px;
        }
      `}</style>
    </Form.Item>
  );
};

// Componente de Input Acessível
export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  ariaDescription,
  required = false,
  helpText,
  className = '',
  ...props
}) => {
  const inputId = React.useId();

  return (
    <div className={`accessible-input-wrapper ${className}`}>
      <Input
        id={inputId}
        className="accessible-input"
        aria-describedby={ariaDescription ? `${inputId}-description` : undefined}
        aria-required={required}
        {...props}
      />
      
      {ariaDescription && (
        <div
          id={`${inputId}-description`}
          className="sr-only"
          aria-live="polite"
        >
          {ariaDescription}
        </div>
      )}
      
      {helpText && (
        <div className="input-help-text">
          {helpText}
        </div>
      )}
      
      <style>{`
        .accessible-input-wrapper {
          position: relative;
        }
        
        .accessible-input {
          width: 100%;
          padding: 8px 12px;
          font-size: 16px; /* Previne zoom em iOS */
          line-height: 1.5;
        }
        
        .input-help-text {
          margin-top: 4px;
          color: #8c8c8c;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        /* Melhora contraste e foco */
        .accessible-input:focus {
          outline: 2px solid #1890ff;
          outline-offset: 2px;
        }
        
        .accessible-input:hover {
          border-color: #40a9ff;
        }
      `}</style>
    </div>
  );
};

// Componente de Select Acessível
export const AccessibleSelect: React.FC<AccessibleSelectProps> = ({
  ariaDescription,
  required = false,
  helpText,
  className = '',
  ...props
}) => {
  const selectId = React.useId();

  return (
    <div className={`accessible-select-wrapper ${className}`}>
      <Select
        id={selectId}
        className="accessible-select"
        aria-describedby={ariaDescription ? `${selectId}-description` : undefined}
        aria-required={required}
        {...props}
      />
      
      {ariaDescription && (
        <div
          id={`${selectId}-description`}
          className="sr-only"
          aria-live="polite"
        >
          {ariaDescription}
        </div>
      )}
      
      {helpText && (
        <div className="select-help-text">
          {helpText}
        </div>
      )}
      
      <style>{`
        .accessible-select-wrapper {
          position: relative;
        }
        
        .accessible-select {
          width: 100%;
        }
        
        .select-help-text {
          margin-top: 4px;
          color: #8c8c8c;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        /* Melhora contraste e foco */
        .accessible-select .ant-select-selector:focus {
          outline: 2px solid #1890ff;
          outline-offset: 2px;
        }
        
        .accessible-select .ant-select-selector:hover {
          border-color: #40a9ff;
        }
      `}</style>
    </div>
  );
};

export default AccessibleForm; 