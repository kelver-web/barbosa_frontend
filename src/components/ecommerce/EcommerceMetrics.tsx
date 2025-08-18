import { useEffect, useState } from 'react';
import api from '../../services/api';

// Ícones que você já possui
import { GroupIcon } from "../../icons";

// Componentes da sua UI
import Badge from "../ui/badge/Badge";
import { MdOutlineMonetizationOn } from "react-icons/md";

interface DashboardMetrics {
  vendas_totais: number;
  total_pedidos: number;
}

export default function EcommerceMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await api.get("/pedidos/metrics/");
      // 💡 Se a requisição for bem-sucedida, armazena os dados,
      // mesmo que os valores sejam 0
      setMetrics(response.data);
    } catch (err) {
      console.error("Erro ao buscar métricas:", err);
      // Se houver erro, mantém o estado como nulo
      setMetrics(null); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
      return (
          <div className="text-center py-8">
              <p className="text-gray-400">Carregando métricas...</p>
          </div>
      );
  }

  // Se houver um erro e 'metrics' for nulo, ainda exibe a mensagem de erro
  if (!metrics) {
      return (
          <div className="text-center py-8">
              <p className="text-gray-400">Não foi possível carregar os dados. Tente novamente.</p>
          </div>
      );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pedidos do Dia
            </span>
            {/* 💡 Exibe 0 se o valor for nulo */}
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics?.total_pedidos || 0}
            </h4>
          </div>
          <Badge color="info">
            hoje
          </Badge>
        </div>
      </div>

      {/* */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <MdOutlineMonetizationOn className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Vendas do Dia
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {/* 💡 Exibe 0 se o valor for nulo */}
                R$ {Number(metrics?.vendas_totais || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
          </div>

          <Badge color="info">
            hoje
          </Badge>
        </div>
      </div>
    </div>
  );
}