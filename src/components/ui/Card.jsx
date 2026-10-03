import React from 'react';
import BCard from 'react-bootstrap/Card';

/**
 * Reusable Card Component (Thin wrapper around react-bootstrap/Card)
 * Preserves exact props API: variant, padding, header, footer, interactive.
 */
export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  header,
  footer,
  className = '',
  onClick,
  ...rest
}) {
  const isInteractive = variant === 'interactive' || !!onClick;

  // Bootstrap padding mapping
  const paddingClass = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-4 p-md-5',
  }[padding] || 'p-4';

  // Variant classes
  let variantClass = 'shadow-sm border';
  if (variant === 'elevated') {
    variantClass = 'shadow border-0';
  } else if (variant === 'outlined') {
    variantClass = 'border shadow-none';
  } else if (variant === 'tinted') {
    variantClass = 'bg-primary-subtle border-0';
  }

  const rootClasses = [
    variantClass,
    isInteractive ? 'cursor-pointer ui-card-interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <BCard
      className={rootClasses}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive && onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      {...rest}
    >
      {header && <BCard.Header className="bg-transparent border-bottom fw-bold">{header}</BCard.Header>}
      <BCard.Body className={paddingClass}>{children}</BCard.Body>
      {footer && <BCard.Footer className="bg-transparent border-top">{footer}</BCard.Footer>}
    </BCard>
  );
}

// Subcomponents attached for compatibility
Card.Header = BCard.Header;
Card.Body = BCard.Body;
Card.Footer = BCard.Footer;
Card.Title = BCard.Title;
Card.Text = BCard.Text;
