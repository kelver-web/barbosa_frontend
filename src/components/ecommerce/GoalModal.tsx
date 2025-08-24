import { useState, useEffect } from "react";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: { period: string; target_value: number; start_date?: string; end_date?: string }) => void;
  initialValue?: { period?: string; target_value?: number; start_date?: string; end_date?: string };
}

export default function GoalModal({ isOpen, onClose, onSave, initialValue }: GoalModalProps) {
  const [period, setPeriod] = useState("monthly");
  const [targetValue, setTargetValue] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (initialValue) {
      setPeriod(initialValue.period || "monthly");
      setTargetValue(initialValue.target_value || 0);
      setStartDate(initialValue.start_date || "");
      setEndDate(initialValue.end_date || "");
    }
  }, [initialValue]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (period === "custom" && (!startDate || !endDate)) {
      alert("Preencha a data inicial e final para período personalizado.");
      return;
    }
    onSave({ period, target_value: targetValue, start_date: startDate, end_date: endDate });
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Definir Meta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Período</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:text-white"
            >
              <option value="daily">Diária</option>
              <option value="monthly">Mensal</option>
              <option value="custom">Período Personalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Meta (R$)</label>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {period === "custom" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Data Inicial</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Data Final</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-800 dark:border-blue-400 rounded-lg px-4 py-1">
              Cancelar
            </button>
            <button type="submit" className="text-sm font-medium text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 border border-green-800 dark:border-green-400 rounded-lg px-4 py-1">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
