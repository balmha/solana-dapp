import { FC } from 'react';

interface Props {
  children: React.ReactNode;
}

export const ContentContainer: FC<Props> = ({ children }) => {
  return (
    <div className="flex-1 ml-0 md:ml-48 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="p-4 2xl:mr-96">
        {children}
      </div>
    </div>
  );
};