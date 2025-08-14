import { BsCartPlus } from "react-icons/bs";
import { useCart } from "../context/CartContext";


const CartIconWithBadge = () => {
    const { cartItems } = useCart();
    const totalItens = cartItems.reduce((acc, item) => acc + item.quantidade, 0);

    return (
        <div className="relative inline-block">
            <BsCartPlus />
            {totalItens > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {totalItens}
                </span>
            )}
        </div>
    );
};

export default CartIconWithBadge;
