import React from 'react';

/**
 * Reusable Skeleton Placeholder Component
 * Built using Bootstrap's native placeholder-glow and placeholder utility classes.
 * Preserves exact props API: variant, width, height, count, className, style.
 */
export default function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  style = {},
  ...rest
}) {
  const isCircular = variant === 'circular' || variant === 'avatar';
  const isCard = variant === 'card';

  const defaultHeight = isCard ? (height || 260) : (height || (isCircular ? 48 : 20));
  const defaultWidth = isCircular ? (width || 48) : width;

  const inlineStyles = {
    ...(defaultWidth ? { width: defaultWidth } : {}),
    height: defaultHeight,
    ...style,
  };

  const roundedClass = isCircular ? 'rounded-circle' : 'rounded';

  const itemClass = [
    'placeholder',
    'bg-secondary',
    'bg-opacity-25',
    roundedClass,
    !defaultWidth ? 'w-100' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (count > 1) {
    return (
      <div className="placeholder-glow d-flex flex-column gap-2" aria-busy="true" aria-live="polite">
        {Array.from({ length: count }).map((_, idx) => (
          <span
            key={idx}
            className={itemClass}
            style={inlineStyles}
            aria-hidden="true"
            {...rest}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="placeholder-glow w-100" aria-busy="true" aria-live="polite">
      <span
        className={itemClass}
        style={inlineStyles}
        aria-hidden="true"
        {...rest}
      />
    </div>
  );
}
