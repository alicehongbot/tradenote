'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isNewTradePage = pathname === '/trade/new';

  return (
    <html lang="zh-TW">
      <body className="antialiased bg-slate-950">
        {children}
        {!isNewTradePage && (
          <Link
            href="/trade/new"
            className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-colors z-50"
          >
            <Plus className="text-white" size={28} />
          </Link>
        )}
      </body>
    </html>
  );
}