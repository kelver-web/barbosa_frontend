import React from "react";

// Associe manualmente os caminhos das imagens aos IDs dos produtos
const imagensProdutos: Record<number, string> = {
    1: "/images/hamburgueria/coca_cola_lata.png",
    2: "/images/hamburgueria/fanta.png",
    3: "/images/hamburgueria/pepsi.png",
    4: "/images/hamburgueria/sprite.png",
    5: "/images/hamburgueria/guarana.png",
    6: "/images/hamburgueria/pitu.png",
    7: "/images/hamburgueria/pitu_limao.png",
    8: "/images/hamburgueria/carangueijo.png",
    9: "/images/hamburgueria/ypioca.png",
    10: "/images/hamburgueria/matuta.png",
    11: "/images/hamburgueria/samanay.png",
    12: "/images/hamburgueria/caminha_da_vovo.png",
    13: "/images/hamburgueria/ipueira.png",
    14: "/images/hamburgueria/cobiçada.png",
    15: "/images/hamburgueria/dreher.png",
    16: "/images/hamburgueria/pitu_dose.png",
    17: "/images/hamburgueria/matuta_dose.png",
    18: "/images/hamburgueria/blackwiast.png",
    19: "/images/hamburgueria/ypioca_dose.png",
    20: "/images/hamburgueria/carangueijo_dose.png",
    21: "/images/hamburgueria/vodka_dose.png",
    22: "/images/hamburgueria/ice_cabare.png",
    23: "/images/hamburgueria/ice_leev_imperio.png",
    24: "/images/hamburgueria/budweiser.png",
    25: "/images/hamburgueria/corona.png",
    26: "/images/hamburgueria/heineken.png",
    27: "/images/hamburgueria/imperio_long_neck.png",
    28: "/images/hamburgueria/agua.png",
    29: "/images/hamburgueria/agua_gas.png",
    30: "/images/hamburgueria/h2oh.png",
    31: "/images/hamburgueria/infinity.png",
    32: "/images/hamburgueria/suco_copo.png",
    33: "/images/hamburgueria/sucos_jarra.png",
    34: "/images/hamburgueria/bauru.png",
    35: "/images/hamburgueria/x_bacon.png",
    36: "/images/hamburgueria/x_frango.png",
    37: "/images/hamburgueria/x_carne_de_sol.png",
    38: "/images/hamburgueria/x_tudo.png",
    39: "/images/hamburgueria/moda_da_casa.png",
    40: "/images/hamburgueria/misto.png",
    

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
