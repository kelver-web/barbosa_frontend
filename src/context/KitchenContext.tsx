// src/context/KitchenContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

interface Pedido {
  id: number;
  nome_cliente: string;
  criado_em: string;
  status: string;
  itens: any[];
}

interface KitchenContextType {
  pedidosCozinha: Pedido[];
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined);

export const KitchenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pedidosCozinha, setPedidosCozinha] = useState<Pedido[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchPedidosAtivos = useCallback(async () => {
    try {
      const response = await api.get("/pedidos/");
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      const ativos = data.filter((pedido: Pedido) =>
        ["pendente", "preparando"].includes(pedido.status)
      );
      setPedidosCozinha(ativos);
    } catch (error) {
      console.error("Erro ao buscar pedidos ativos para o contexto:", error);
      setPedidosCozinha([]);
    }
  }, []);

  useEffect(() => {
    fetchPedidosAtivos();

    // URL CORRIGIDA PARA APONTAR PARA O BACKEND DO DJANGO
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = "127.0.0.1:8000"; // Host do seu servidor Django
    const url = `${protocol}://${host}/ws/pedidos/`;

    console.log("Conectando WebSocket do KitchenProvider em:", url);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket da Cozinha conectado.");
    };

    ws.onmessage = () => {
      console.log("Mensagem recebida no KitchenProvider. Atualizando lista de cozinha...");
      fetchPedidosAtivos();
    };

    ws.onclose = () => console.log("WebSocket do KitchenProvider fechado.");
    ws.onerror = (err) => console.error("Erro no WebSocket do KitchenProvider:", err);

    const pollInterval = setInterval(fetchPedidosAtivos, 5000);

    return () => {
      ws.close();
      clearInterval(pollInterval);
    };
  }, [fetchPedidosAtivos]);

  return (
    <KitchenContext.Provider value={{ pedidosCozinha }}>
      {children}
    </KitchenContext.Provider>
  );
};

export const useKitchen = () => {
  const context = useContext(KitchenContext);
  if (context === undefined) {
    throw new Error("useKitchen must be used within a KitchenProvider");
  }
  return context;
};