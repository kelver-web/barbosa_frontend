import React from "react";
import Badge from "../ui/badge/Badge";
import ProdutoImagem from "../ProdutoImagem/ProdutoImagem";

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
  imagem?: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = "" }) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5
                 dark:border-gray-800 dark:bg-white/[0.03] md:p-6
                 flex flex-col justify-between transition-transform duration-200 hover:scale-105 h-full ${className}`}
    >
      {/* Container flex para a imagem e o nome */}
      <div className="flex items-start gap-4 mb-4">
        {/* Bloco da Imagem */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          {product.imagem ? (
            <img
              src={product.imagem}
              alt={product.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-gray-800 text-xl dark:text-white/90">
              <ProdutoImagem 
                id={product.id}  
                alt={product.nome} 
                className="w-full h-full object-cover rounded-xl" 
              />
            </span>
          )}
        </div>
        
        {/* Bloco do Nome do produto */}
        <h4 className="font-semibold text-lg text-gray-800 dark:text-white mt-1">
          {product.nome}
        </h4>
      </div>

      {/* Bloco de Conteúdo do produto (descrição e preço) */}
      <div className="flex flex-col flex-1">
        {product.descricao && (
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {product.descricao}
          </span>
        )}
        <p className="mt-2 text-lg font-bold text-green-600 dark:text-green-400">
          R$ {parseFloat(product.preco.toString()).toFixed(2)}
        </p>
      </div>

      {/* Badge de Disponibilidade */}
      {product.disponivel !== undefined && (
        <div className="mt-4">
          <Badge color={product.disponivel ? "success" : "error"}>
            {product.disponivel ? "Disponível" : "Indisponível"}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ProductCard;