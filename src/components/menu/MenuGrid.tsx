// src/components/menu/MenuGrid.tsx

import React from "react";
import MenuCard from "./MenuCard";

type Produto = {
  id: number;
  nome: string;
  preco: number;
  categoria?: {
    nome: string;
  };
};

type MenuGridProps = {
  produtos: Produto[];
};

const MenuGrid: React.FC<MenuGridProps> = ({ produtos }) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {produtos.map((produto) => (
        <MenuCard
          key={produto.id}
          nome={produto.nome}
          preco={produto.preco}
         
        />
      ))}
    </div>
  );
};

export default MenuGrid;
