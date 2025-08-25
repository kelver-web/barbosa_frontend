import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { FaBox } from "react-icons/fa";

interface ItemPedido {
  produto: {
    id: number;
    nome: string;
    categoria: {
      id: number;
      nome: string;
    };
  };
  quantidade: number;
  adicionado_em: string;
}

interface Pedido {
  id: number;
  itens_pedido: ItemPedido[];
  valor_total: number;
  status: "pago" | "pendente" | "cancelado";
  criado_em: string;
}

const PAGE_SIZE = 8;

export default function RecentOrders() {
  const [orders, setOrders] = useState<Pedido[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  // Filtros
  const [statusFiltro, setStatusFiltro] = useState<string | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null);
  const [filtrando, setFiltrando] = useState(false);

  const fetchRecentOrders = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/pedidos/recent_orders/?page=${pageNumber}`);

      const totalItems = response.data.count;
      setOrders(response.data.results);

      if (totalItems) {
        setTotalPages(Math.ceil(totalItems / PAGE_SIZE));
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos recentes:", error);
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders(page);
  }, [page]);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "pago":
        return "success";
      case "pendente":
        return "warning";
      case "cancelado":
        return "error";
      default:
        return "info";
    }
  };

  // Filtrar pedidos
  const pedidosFiltrados = (orders ?? [])
    .filter((pedido) =>
      statusFiltro ? pedido.status === statusFiltro : true
    )
    .filter((pedido) =>
      categoriaFiltro
        ? pedido.itens_pedido.some(
          (item) => item.produto.categoria.nome === categoriaFiltro
        )
        : true
    );
  const aplicarFiltro = () => setFiltrando(true);
  const limparFiltro = () => {
    setStatusFiltro(null);
    setCategoriaFiltro(null);
    setFiltrando(false);
  };

  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Pedidos Recentes
        </h3>
        <p className="text-center py-4 text-gray-400">
          Carregando pedidos...
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Pedidos Recentes
        </h3>
        <p className="text-center py-4 text-gray-400">
          Nenhum pedido recente encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Pedidos Recentes
        </h3>

        <div className="flex items-center gap-2">
          {/* Status filtro */}
          <select
            value={statusFiltro || ""}
            onChange={(e) => setStatusFiltro(e.target.value || null)}
            className="px-3 py-1.5 border rounded text-sm text-gray-400 bg-gray-00"
          >
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="cancelado">Cancelado</option>
          </select>

          {/* Categoria filtro */}
          <select
            value={categoriaFiltro || ""}
            onChange={(e) => setCategoriaFiltro(e.target.value || null)}
            className="px-3 py-1.5 border rounded text-sm text-gray-400 bg-gray-00"
          >
            <option value="">Todas as categorias</option>
            {orders
              ?.flatMap((pedido) =>
                pedido.itens_pedido.map((item) => item.produto.categoria.nome)
              )
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          {/* Botões aplicar/limpar */}
          <button
            onClick={aplicarFiltro}
            className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-800 dark:border-blue-400 rounded px-4 py-1.5"
          >
            Filtrar
          </button>
          <button
            onClick={limparFiltro}
            className="text-sm font-medium text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 border border-green-800 dark:border-green-400 rounded px-4 py-1.5"
          >
            Ver tudo
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[250px]">
                Produtos
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[120px]">
                Preço
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[120px]">
                Categoria
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[100px]">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {(filtrando ? pedidosFiltrados : orders).map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <div className="bg-gray-200 h-[50px] w-[50px] flex items-center justify-center text-gray-500">
                        <FaBox className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90 whitespace-normal">
                        {`ID: ${pedido.id} - ${pedido.itens_pedido
                          ?.map((item) => item.produto.nome)
                          .join(", ") ?? "Nenhum item"}`}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400 whitespace-normal">
                        {pedido.itens_pedido?.length ?? 0}{" "}
                        {pedido.itens_pedido?.length > 1 ? "Itens" : "Item"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  R$ {pedido.valor_total.toFixed(2).replace(".", ",")}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {pedido.itens_pedido?.[0]?.produto.categoria?.nome ?? "Sem categoria"}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={getBadgeColor(pedido.status)}>
                    {pedido.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
    </div>
  );
}
