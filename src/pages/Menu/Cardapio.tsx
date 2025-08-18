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
  const [loading, setLoading] = useState<boolean>(true); // 💡 NOVO ESTADO DE CARREGAMENTO

  const { searchTerm } = useSearch();

  useEffect(() => {
    api
      .get<PaginatedResponse<Categoria>>("/categorias/")
      .then((res) => setCategorias(res.data.results))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true); // Inicia o carregamento
      const params: any = {
        page: paginaAtual,
      };
      if (searchTerm) params.search = searchTerm.trim();
      if (categoriaSelecionada) params.categoria = categoriaSelecionada;

      try {
        const res = await api.get<PaginatedResponse<Produto>>("/produtos/", { params });
        
        // 💡 VERIFICAÇÃO MELHORADA: lida com respostas paginadas e não paginadas
        const fetchedProducts = res.data.results || res.data;
        const totalCount = res.data.count || fetchedProducts.length;

        setProdutos(fetchedProducts);
        setTotalPaginas(Math.ceil(totalCount / 8));
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setProdutos([]); // Garante que a lista fique vazia em caso de erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };
    fetchProdutos();
  }, [searchTerm, categoriaSelecionada, paginaAtual]);

  const handleCategoriaClick = (id: number) => {
    setCategoriaSelecionada((prev) => (prev === id ? null : id));
    setPaginaAtual(1);
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

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Carregando produtos...</p>
      ) : (
        produtos && produtos.length > 0 ? (
          <ProductsGrid
            products={produtos.map((produto) => ({
              ...produto,
              categoria: {
                id: produto.categoria,
                nome: produto.categoria_nome || "",
              },
            }))}
          />
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Nenhum produto encontrado.</p>
        )
      )}

      {/* A paginação só aparece se houver produtos */}
      {produtos && produtos.length > 0 && (
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
      )}

    </div>
  );
};

export default Cardapio;