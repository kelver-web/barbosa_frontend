import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api"; // ajuste o caminho se necessário
import ProductDetail from "./ProductDetail"; // ajuste o caminho conforme sua estrutura

interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  imagem?: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams(); // useParams sem tipagem direta
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/produtos/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        setErro(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (
    productId: number,
    quantidade: number,
    observacoes: string
  ) => {
    // Aqui você pode integrar com o carrinho ou contexto
    console.log("Adicionar ao carrinho:", {
      productId,
      quantidade,
      observacoes,
    });
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
        Carregando produto...
      </div>
    );
  }

  if (erro || !product) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 mt-10">
        Produto não encontrado.
      </div>
    );
  }

  return <ProductDetail product={product} onAddToCart={handleAddToCart} />;
};

export default ProductDetailPage;
