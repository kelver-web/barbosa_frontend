import React from "react";

// Associe manualmente os caminhos das imagens aos IDs dos produtos
const imagensProdutos: Record<number, string> = {
    1: "/images/hamburgueria/petibarbosa.png",
    2: "/images/produtos/2.jpg",
    3: "/images/produtos/3.jpg",
    79: "../images/hamburgueria/petiscoCervejas.jpeg",
    80: "../images/hamburgueria/petiscoCalabresa.jpeg",
    81: "../images/hamburgueria/caldosNoCopo.jpeg",
    82: "../images/hamburgueria/caldosNoCopo.jpeg",
    83: "../images/hamburgueria/caldosNoCopo.jpeg",
    84: "../images/hamburgueria/caldosNoCopo.jpeg",
    5: "../images/hamburgueria/caldoMocoto.jpeg",
    85: "../images/hamburgueria/caldoCamarao.jpeg",
    86: "../images/hamburgueria/caldoChambaril.jpeg",
    87: "../images/hamburgueria/caldoSertanejo.jpeg",
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
