// src/pages/KitchenPage.tsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useKitchen } from "../../context/KitchenContext";
import { TbToolsKitchenOff } from "react-icons/tb";

interface Produto {
  nome: string;
}

interface ItemPedido {
  id: number;
  quantidade: number;
  produto: Produto;
  adicionado_em: string; // 💡 Propriedade correta
}

interface Pedido {
  id: number;
  nome_cliente: string;
  mesa: number;
  status: string;
  itens_pedido: ItemPedido[];
}

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  preparando: "Preparando",
  pronto: "Pronto",
  entregue: "Entregue",
};

const KitchenPage: React.FC = () => {
  const { pedidosCozinha } = useKitchen();
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosCozinha || []);

  useEffect(() => {
    setPedidos(pedidosCozinha || []);
  }, [pedidosCozinha]);

  const avancarStatus = async (pedido: Pedido) => {
    const proximo = {
      pendente: "preparando",
      preparando: "pronto",
      pronto: "entregue",
    }[pedido.status] || "entregue";

    try {
      await api.patch(`/pedidos/${pedido.id}/`, { status: proximo });
    } catch (err) {
      console.error("Erro ao avançar status:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex align-items-flex-start gap-2">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white"> Pedidos na Cozinha</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pedidos.length > 0 ? pedidos.map((pedido) => {
          let bgColor = "bg-yellow-200";
          if (pedido.status === "preparando") bgColor = "bg-blue-200";
          if (pedido.status === "pronto") bgColor = "bg-green-200";

          return (
            <div key={pedido.id} className={`${bgColor} p-4 rounded-2xl shadow-lg`}>
              <h2 className="text-xl font-bold">Pedido #{pedido.id} - {pedido.nome_cliente} | Mesa #{pedido.mesa}</h2>
              <p>Status: <span className="font-semibold">{statusLabels[pedido.status]}</span></p>
              <ul className="mb-4">
                {pedido.itens_pedido.map((item) => {
                  // 💡 Adiciona a lógica para verificar se o item é novo
                  const isNew = (new Date().getTime() - new Date(item.adicionado_em).getTime()) / 1000 < 30;

                  return (
                    <li
                      key={item.id}
                      className={isNew ? "text-green-700 font-bold" : ""} // 💡 Usa a classe 'text-green-700'
                    >
                      {item.quantidade}x {item.produto.nome}
                      {isNew && <span className="text-sm font-normal text-green-500"> (novo)</span>}
                    </li>
                  );
                })}
              </ul>
              {pedido.status !== "entregue" && (
                <button onClick={() => avancarStatus(pedido)} className="bg-black text-white px-4 py-1 rounded-lg">
                  Próximo status
                </button>
              )}
            </div>
          );
        }) : <p className="text-gray-100">Nenhum pedido novo.</p>}
      </div>
    </div>
  );
};

export default KitchenPage;