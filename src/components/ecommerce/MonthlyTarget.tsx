import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import GoalModal from "./GoalModal";
import api from "../../services/api";
import { formatCurrency } from "../../services/formatCurrency";

interface Metrics {
  target_value: number;
  target_percent: number;
  revenue: number;
  today: number;
  variation: number;
}

export default function MonthlyTarget() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    target_value: 0,
    target_percent: 0,
    revenue: 0,
    today: 0,
    variation: 0,
  });
  const [goalInitialValue, setGoalInitialValue] = useState<any>({});

  // Buscar métricas e meta do backend
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await api.get("/pedidos/metrics/");
        setMetrics({
          target_value: res.data.target_value || 0,
          target_percent: res.data.target_percent || 0,
          revenue: res.data.revenue || 0,
          today: res.data.today || 0,
          variation: res.data.variation || 0,
        });
      } catch (err) {
        console.error("Erro ao buscar métricas:", err);
      }
    }

    async function fetchGoal() {
      try {
        const res = await api.get("/goals/");
        if (res.data.results && res.data.results.length > 0) {
          const goal = res.data.results[0];
          setGoalInitialValue(goal);
          setMetrics((prev) => ({
            ...prev,
            target_value: parseFloat(goal.target_value),
            target_percent: goal.percent || prev.target_percent,
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar meta:", err);
      }
    }

    fetchMetrics();
    fetchGoal();
  }, []);

  async function deleteGoal() {
    if (!goalInitialValue.id) return; // nada a deletar
    try {
      await api.delete(`/goals/${goalInitialValue.id}/`);
      setGoalInitialValue({}); // limpa meta
      setMetrics((prev) => ({
        ...prev,
        target_value: 0,
        target_percent: 0,
        period: undefined,
        start_date: undefined,
        end_date: undefined,
      }));
    } catch (err: any) {
      console.error("Erro ao deletar meta:", err);
      alert("Erro ao deletar meta");
    }
  }

  const series = [metrics.target_percent];

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: { type: "radialBar", height: 330, sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: (val: number) => `${val}%`,
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Progresso"],
  };

  function toggleDropdown() {
    setDropdownOpen(!isDropdownOpen);
  }

  function closeDropdown() {
    setDropdownOpen(false);
  }

  async function saveGoal(goal: {
    period: string;
    target_value: number;
    start_date?: string;
    end_date?: string;
  }) {
    try {
      if (goal.period === "custom" && (!goal.start_date || !goal.end_date)) {
        alert("Preencha a data inicial e final para período personalizado.");
        return;
      }

      const body = {
        period: goal.period,
        target_value: String(goal.target_value),
        start_date: goal.start_date || null,
        end_date: goal.end_date || null,
      };

      const res = await api.post("/goals/", body);
      const data = res.data;

      setGoalInitialValue(data);
      setMetrics((prev) => ({
        ...prev,
        target_value: parseFloat(data.target_value),
        target_percent: data.percent || prev.target_percent,
      }));

      setModalOpen(false);
    } catch (err: any) {
      console.error("Erro ao salvar meta:", err);
      alert("Erro ao salvar meta");
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Meta Mensal
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Meta definida para este período
            </p>
          </div>
          <div className="relative inline-block">
            <button onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isDropdownOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                onItemClick={() => { setModalOpen(true); closeDropdown(); }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Definir Meta
              </DropdownItem>
              <DropdownItem
                onItemClick={() => { deleteGoal(); closeDropdown(); }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Cancelar Meta
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="relative mt-6">
          <div className="max-h-[330px]">
            <Chart options={options} series={series} type="radialBar" height={330} />
          </div>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            {metrics.variation > 0 ? `+${metrics.variation}%` : `${metrics.variation}%`}
          </span>
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Receita hoje: <b className="text-green-600">{formatCurrency(metrics.today)}</b>. Meta: <b className="text-green-600">{formatCurrency(metrics.target_value)}</b>.
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Alvo
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-blue-800 dark:text-blue/100 sm:text-lg">
            {formatCurrency(metrics.target_value)}
          </p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Receita
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-blue-800 dark:text-blue/90 sm:text-lg">
            {formatCurrency(metrics.revenue)}
          </p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Hoje
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-blue-800 dark:text-blue/90 sm:text-lg">
            {formatCurrency(metrics.today)}
          </p>
        </div>
      </div>

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveGoal}
        initialValue={goalInitialValue}
      />
    </div>
  );
}
