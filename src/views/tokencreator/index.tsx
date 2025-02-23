
import { FC } from "react";
import { SignMessage } from '../../components/SignMessage';
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import { useState } from 'react';
import TokenCreator from "components/TokenCreator";

export const CreatorView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className="text-center">
          <TokenCreator />
        </div>
      </div>
    </div>
  );
};