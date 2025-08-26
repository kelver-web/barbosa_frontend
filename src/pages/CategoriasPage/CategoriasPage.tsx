import { useEffect, useState } from "react";
import api from "../../services/api";
import CategoryCard from "../../components/menu/CategoryCard";


type Produto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: number;
};

type Categoria = {
  id: number;
  nome: string;
  produtos?: Produto[];
};

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get<Categoria[]>("/categorias/");
        setCategorias(res.data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    fetchCategorias();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
      {categorias.map((cat) => (
        <CategoryCard
          key={cat.id}
          name={cat.nome}
          totalProdutos={cat.produtos ? cat.produtos.length : 0}
        />
      ))}
    </div>
  );
}