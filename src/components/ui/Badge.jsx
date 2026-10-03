import React from 'react';
import BBadge from 'react-bootstrap/Badge';

/**
 * Reusable Badge Component (Thin wrapper around react-bootstrap/Badge)
 * Preserves exact props API: variant, grade, status, size, dot, icon.
 */
export default function Badge({
  children,
  variant = 'neutral',
  grade,
  status,
  size = 'md',
  dot = false,
  icon,
  className = '',
  ...rest
}) {
  // Normalize variant from grade or status
  let resolvedVariant = variant;
  if (grade) {
    const cleanGrade = grade.toLowerCase().replace(/\s+/g, '-');
    resolvedVariant = cleanGrade.startsWith('grade') ? cleanGrade : `grade-${cleanGrade}`;
  } else if (status) {
    resolvedVariant = status.toLowerCase().replace(/\s+/g, '-');
  }

  // Map to Bootstrap badge background or custom utility classes
  let bg = 'secondary';
  let customClass = '';

  switch (resolvedVariant) {
    case 'success':
    case 'delivered':
    case 'grade-a':
    case 'grade-a+':
      bg = 'success';
      break;
    case 'warning':
    case 'in-transit':
    case 'preparing':
      bg = 'warning';
      customClass = 'text-dark';
      break;
    case 'danger':
    case 'error':
    case 'cancelled':
      bg = 'danger';
      break;
    case 'info':
      bg = 'info';
      customClass = 'text-dark';
      break;
    case 'gold':
      bg = 'warning';
      customClass = 'bg-amber text-dark';
      break;
    case 'grade-b':
      bg = 'primary';
      customClass = 'bg-opacity-75';
      break;
    case 'grade-c':
      bg = 'secondary';
      break;
    default:
      bg = 'secondary';
      customClass = 'bg-opacity-75';
      break;
  }

  // Size styling
  const sizeClass = {
    sm: 'fs-8 py-1 px-2',
    md: 'py-1 px-2.5',
    lg: 'fs-6 py-1.5 px-3',
  }[size] || 'py-1 px-2.5';

  const classes = [
    'rounded-pill d-inline-flex align-items-center gap-1 fw-semibold text-nowrap',
    sizeClass,
    customClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <BBadge bg={bg} className={classes} {...rest}>
      {dot && (
        <span
          className="rounded-circle d-inline-block bg-current"
          style={{ width: 6, height: 6, opacity: 0.8 }}
          aria-hidden="true"
        />
      )}
      {icon && <span className="d-inline-flex align-items-center">{icon}</span>}
      <span>{children || grade || status}</span>
    </BBadge>
  );
}
