// src/context/GarcomContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from "react";
import api from "../services/api";

interface PedidoPronto {
  mesa: ReactNode;
  id: number;
  nome_cliente: string;
}

interface GarcomContextType {
  pedidosProntos: PedidoPronto[];
  marcarComoEntregue: (pedidoId: number) => Promise<void>;
}

const GarcomContext = createContext<GarcomContextType | undefined>(undefined);

export const GarcomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pedidosProntos, setPedidosProntos] = useState<PedidoPronto[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchPedidosProntos = useCallback(async () => {
    try {
      const response = await api.get("/pedidos/", { params: { status: "pronto" } });
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setPedidosProntos(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos prontos para o contexto:", error);
      setPedidosProntos([]);
    }
  }, []);

  const marcarComoEntregue = useCallback(async (pedidoId: number) => {
    try {
      // Atualização otimista: Remove o pedido da lista imediatamente
      setPedidosProntos(currentPedidos => currentPedidos.filter(pedido => pedido.id !== pedidoId));

      await api.patch(`/pedidos/${pedidoId}/`, { status: "entregue" });
      console.log(`Pedido ${pedidoId} marcado como entregue.`);
    } catch (error) {
      console.error(`Erro ao marcar pedido ${pedidoId} como entregue:`, error);
    }
  }, []);

  useEffect(() => {
    fetchPedidosProntos();

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = "127.0.0.1:8000";
    const url = `${protocol}://${host}/ws/pedidos/`;

    console.log("Conectando WebSocket do GarcomProvider em:", url);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = () => {
        // 💡 SOLUÇÃO: Sempre que uma mensagem WebSocket for recebida,
        // re-buscamos a lista de pedidos para garantir que ela está atualizada.
        console.log("Mensagem WebSocket recebida. Atualizando lista de pedidos...");
        fetchPedidosProntos();
    };
    ws.onclose = () => console.log("WebSocket do GarcomProvider fechado.");
    ws.onerror = (err) => console.error("Erro no WebSocket do GarcomProvider:", err);

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [fetchPedidosProntos]);

  return (
    <GarcomContext.Provider value={{ pedidosProntos, marcarComoEntregue }}>
      {children}
    </GarcomContext.Provider>
  );
};

export const useGarcom = () => {
  const context = useContext(GarcomContext);
  if (context === undefined) {
    throw new Error("useGarcom must be used within a GarcomProvider");
  }
  return context;
};
