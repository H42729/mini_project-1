// What this file does: Reusable form input component with seamless integrated prefix/suffix icons, focus states, and validation feedback.

import React, { forwardRef, useId, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { AlertCircle } from 'lucide-react';
import './Input.css';

/**
 * Reusable Input Component
 * Features a seamless single-box container for inputs with prefix icons and suffix action buttons (e.g. password eye toggle),
 * preventing mismatched borders, vertical divider lines, or background clipping.
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
    onFocus,
    onBlur,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const [isFocused, setIsFocused] = useState(false);

  const effectiveLeftIcon = startIcon || leftIcon || icon;
  const effectiveRightIcon = endIcon || rightIcon;

  return (
    <Form.Group className={`app-input-group mb-3 ${fullWidth ? 'w-100' : ''} ${className}`} controlId={inputId}>
      {label && (
        <Form.Label className="app-input-label fw-semibold small mb-1.5 d-flex align-items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-danger fw-bold">*</span>}
        </Form.Label>
      )}

      <div
        className={`app-input-wrapper ${isFocused ? 'is-focused' : ''} ${error ? 'is-invalid' : ''} ${disabled ? 'is-disabled' : ''}`}
      >
        {effectiveLeftIcon && (
          <span className="app-input-icon app-input-icon-left" aria-hidden="true">
            {effectiveLeftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          className={`app-input-control ${inputClassName}`}
          {...rest}
        />

        {effectiveRightIcon && (
          onRightIconClick ? (
            <button
              type="button"
              className="app-input-icon-btn"
              onClick={onRightIconClick}
              tabIndex={-1}
              aria-label="Toggle input action"
            >
              {effectiveRightIcon}
            </button>
          ) : (
            <span className="app-input-icon app-input-icon-right" aria-hidden="true">
              {effectiveRightIcon}
            </span>
          )
        )}
      </div>

      {error && (
        <div id={errorId} className="app-input-error-msg d-flex align-items-center gap-1 mt-1.5 small text-danger">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!error && helperText && (
        <Form.Text id={helperId} className="text-muted small mt-1">
          {helperText}
        </Form.Text>
      )}
    </Form.Group>
  );
});

export default Input;
