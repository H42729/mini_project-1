// What this file does: Reusable form input and textarea component wrapping React-Bootstrap Form controls with error states and icons.

import React, { forwardRef, useId } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable Input Component (Thin wrapper around react-bootstrap/Form and InputGroup)
 * Preserves exact props API: label, error, helperText, startIcon, endIcon, fullWidth.
 */
const Input = forwardRef(function Input(
  {
    id,
    label,
    error,
    helperText,
    icon,
    leftIcon,
    startIcon,
    rightIcon,
    endIcon,
    onRightIconClick,
    required = false,
    className = '',
    inputClassName = '',
    type = 'text',
    disabled = false,
    fullWidth = false,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const effectiveLeftIcon = startIcon || leftIcon || icon;
  const effectiveRightIcon = endIcon || rightIcon;

  return (
    <Form.Group className={`mb-3 ${fullWidth ? 'w-100' : ''} ${className}`} controlId={inputId}>
      {label && (
        <Form.Label className="fw-semibold small mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      <InputGroup hasValidation={!!error}>
        {effectiveLeftIcon && (
          <InputGroup.Text className="bg-transparent text-muted border-end-0">
            {effectiveLeftIcon}
          </InputGroup.Text>
        )}

        <Form.Control
          ref={ref}
          type={type}
          isInvalid={!!error}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`${effectiveLeftIcon ? 'border-start-0' : ''} ${effectiveRightIcon ? 'border-end-0' : ''} ${inputClassName}`}
          {...rest}
        />

        {effectiveRightIcon && (
          onRightIconClick ? (
            <button
              type="button"
              className="btn btn-outline-secondary border-start-0 bg-transparent"
              onClick={onRightIconClick}
              aria-label="Toggle input action"
            >
              {effectiveRightIcon}
            </button>
          ) : (
            <InputGroup.Text className="bg-transparent text-muted border-start-0">
              {effectiveRightIcon}
            </InputGroup.Text>
          )
        )}

        {error && (
          <Form.Control.Feedback type="invalid" className="d-flex align-items-center gap-1 mt-1 small">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </Form.Control.Feedback>
        )}
      </InputGroup>

      {!error && helperText && (
        <Form.Text id={helperId} className="text-muted small">
          {helperText}
        </Form.Text>
      )}
    </Form.Group>
  );
});

export default Input;
