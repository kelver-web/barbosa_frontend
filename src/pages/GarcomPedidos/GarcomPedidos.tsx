import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import api from "../../services/api";

import { FaRegEdit, FaCheckCircle } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";


// Interfaces
interface Produto {
  id: number;
  nome: string;
  categoria: {
    id: number;
    nome: string;
  };
}

interface ItemPedido {
  id: number;
  quantidade: number;
  produto: Produto;
  adicionado_em: string;
}

interface Pedido {
  id: number;
  nome_cliente: string;
  mesa: string;
  criado_em?: string;
  status: "pendente" | "preparando" | "pronto" | "entregue" | "pago"; 
  observacoes?: string;
  itens_pedido: ItemPedido[];
  valor_total: string;
}

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  preparando: "Preparando",
  pronto: "Pronto",
  entregue: "Entregue",
  pago: "Pago",
};

const PEDIDOS_PAGE_SIZE = 8; 

export default function RecentOrders() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);

  // Novos estados para os produtos e seleção
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<Produto[]>([]);
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>(1);
  const [observacoes, setObservacoes] = useState<string>("");

  // Função para buscar pedidos da API com paginação
  const fetchPedidos = async () => {
    try {
      const response = await api.get(`/pedidos/?page=${page}&page_size=${PEDIDOS_PAGE_SIZE}`);
      
      setPedidos(response.data.results || []);

      if (response.data.count) {
          setTotalPages(Math.ceil(response.data.count / PEDIDOS_PAGE_SIZE));
      } else {
          setTotalPages(1);
      }
      
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setPedidos([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [page]);

  // useEffect para buscar produtos disponíveis
  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await api.get("/produtos/?page_size=9999");
        // ✅ CORREÇÃO: Padronize a forma de pegar a lista de produtos
        setProdutosDisponiveis(response.data.results || []);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    }
    fetchProdutos();
  }, []);

  // Agrupa os produtos por categoria para o select
  const produtosPorCategoria = useMemo(() => {
    const grouped: Record<string, Produto[]> = {};
    produtosDisponiveis.forEach(produto => {
      const categoriaNome = produto.categoria?.nome || 'Sem Categoria';
      if (!grouped[categoriaNome]) {
        grouped[categoriaNome] = [];
      }
      grouped[categoriaNome].push(produto);
    });
    return grouped;
  }, [produtosDisponiveis]);

  // Função para adicionar itens ao pedido
  const adicionarItensPedido = async () => {
    if (!pedidoEditando || !produtoSelecionadoId || quantidade < 1) {
      alert("Por favor, selecione um produto e a quantidade.");
      return;
    }

    try {
      const payload = {
        produto_id: parseInt(produtoSelecionadoId),
        quantidade: quantidade,
        observacoes: observacoes,
      };

      const response = await api.patch(
        `/pedidos/${pedidoEditando.id}/adicionar_itens/`,
        payload
      );

      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoEditando.id ? response.data : p))
      );
      setModalOpen(false);
      setPedidoEditando(null);
      setProdutoSelecionadoId("");
      setQuantidade(1);
      setObservacoes("");
    } catch (err) {
      console.error("Erro ao adicionar itens:", err);
      alert("Erro ao adicionar item. Verifique o console.");
    }
  };

  // Função para reabrir o pedido
  const reabrirPedido = async (pedidoId: number) => {
    if (!window.confirm("Tem certeza que deseja reabrir este pedido?")) {
      return;
    }
    try {
      await api.patch(`/pedidos/${pedidoId}/reabrir_pedido/`);
      fetchPedidos();
      alert("Pedido reaberto com sucesso!");
    } catch (err) {
      console.error("Erro ao reabrir o pedido:", err);
      alert("Não foi possível reabrir o pedido. Verifique o console.");
    }
  };

  // Cancela a reabertura do pedido
  const cancelarReabertura = async (pedidoId: number) => {
    if (!window.confirm("Tem certeza que deseja cancelar a reabertura deste pedido?")) {
      return;
    }
    try {
      await api.patch(`/pedidos/${pedidoId}/cancelar_reabertura/`);
      fetchPedidos();
      alert("Reabertura de pedido cancelada com sucesso!");
    } catch (err) {
      console.error("Erro ao cancelar reabertura:", err);
      alert("Não foi possível cancelar a reabertura. Verifique o console.");
    }
  };
  
  // Marca o pedido como pago
  const handleMarcarComoPago = async (pedidoId: number) => {
      if (!window.confirm("Tem certeza que deseja marcar este pedido como pago?")) {
          return;
      }
      try {
          await api.patch(`/pedidos/${pedidoId}/marcar_como_pago/`);
          fetchPedidos();
          alert(`Pedido #${pedidoId} marcado como pago!`);
      } catch (err) {
          console.error("Erro ao marcar pedido como pago:", err);
          alert("Não foi possível marcar o pedido como pago.");
      }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Pedidos Recentes
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Pedido</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Mesa</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Cliente</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Itens</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Total</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Ações</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {Array.isArray(pedidos) && pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="py-3">
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      Pedido #{pedido.id}
                    </p>
                    {pedido.criado_em && (
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {new Date(pedido.criado_em).toLocaleString()}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-3">
                    <p className="py-3 text-gray-500 dark:text-gray-400">
                      #{pedido.mesa}
                    </p>
                  </TableCell>

                  <TableCell className="py-3">
                    <p className="py-3 text-gray-500 dark:text-gray-400">
                      {pedido.nome_cliente}
                    </p>
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                    <ul>
                      {Array.isArray(pedido.itens_pedido) && pedido.itens_pedido.map((item) => (
                        <li key={item.id}>
                          {item.quantidade}x {item.produto?.nome || "Produto"}
                        </li>
                      ))}
                    </ul>
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                    {pedido.valor_total ?
                      Number(pedido.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      : 'R$ 0,00'
                    }
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge
                      size="sm"
                      color={
                        pedido.status === "pago"
                          ? "success"
                          : pedido.status === "entregue"
                            ? "success"
                            : pedido.status === "pendente"
                              ? "warning"
                              : "info"
                      }
                    >
                      {statusLabels[pedido.status] || pedido.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      {/* Botão de reabrir aparece se o status não for pendente ou pago */}
                      {pedido.status !== 'pendente' && pedido.status !== 'pago' && (
                        <button
                          onClick={() => reabrirPedido(pedido.id)}
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Reabrir
                        </button>
                      )}
                      {/* Botões de editar e cancelar aparecem apenas para pedidos pendentes */}
                      {pedido.status === 'pendente' && (
                        <>
                          <div className="relative group">
                            <MdOutlineCancel
                              className="text-gray-500 size-5 dark:text-purple-600 cursor-pointer transform hover:scale-110"
                              onClick={() => cancelarReabertura(pedido.id)}
                            />
                            {/* Tooltip */}
                            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 z-10 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Cancelar Reabertura
                            </div>
                          </div>
                          <div className="relative group">
                            <FaRegEdit
                              className="text-gray-500 dark:text-blue-400 cursor-pointer transform hover:scale-110"
                              onClick={() => {
                                setPedidoEditando(pedido);
                                setModalOpen(true);
                              }}
                            />
                            {/* Tooltip */}
                            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 z-10 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Editar Pedido
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* NOVO BOTÃO DE PAGAMENTO */}
                      {pedido.status !== 'pago' && (
                          <div className="relative group">
                            <FaCheckCircle
                              className="text-green-600 size-5 cursor-pointer transform hover:scale-110"
                              onClick={() => handleMarcarComoPago(pedido.id)}
                            />
                            {/* Tooltip */}
                            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 z-10 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Marcar como Pago
                            </div>
                          </div>
                      )}
                      
                      <div className="relative group">
                        <FaRegTrashCan className="text-gray-500 dark:text-red-400 cursor-pointer transform hover:scale-110" />

                        {/* Tooltip */}
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 z-10 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Apagar Pedido
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-3 text-center text-gray-500 dark:text-gray-400">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex justify-start items-center mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 rounded-md text-sm disabled:opacity-50 py-1 text-gray-500 dark:text-gray-400"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Página {page} de {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 rounded-md text-sm disabled:opacity-50 text--800 py-1 text-gray-500 dark:text-gray-400"
        >
          Próxima
        </button>
      </div>

      {/* Modal para adicionar itens */}
      {modalOpen && pedidoEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-96 rounded-lg bg-white p-4 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Adicionar itens ao Pedido #{pedidoEditando.id}
            </h3>

            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="produto-select" className="text-sm text-gray-600 dark:text-gray-300">
                Selecione o Produto
              </label>
              <select
                id="produto-select"
                className="rounded border px-2 py-1 dark:bg-gray-700 dark:text-white/90"
                value={produtoSelecionadoId}
                onChange={(e) => setProdutoSelecionadoId(e.target.value)}
              >
                <option value="">-- Selecione um produto --</option>
                {Object.entries(produtosPorCategoria).map(([categoria, produtos]) => (
                  <optgroup key={categoria} label={categoria}>
                    {produtos.map(produto => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <label htmlFor="quantidade-input" className="text-sm text-gray-600 dark:text-gray-300">
                Quantidade
              </label>
              <input
                id="quantidade-input"
                type="number"
                min={1}
                placeholder="Quantidade"
                className="rounded border px-2 py-1 dark:bg-gray-700 dark:text-white/90"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </div>

            <label htmlFor="observacao" className="text-sm text-gray-600 dark:text-gray-300">
              Observação
            </label>
            <textarea
              id="observacao"
              placeholder="Observação"
              className="rounded border px-2 py-1 dark:bg-gray-700 dark:text-white/90 w-full"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded bg-gray-300 px-3 py-1 dark:bg-gray-700 dark:text-white/90"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="rounded bg-blue-500 px-3 py-1 text-white"
                onClick={adicionarItensPedido}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}