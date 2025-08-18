import { Dispatch, SetStateAction } from "react";

// 💡 Define os tipos de props que o componente receberá
interface ChartTabProps {
  selected: "monthly" | "quarterly" | "annually";
  setSelected: Dispatch<SetStateAction<"monthly" | "quarterly" | "annually">>;
}

const ChartTab: React.FC<ChartTabProps> = ({ selected, setSelected }) => {
  const getButtonClass = (option: "monthly" | "quarterly" | "annually") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        // 💡 Atualiza o estado no componente pai
        onClick={() => setSelected("monthly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "monthly"
        )}`}
      >
        Mensal
      </button>

      <button
        // 💡 Atualiza o estado no componente pai
        onClick={() => setSelected("quarterly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "quarterly"
        )}`}
      >
        Trimestral
      </button>

      <button
        // 💡 Atualiza o estado no componente pai
        onClick={() => setSelected("annually")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "annually"
        )}`}
      >
        Anual
      </button>
    </div>
  );
};

export default ChartTab;
