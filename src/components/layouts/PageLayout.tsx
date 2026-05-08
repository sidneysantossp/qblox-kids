import { ReactNode } from 'react';
import { BrickStoreFooter } from '@/components/brickstore/BrickStoreFooter';

interface PageLayoutProps {
  children: ReactNode;
  includeFooter?: boolean;
}

export function PageLayout({ children, includeFooter = true }: PageLayoutProps) {
  return (
    <>
      {children}
      {includeFooter && <BrickStoreFooter />}
    </>
  );
}
