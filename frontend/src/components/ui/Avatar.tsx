import React from 'react';
import { cn, generateAvatarFallback } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  className?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = '', size = 'md', status, className }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
    };

    const statusColors = {
      online: 'bg-green-500',
      idle: 'bg-yellow-500',
      dnd: 'bg-red-500',
      offline: 'bg-gray-500',
    };

    const statusSizes = {
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    };

    return (
      <div className="relative inline-block" ref={ref}>
        <div
          className={cn(
            'relative rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden',
            sizes[size],
            className
          )}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to text avatar on image error
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = generateAvatarFallback(alt);
                }
              }}
            />
          ) : (
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {generateAvatarFallback(alt)}
            </span>
          )}
        </div>
        {status && (
          <div
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800',
              statusColors[status],
              statusSizes[size]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };