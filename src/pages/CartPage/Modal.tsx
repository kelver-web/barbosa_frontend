import React from "react";


const Modal: React.FC<{
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Backdrop semi-transparente
      onClick={onClose} // fechar clicando fora do modal
    >
      <div
        className="bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 rounded-lg p-6 max-w-md w-full shadow-lg"
        onClick={(e) => e.stopPropagation()} // evita fechar clicando dentro do modal
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
