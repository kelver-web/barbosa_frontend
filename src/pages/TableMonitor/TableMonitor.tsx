// src/pages/TableMonitor.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";

// Interface para o Pedido, focando apenas nos dados necessários para o monitor
interface Pedido {
    id: number;
    mesa: string;
    status: "pendente" | "preparando" | "pronto" | "entregue" | "pago";
}

// Mapeamento de status para cor do card da mesa

// Gera um array de 22 mesas
const mesas = Array.from({ length: 22 }, (_, i) => ({
    numero: (i + 1).toString(),
    status: "Livre", // Estado inicial
    pedidoId: null as number | null,
}));

export default function TableMonitor() {
    const [tableStatus, setTableStatus] = useState(mesas);

    const fetchPedidos = async () => {
        try {
            // 💡 Requisição para buscar todos os pedidos, já que a paginação foi desativada no back-end
            const response = await api.get("/pedidos/");
            const pedidos: Pedido[] = response.data.results || response.data;

            const newTableStatus = mesas.map((mesa) => {
                const pedidoDaMesa = pedidos.find(
                    (p) => p.mesa === mesa.numero && p.status !== "pago"
                );

                if (pedidoDaMesa) {
                    return {
                        ...mesa,
                        status: "Ocupada",
                        pedidoId: pedidoDaMesa.id,
                    };
                } else {
                    return {
                        ...mesa,
                        status: "Livre",
                        pedidoId: null,
                    };
                }
            });

            setTableStatus(newTableStatus);
        } catch (err) {
            console.error("Erro ao buscar pedidos para o monitor:", err);
        }
    };

    useEffect(() => {
        fetchPedidos();
        // Atualiza a cada 30 segundos para manter o status em tempo real
        const interval = setInterval(() => {
            fetchPedidos();
        }, 30000); // 30 segundos
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Monitoramento de Mesas</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {tableStatus.map((mesa) => (
                    <div
                        key={mesa.numero}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md transition-colors duration-200
              ${mesa.status === "Livre" ? "bg-green-100" : "bg-red-100"}
            `}
                    >
                        <span className="text-xl font-semibold">Mesa {mesa.numero}</span>
                        <span className={`mt-2 text-sm font-medium ${mesa.status === "Livre" ? "text-green-800" : "text-red-800"}`}>
                            Status: {mesa.status}
                        </span>
                        {mesa.pedidoId && (
                            <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Pedido #{mesa.pedidoId}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
