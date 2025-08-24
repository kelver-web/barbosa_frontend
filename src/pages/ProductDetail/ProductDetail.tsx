import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import ProdutoImagem from "../../components/ProdutoImagem/ProdutoImagem";
import { FaMinus } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

import { toast } from "react-toastify";

interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  imagem?: string;
}

interface ProductDetailProps {
  product: Product;
}


// ... (importações iguais)

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [observacoes, setObservacoes] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const incrementar = () => setQuantidade((q) => q + 1);
  const decrementar = () => setQuantidade((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      nome: product.nome,
      preco: product.preco,
      quantidade,
      observacoes: observacoes.trim(),
    });
    toast.success("Produto adicionado ao carrinho de pedidos!");
    navigate("/cardapio");
  };

  const backToMenu = () => navigate("/cardapio");

  const total = quantidade * product.preco;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-8">
      <div className="flex flex-col md:flex-row gap-6">

        <div className="">
          <div className="flex items-center justify-center mb-4 gap-4">
            
            <span>

              <ProdutoImagem
                id={product.id}
                alt={product.nome}
                className="w-50 md:h-auto rounded-lg object-cover shadow"
              />
            </span>
            

          </div>

          <button
            onClick={backToMenu}
            className="mt-6 w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <FaArrowLeft className="inline mr-2" />
            Voltar ao Cardápio
          </button>
        </div>

        {/* Detalhes */}
        <div className="flex flex-col justify-between flex-grow space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {product.nome}
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">
              R$ {product.preco.toFixed(2)}
            </p>
            {product.descricao && (
              <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {product.descricao}
              </p>
            )}
          </div>

          {/* Quantidade e Total */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Quantidade:
              </span>
              <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                <button
                  onClick={decrementar}
                  className="px-3 py-1 text-red-600 hover:bg-gray-300 dark:hover:bg-gray-600 text-xl"
                >
                  <FaMinus />
                </button>
                <span className="px-4 py-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {quantidade}
                </span>
                <button
                  onClick={incrementar}
                  className="px-3 py-1 text-green-600 hover:bg-gray-300 dark:hover:bg-gray-600 text-xl"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              Total: R$ {total.toFixed(2)}
            </div>
          </div>

          {/* Observações */}
          <div className="mt-4">
            <label
              htmlFor="observacoes"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-1"
            >
              Observações
            </label>
            <textarea
              id="observacoes"
              rows={3}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: sem cebola, bem passada..."
            />
          </div>

          {/* Botão Adicionar */}
          <button
            onClick={handleAddToCart}
            className="mt-6 w-full md:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition-colors"
          >
            <FaPlus className="inline mr-2" />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

