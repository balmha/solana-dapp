import { FC } from 'react';

interface Props {
  children: React.ReactNode;
}

export const ContentContainer: FC<Props> = ({ children }) => {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 min-h-[calc(100vh-4rem-120px)]">
      {children}
    </main>
  );
};