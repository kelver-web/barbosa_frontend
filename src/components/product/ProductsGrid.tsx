import React from "react";
// Assumindo que seu componente de item individual se chama ProductCard
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";


// Definição da interface Product, conforme combinamos
interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  disponivel?: boolean;
  categoria?: {
    id: number;
    nome: string;
  };
  imagem?: string; // Mantenha se você usa URLs de imagem para produtos
}

interface ProductsGridProps {
  products: Product[];
}


const ProductsGrid: React.FC<ProductsGridProps> = ({ products }) => {

  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
        Nenhum produto encontrado para esta categoria.
      </p>
    );
  }


  const handleProductDetail = (productId: number) => {
    navigate(`/produto/${productId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => handleProductDetail(product.id)}
          className="block h-full flex flex-col justify-between"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ProductCard product={product} />
        </button>
      ))}
    </div>
  );
};

export default ProductsGrid;
