import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import api from "../../services/api";
import ChartTab from "../common/ChartTab";

type Timeframe = "monthly" | "quarterly" | "annually";

// Usaremos esta lista de meses como base para as categorias
const monthCategories = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

interface StatisticsData {
  sales: number[];
  revenue: number[];
}

export default function StatisticsChart() {
  const [data, setData] = useState<StatisticsData>({ sales: [], revenue: [] });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");

  const fetchStatisticsData = async (filter: Timeframe) => {
    setLoading(true);
    try {
      let endpoint = "";
      if (filter === "monthly") {
        endpoint = "/pedidos/monthly_statistics/";
      } else if (filter === "quarterly") {
        endpoint = "/pedidos/quarterly_statistics/";
      } else {
        endpoint = "/pedidos/annually_statistics/";
      }

      const response = await api.get(endpoint);
      setData(response.data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      // 💡 Em caso de erro, preenche os dados com zeros para evitar quebra do gráfico
      setData({ sales: Array(12).fill(0), revenue: Array(12).fill(0) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatisticsData(timeframe);
  }, [timeframe]);

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true, // 💡 Garante que o tooltip esteja habilitado
      x: {
        format: "MMM",
      },
      // 💡 Formata o texto do tooltip para exibir valores de vendas e receita
      y: {
        formatter: (value, { seriesIndex }) => {
          const formattedValue = `R$ ${value.toFixed(2)}`;
          if (seriesIndex === 0) return `Vendas: ${formattedValue}`;
          return `Receita: ${formattedValue}`;
        },
      },
    },
    xaxis: {
      type: "category",
      categories: monthCategories, // 💡 Agora as categorias são fixas para garantir que o gráfico seja exibido
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (value) => `R$${value.toFixed(2)}`,
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Vendas",
      data: data.sales,
    },
    {
      name: "Receita",
      data: data.revenue,
    },
  ];

  if (loading) {
      return (
          <div className="flex items-center justify-center p-8">
              <p className="text-gray-400">Carregando estatísticas...</p>
          </div>
      );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Estatísticas
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Dados de vendas e receita ao longo do ano
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab selected={timeframe} setSelected={setTimeframe} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}