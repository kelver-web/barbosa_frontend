// src/pages/EditPedidoModal.tsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

interface Produto {
  id: number;
  nome: string;
}

interface ItemPedido {
  id?: number;
  quantidade: number;
  produto: Produto;
}

interface Pedido {
  id: number;
  nome_cliente: string;
  status: string;
  itens: ItemPedido[];
}

interface Props {
  pedido: Pedido;
  onClose: () => void;
  onUpdated: () => void;
}

const EditarPedidoModal: React.FC<Props> = ({ pedido, onClose, onUpdated }) => {
  const [itens, setItens] = useState<ItemPedido[]>(pedido.itens || []);
  const [novosItens, setNovosItens] = useState<{ produto: number; quantidade: number }[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    // Buscar produtos disponíveis
    api.get("/produtos/").then((res) => setProdutos(res.data.results || []));
  }, []);

  const adicionarNovoItem = () => {
    setNovosItens([...novosItens, { produto: produtos[0]?.id || 0, quantidade: 1 }]);
  };

  const handleSalvar = async () => {
    try {
      if (novosItens.length > 0) {
        await api.patch(`/pedidos/${pedido.id}/adicionar_itens/`, { itens: novosItens });
      }
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Editar Pedido #{pedido.id}</h2>
        <h3 className="font-semibold mb-2">Itens atuais:</h3>
        <ul className="mb-4">
          {itens.map((item, idx) => (
            <li key={idx}>
              {item.quantidade}x {item.produto.nome} {item.id ? "" : "(Novo)"}
            </li>
          ))}
        </ul>

        <h3 className="font-semibold mb-2">Adicionar novos itens:</h3>
        {novosItens.map((item, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <select
              className="flex-1 border rounded p-1"
              value={item.produto}
              onChange={(e) =>
                setNovosItens((prev) => {
                  const copy = [...prev];
                  copy[idx].produto = Number(e.target.value);
                  return copy;
                })
              }
            >
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="w-16 border rounded p-1"
              value={item.quantidade}
              min={1}
              onChange={(e) =>
                setNovosItens((prev) => {
                  const copy = [...prev];
                  copy[idx].quantidade = Number(e.target.value);
                  return copy;
                })
              }
            />
          </div>
        ))}
        <button onClick={adicionarNovoItem} className="bg-green-500 text-white px-3 py-1 rounded mb-4">
          Adicionar Item
        </button>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-400 text-white px-3 py-1 rounded">
            Cancelar
          </button>
          <button onClick={handleSalvar} className="bg-blue-500 text-white px-3 py-1 rounded">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarPedidoModal;
