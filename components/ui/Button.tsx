import clsx from 'classnames';
import { ButtonHTMLAttributes } from 'react';

export default function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx('px-4 py-2 bg-blue-600 text-white rounded', className)}
      {...props}
    />
  );
}
