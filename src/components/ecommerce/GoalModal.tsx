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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 dark:bg-gray-900">
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
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
