// src/pages/EditPedido.tsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";

interface ItemNovo {
  produto: number;
  quantidade: number;
}

interface Pedido {
  id: number;
  nome_cliente: string;
  status: string;
  itens: any[];
}

interface Props {
  pedidoId: number;
}

const EditarPedido: React.FC<Props> = ({ pedidoId }) => {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [novosItens, setNovosItens] = useState<ItemNovo[]>([]);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await api.get(`/pedidos/${pedidoId}/`);
        setPedido(response.data);
      } catch (err) {
        console.error("Erro ao buscar pedido:", err);
      }
    };
    fetchPedido();
  }, [pedidoId]);

  const adicionarItensPedido = async () => {
    try {
      if (!pedido) return;
      const response = await api.patch(`/pedidos/${pedido.id}/adicionar_itens/`, { itens: novosItens });
      setPedido(response.data);
      setNovosItens([]);
    } catch (err) {
      console.error("Erro ao adicionar itens:", err);
    }
  };

  return (
    <div className="p-6">
      <h2>Editar Pedido #{pedido?.id} - {pedido?.nome_cliente}</h2>
      <ul>
        {pedido?.itens.map((item) => (
          <li key={item.id}>
            {item.quantidade}x {item.produto.nome} {item.is_new && "(novo)"}
          </li>
        ))}
      </ul>

      <h3>Adicionar novos itens</h3>
      {/* Aqui você coloca inputs de quantidade e produto */}
      <button onClick={adicionarItensPedido} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Adicionar itens
      </button>
    </div>
  );
};

export default EditarPedido;
