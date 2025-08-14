import React, { useEffect, useState } from "react";
import CategoriesGrid from "../../components/menu/CategoriesGrid";
import ProductsGrid from "../../components/product/ProductsGrid";
import { useSearch } from "../../context/SearchProvider";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

import api from "../../services/api";

type Produto = {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  disponivel?: boolean;
  categoria: number;
  categoria_nome?: string;
};

type Categoria = {
  id: number;
  nome: string;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const Cardapio: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);

  const { searchTerm } = useSearch();

  useEffect(() => {
    api
      .get<PaginatedResponse<Categoria>>("/categorias/")
      .then((res) => setCategorias(res.data.results))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  useEffect(() => {
    const params: any = {
      page: paginaAtual,
    };
    if (searchTerm) params.search = searchTerm.trim();
    if (categoriaSelecionada) params.categoria = categoriaSelecionada;

    api
      .get<PaginatedResponse<Produto>>("/produtos/", { params })
      .then((res) => {
        setProdutos(res.data.results);
        setTotalPaginas(Math.ceil(res.data.count / 8));
      })
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, [searchTerm, categoriaSelecionada, paginaAtual]);

  const handleCategoriaClick = (id: number) => {
    setCategoriaSelecionada((prev) => (prev === id ? null : id));
    setPaginaAtual(1); // Reset para a primeira página ao mudar categoria
  };

  const handlePaginaAnterior = () => {
    setPaginaAtual((prev) => Math.max(prev - 1, 1));
  };

  const handlePaginaProxima = () => {
    setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Cardápio
      </h1>

      <CategoriesGrid
        categorias={categorias}
        categoriaSelecionada={categoriaSelecionada}
        onCategoriaClick={handleCategoriaClick}
      />

      <ProductsGrid
        products={produtos.map((produto) => ({
          ...produto,
          categoria: {
            id: produto.categoria,
            nome: produto.categoria_nome || "",
          },
        }))}
      />

      <div className="flex justify-start mt-6">
        <nav className="inline-flex items-center gap-1 rounded-md shadow-sm">
          <button
            onClick={() => setPaginaAtual(1)}
            disabled={paginaAtual === 1}
            className="px-3 py-2 rounded-l-md bg-gray-200 text-green-600 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <MdOutlineDoubleArrow  className="rotate-180"/>
          </button>
          <button
            onClick={handlePaginaAnterior}
            disabled={paginaAtual === 1}
            className="px-3 py-2 bg-gray-200 text-green-600 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <MdKeyboardArrowRight className="rotate-180"/>
          </button>

          <span className="px-4 py-1.5 bg-green-600 text-white rounded text-sm font-semibold dark:bg-green-600">
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={handlePaginaProxima}
            disabled={paginaAtual === totalPaginas}
            className="px-3 py-2 text-green-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <MdKeyboardArrowRight />
          </button>
          <button
            onClick={() => setPaginaAtual(totalPaginas)}
            disabled={paginaAtual === totalPaginas}
            className="px-3 py-2 rounded-r-md text-green-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <MdOutlineDoubleArrow />
          </button>
        </nav>
      </div>

    </div>
  );
};

export default Cardapio;
