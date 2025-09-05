'use client';
import Link from 'next/link';
import LangSwitcher from './LangSwitcher';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <Link href="." className="font-bold">ERP-HR</Link>
      <LangSwitcher />
    </nav>
  );
}
