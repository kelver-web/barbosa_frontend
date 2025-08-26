import React from "react";
import { useKitchen } from "../../context/KitchenContext";
import api from "../../services/api";

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  preparando: "Preparando",
  pronto: "Pronto",
  entregue: "Entregue",
};

const KitchenPage: React.FC = () => {
  const { pedidosCozinha, atualizarPedido } = useKitchen();

  const avancarStatus = async (pedido: {
    id: any; status: 'pendente' | 'preparando' | 'pronto'
  }) => {
    const proximo = {
      pendente: "preparando",
      preparando: "pronto",
      pronto: "pronto",
    }[pedido.status] || "pronto";

    try {
      const res = await api.patch(`/pedidos/${pedido.id}/`, { status: proximo });
      atualizarPedido(res.data);
    } catch (err) {
      console.error("Erro ao avançar status:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex align-items-flex-start gap-2">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Pedidos na Cozinha
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(pedidosCozinha) && pedidosCozinha.length > 0 ? (
          pedidosCozinha.map((pedido) => {
            let bgColor = "bg-yellow-200";
            if (pedido.status === "preparando") bgColor = "bg-blue-200";

            return (
              <div key={pedido.id} className={`${bgColor} p-4 rounded-2xl shadow-lg`}>
                <h2 className="text-xl font-bold">
                  Pedido #{pedido.id} - {pedido.nome_cliente || "Cliente não informado"} | Mesa #{pedido.mesa}
                </h2>
                <p>
                  Status: <span className="font-semibold">{statusLabels[pedido.status]}</span>
                </p>
                <ul className="mb-4">
                  {pedido.itens_pedido?.map((item: any) => {
                    const isNew = (new Date().getTime() - new Date(item.adicionado_em).getTime()) / 1000 < 30;
                    return (
                      <li
                        key={item.id}
                        className={isNew ? "text-green-700 font-bold" : ""}
                      >
                        {item.quantidade}x {item.produto.nome}
                        {item.observacoes && (
                          <span className="ml-2 text-sm font-normal text-gray-700">
                            Obs: ({item.observacoes})
                          </span>
                        )}
                        {isNew && (
                          <span className="text-sm font-normal text-green-500"> (novo)</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {pedido.status !== "pronto" && (
                  <button
                    onClick={() => {
                      if (pedido.status === "pendente" || pedido.status === "preparando") {
                        avancarStatus({ id: pedido.id, status: pedido.status });
                      }
                    }}
                    className="bg-black text-white px-4 py-1 rounded-lg"
                  >
                    Próximo status
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-800 dark:text-white">Nenhum pedido novo.</p>
        )}
      </div>
    </div>
  );
};

export default KitchenPage;
