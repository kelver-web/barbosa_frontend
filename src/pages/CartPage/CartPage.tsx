import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiBroomFill } from "react-icons/pi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import api from "../../services/api";
import Modal from "./Modal";



const mesasTotal = 22;

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [mesa, setMesa] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [mesasOcupadas, setMesasOcupadas] = useState<string[]>([]);
  const [loadingMesas, setLoadingMesas] = useState(true);

  const mesasLivres = Array.from({ length: mesasTotal }, (_, i) => (i + 1).toString())
    .filter(mesaNumero => !mesasOcupadas.includes(mesaNumero));

  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const fetchMesasOcupadas = async () => {
    setLoadingMesas(true);
    try {
      const response = await api.get("/pedidos/?status__in=pendente,preparando,pronto,entregue");

      const ocupadas = response.data.results.map((pedido: { mesa: any; }) => pedido.mesa);

      setMesasOcupadas(ocupadas);
    } catch (error) {
      console.error("Erro ao buscar mesas ocupadas:", error);
    } finally {
      setLoadingMesas(false);
    }
  };

  useEffect(() => {
    fetchMesasOcupadas();
    const novoId = Math.floor(Math.random() * 100000);
    setPedidoId(novoId);
  }, []);

  const abrirModalNome = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const fecharPedido = async () => {
    if (!nomeCliente.trim() || !mesa) {
      setMensagem("Por favor, insira o nome do cliente e selecione uma mesa.");
      return;
    }

    try {
      const pedido = {
        nome_cliente: nomeCliente,
        mesa: mesa,
        itens_pedido: cartItems.map(item => ({
          produto_id: item.id,
          quantidade: item.quantidade,
          observacoes: item.observacoes,
        })),
      };

      const response = await api.post("/pedidos/", pedido);
      setMensagem(`Pedido #${response.data.id} enviado com sucesso!`);
      setMesa(mesa);
      setModalAberto(false);
      clearCart();

      await fetchMesasOcupadas();
      navigate("/cardapio");
    } catch (error) {
      setMensagem("Erro ao enviar pedido. Tente novamente.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Seu carrinho está vazio.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Pedido #{pedidoId}</h1>
      </div>
      <div className="text-sm text-gray-800 dark:text-gray-200 font-mono border-t border-b border-gray-300 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {cartItems.map((item, index) => (
          <div key={index} className="py-3 flex justify-between items-start">
            <div className="flex-1">
              <div className="font-semibold">{item.nome}</div>
              {item.observacoes && (
                <div className="text-xs italic text-gray-500 dark:text-gray-400">Obs: {item.observacoes}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-blue-600 dark:text-blue-400">R$ {(item.preco * item.quantidade).toFixed(2)}</div>
              <div className="flex items-center justify-end gap-1 mt-1">
                <button onClick={() => updateQuantity(item.id, item.observacoes, item.quantidade - 1)}
                  className="px-2.5 py-1.5 text-red-600 bg-gray-200 dark:bg-gray-700 dark:text-red-600 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"> - </button>
                <span className="px-2 text-sm font-bold">{item.quantidade}</span>
                <button onClick={() => updateQuantity(item.id, item.observacoes, item.quantidade + 1)}
                  className="px-2.5 py-1.5 text-green-600 bg-gray-200 dark:bg-gray-700 dark:text-green-600 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"> + </button>
                <button onClick={() => removeFromCart(item.id, item.observacoes)}
                  className="text-yellow-400 text-xs ml-2 hover:underline">Remover</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-2">Total de itens: {cartItems.reduce((acc, item) => acc + item.quantidade, 0)}</p>
      </div>
      <div>
        <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-2">* Os preços podem variar de acordo com a disponibilidade dos ingredientes.</p>
      </div>
      <div className="text-right mt-6 space-y-2">
        <p className="text-lg font-bold text-gray-900 dark:text-white">Total: R$ {total.toFixed(2)}</p>
        <div className="flex justify-end gap-2">
          <button onClick={clearCart} className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">
            <PiBroomFill className="inline mr-1" /><span className="hidden sm:inline">Limpar</span> Carrinho
          </button>
          <button onClick={abrirModalNome} className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
            <IoCheckmarkDoneSharp className="inline mr-1" /><span className="hidden sm:inline">Fechar</span> Pedido
          </button>
        </div>
      </div>
      <Modal isOpen={modalAberto} title="Digite o nome do cliente" onClose={fecharModal}>
        <div className="mb-4 flex gap-2">
          <input type="text" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" placeholder="Nome do cliente" />
          {loadingMesas ? (
            <select disabled className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
              <option>Carregando mesas...</option>
            </select>
          ) : (
            <select value={mesa} onChange={(e) => setMesa(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
              <option value="">Selecione a Mesa</option>
              {mesasLivres.map(mesaNumero => (
                <option key={mesaNumero} value={mesaNumero}>Mesa {mesaNumero}</option>
              ))}
            </select>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={fecharModal} className="px-4 py-1 bg-gray-300 dark:bg-gray-600 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700">Fechar</button>
          <button onClick={fecharPedido} className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Confirmar</button>
        </div>
      </Modal>
      {mensagem && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded shadow-lg flex items-center gap-4">
          {mensagem}
          <button className="underline" onClick={() => setMensagem(null)} aria-label="Fechar mensagem">Fechar</button>
        </div>
      )}
    </div>
  );
};
export default CartPage;