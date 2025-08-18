// src/components/header/NotificationDropdown.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaTimes } from "react-icons/fa";
import { useGarcom } from "../../context/GarcomContext";

const NotificationDropdown: React.FC = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pedidosProntos, marcarComoEntregue } = useGarcom();

  const toggleDropdown = () => setIsNotificationsOpen(!isNotificationsOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsNotificationsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarcarComoEntregue = (e: React.MouseEvent, pedidoId: number) => {
    e.preventDefault();
    e.stopPropagation();
    marcarComoEntregue(pedidoId);
  };

  const pedidosParaExibir = pedidosProntos || [];
  const temPedidosProntos = pedidosParaExibir.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-5 w-5 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white ${temPedidosProntos ? 'blink-bell' : ''}`}
      >
        <span className="sr-only">Toggle notifications</span>
        <FaBell size={24} />
        {temPedidosProntos && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {pedidosParaExibir.length}
          </span>
        )}
      </button>

      {isNotificationsOpen && (
        <div className="absolute right-0 mt-3 w-72 rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Pedidos Prontos ({pedidosParaExibir.length})
            </h3>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {temPedidosProntos ? (
              pedidosParaExibir.map((pedido) => (
                <li key={pedido.id} className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <Link to={`/pedidos/${pedido.id}`} className="flex-1 block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-yellow-600 transition">
                    <div className="flex items-center gap-2 mb-1"> {/* 💡 Primeiras informações na mesma linha */}
                      <FaBell size={16} className="text-yellow-500" />
                      <span className="">
                        Pedido #{pedido.id}
                      </span>
                      <span className="text-sm  text-purple-500 dark:text-green-400">
                        Mesa #{pedido.mesa}
                      </span>
                    </div>
                    <div className="text-sm">
                      Cliente: <span className="italic">{pedido.nome_cliente}</span> &nbsp;está pronto!
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Previne o clique do link
                      handleMarcarComoEntregue(e, pedido.id);
                    }}
                    className="ml-2 p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Marcar como entregue"
                  >
                    <FaTimes size={16} />
                  </button>
                </li>
              ))
            ) : (
              <li className="p-4 text-gray-500 dark:text-gray-400">
                Nenhum pedido pronto para entrega.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;