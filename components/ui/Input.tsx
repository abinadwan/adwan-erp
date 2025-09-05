import clsx from 'classnames';
import { InputHTMLAttributes } from 'react';

export default function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx('border p-2 rounded w-full', className)}
      {...props}
    />
  );
}
