import React from "react";

// Associe manualmente os caminhos das imagens aos IDs dos produtos
const imagensProdutos: Record<number, string> = {
    1: "/images/hamburgueria/coca_cola_lata.png",
   
    // ... adicione mais conforme necessário
};

interface ProdutoComImagemProps {
    id: number;
    alt?: string;
    className?: string;
    fallback?: string;
}

const ProdutoImagem: React.FC<ProdutoComImagemProps> = ({ id, alt = "Produto", className = "", fallback = "/images/default-product.png" }) => {
    const src = imagensProdutos[id] || fallback;

    return <img src={src} alt={alt} className={className} />;
};

export default ProdutoImagem;
export { imagensProdutos };
