// CategoriesGrid.tsx

import React from "react";

interface Category {
  id: number;
  nome: string;
}

interface CategoriesGridProps {
  categorias: Category[];
  categoriaSelecionada: number | null;
  onCategoriaClick: (id: number) => void;
}

const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  categorias,
  categoriaSelecionada,
  onCategoriaClick,
}) => {
  // Criamos a categoria 'Todos' com um ID especial (0)
  const categoriaTodos: Category = { id: 0, nome: "Todos" };

  // Combinamos a categoria 'Todos' com as categorias reais
  const categoriasParaExibir = [categoriaTodos, ...(categorias || [])];

  return (
    // Removidas as classes de fundo (bg-white, dark:bg-white/[0.03]),
    // bordas (border, border-gray-200, dark:border-gray-800) e padding (p-4, md:p-5).
    // A classe rounded-2xl também foi removida, pois não faz sentido sem borda/fundo.
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      {categoriasParaExibir.map((categoria) => (
        <button
          key={categoria.id} // ID 0 será usado para 'Todos'
          className={`p-1 text-center rounded-xl font-semibold shadow transition-colors duration-200 ${
            // A categoria 'Todos' (id: 0) deve ser selecionada se nenhuma outra categoria estiver selecionada (categoriaSelecionada === null)
            (categoria.id === 0 && categoriaSelecionada === null) ||
            // Ou se a categoria atual for a categoria selecionada
            (categoria.id !== 0 && categoriaSelecionada === categoria.id)
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white/90 dark:hover:bg-gray-600"
          }`}
          onClick={() => onCategoriaClick(categoria.id)}
        >
          {categoria.nome}
        </button>
      ))}
    </div>
  );
};

export default CategoriesGrid;