import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

interface Produto {
  nome: string;
}

interface ItemPedido {
  id: number;
  quantidade: number;
  produto: Produto;
  adicionado_em: string;
  is_extra?: boolean;
}

interface Pedido {
  id: number;
  nome_cliente: string;
  mesa: number;
  status: string;
  itens_pedido: ItemPedido[];
}

interface KitchenContextType {
  pedidosCozinha: Pedido[];
  atualizarPedido: (pedido: Pedido) => void;
}

const KitchenContext = createContext<KitchenContextType>({
  pedidosCozinha: [],
  atualizarPedido: () => {},
});

export const useKitchen = () => useContext(KitchenContext);

export const KitchenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pedidosCozinha, setPedidosCozinha] = useState<Pedido[]>([]);

  const atualizarPedido = (pedido: Pedido) => {
    setPedidosCozinha((prev) => {
      if (
        pedido.status === "pronto" ||
        pedido.status === "entregue" ||
        pedido.status === "pago"
      ) {
        return prev.filter((p) => p.id !== pedido.id);
      }

      const idx = prev.findIndex((p) => p.id === pedido.id);
      if (idx !== -1) {
        const newArr = [...prev];
        newArr[idx] = { ...newArr[idx], ...pedido };
        return newArr;
      } else {
        return [pedido, ...prev];
      }
    });
  };

  const fetchPedidos = async () => {
    try {
      const res = await api.get("/pedidos/?status__in=pendente,preparando");
      const pedidos = res.data.results || res.data;
      setPedidosCozinha(pedidos);
    } catch (err) {
      console.error("Erro ao buscar pedidos da cozinha:", err);
    }
  };

  useEffect(() => {
    fetchPedidos();

    const ws = new WebSocket("ws://127.0.0.1:8000/ws/pedidos/");

    ws.onopen = () => console.log("Conectado ao WebSocket da cozinha");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.itens_pedido) {
        atualizarPedido(data);
      }
    };

    ws.onclose = () => console.log("WebSocket da cozinha fechado");

    return () => {
      ws.close();
    };
  }, []);

  return (
    <KitchenContext.Provider value={{ pedidosCozinha, atualizarPedido }}>
      {children}
    </KitchenContext.Provider>
  );
};