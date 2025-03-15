import { FC } from 'react';
import TokenCreator from 'components/TokenCreator';

export const CreatorView: FC = () => {
  return (
    <div className="md:hero my-10 md:my-0 2xl:mx-20 mx-auto p-4 md:p-8 lg:p-16 flex flex-col justify-center items-center">
      <div className="md:hero-content flex flex-col text-center w-full max-w-4xl">
        <TokenCreator />
      </div>
    </div>
  );
};