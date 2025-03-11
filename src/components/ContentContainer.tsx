import { FC } from 'react';
import Link from "next/link";
import Text from './Text';
import NavElement from './nav-element';

interface Props {
  children: React.ReactNode;
}

export const ContentContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex-1 drawer h-52 flex-col justify-between">
      <input id="my-drawer" type="checkbox" className="grow drawer-toggle" />
      {/* Main Content */}
      <div className="items-center drawer-content flex flex-col justify-between ml-0 md:ml-48">
        {children}
      </div>
    </div>
  );
};