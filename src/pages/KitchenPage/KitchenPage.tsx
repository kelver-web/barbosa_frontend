// src/pages/KitchenPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { useKitchen } from "../../context/KitchenContext";

// Interfaces para tipagem dos dados
interface Produto {
  nome: string;
}

interface ItemPedido {
  id: number;
  quantidade: number;
  produto: Produto;
}

interface Pedido {
  id: number;
  nome_cliente: string;
  criado_em?: string;
  status: string;
  itens: ItemPedido[];
}

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  preparando: "Preparando",
  pronto: "Pronto",
  entregue: "Entregue",
};

const KitchenPage: React.FC = () => {
  const { pedidosCozinha } = useKitchen();
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosCozinha);

  useEffect(() => {
    setPedidos(pedidosCozinha || []);
  }, [pedidosCozinha]);

  const avancarStatus = useCallback(async (pedido: Pedido) => {
    const proximo = {
      pendente: "preparando",
      preparando: "pronto",
      pronto: "entregue"
    }[pedido.status] || "entregue";

    try {
      await api.patch(`/pedidos/${pedido.id}/`, { status: proximo });
      console.log("Status atualizado no servidor:", pedido.id, proximo);
    } catch (err) {
      console.error("Erro ao avançar status:", err);
    }
  }, []);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">📦 Pedidos na Cozinha</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800 dark:text-white">
        {pedidos && pedidos.length > 0 ? (
          pedidos.map((pedido) => {
            let bgColor = "bg-yellow-200";
            if (pedido.status === "preparando") bgColor = "bg-blue-200";
            if (pedido.status === "pronto") bgColor = "bg-green-200";

            return (
              <div key={pedido.id} className={`${bgColor} p-4 rounded-2xl shadow-lg`}>
                <h2 className="text-xl font-bold">Pedido #{pedido.id} - {pedido.nome_cliente}</h2>
                <p className="text-sm mb-3">Status: <span className="font-semibold">{statusLabels[pedido.status] || pedido.status}</span></p>
                <ul className="mb-4">
                  {pedido.itens && pedido.itens.length > 0 ? (
                    pedido.itens.map((item, idx) => <li key={idx}>{item.quantidade}x {item.produto?.nome || 'Produto não informado'}</li>)
                  ) : (
                    <li>Sem produtos</li>
                  )}
                </ul>
                {pedido.status !== "entregue" && (
                  <button onClick={() => avancarStatus(pedido)} className="bg-black text-white px-4 py-1 rounded-lg">
                    Próximo status
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p>Nenhum pedido novo.</p>
        )}
      </div>
    </div>
  );
};

export default KitchenPage;