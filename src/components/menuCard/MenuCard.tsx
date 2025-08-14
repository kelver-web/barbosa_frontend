// src/components/menu/MenuCard.tsx

import React from "react";

type MenuCardProps = {
  nome: string;
  preco: number | string;
  categoria: string;
};

const MenuCard: React.FC<MenuCardProps> = ({ nome, preco, categoria }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {nome}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {categoria}
        </span>
      </div>
      <div className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
        R$ {Number(preco).toFixed(2)}
      </div>
    </div>
  );
};

export default MenuCard;
