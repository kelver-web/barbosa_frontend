import React from "react";
import { FaUtensils } from "react-icons/fa";
import { useKitchen } from "../context/KitchenContext";

const KitchenIconWithBadge: React.FC = () => {
  const { pedidosCozinha } = useKitchen();
  const pedidoCount = pedidosCozinha.length;

  return (
    <div className="relative inline-block">
      <FaUtensils size={24} />
      {pedidoCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
          {pedidoCount}
        </span>
      )}
    </div>
  );
};

export default KitchenIconWithBadge;
