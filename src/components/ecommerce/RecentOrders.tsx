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
import { FaBox } from 'react-icons/fa';

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

  const fetchRecentOrders = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/pedidos/recent_orders/?page=${pageNumber}`);
      
      const totalItems = response.data.count;
      
      // ✅ CORREÇÃO: Pegue a lista de pedidos do campo `results`
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
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Pedidos Recentes
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filtrar
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Ver tudo
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[250px]">Produtos</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[120px]">Preço</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[120px]">Categoria</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[100px]">Status</TableCell>
            </TableRow>
          </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.map((pedido) => (
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
                           {`ID: ${pedido.id} - ${pedido.itens_pedido?.map(item => item.produto.nome).join(', ') ?? 'Nenhum item'}`}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400 whitespace-normal">
                          {pedido.itens_pedido?.length ?? 0} {pedido.itens_pedido?.length > 1 ? 'Itens' : 'Item'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    R$ {pedido.valor_total.toFixed(2).replace('.', ',')}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {pedido.itens_pedido?.[0]?.produto.categoria?.nome ?? 'Sem categoria'}
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
