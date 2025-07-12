import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  addItemOptimistic,
  updateItemOptimistic,
  removeItemOptimistic,
} from '@/store/slices/cartSlice';

export function useCart() {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  return {
    ...cart,
    fetchCart: () => dispatch(fetchCart()),
    addToCart: (productId: string, quantity: number) => dispatch(addToCart({ productId, quantity })),
    updateCartItem: (itemId: string, quantity: number) => dispatch(updateCartItem({ itemId, quantity })),
    removeFromCart: (itemId: string) => dispatch(removeFromCart(itemId)),
    clearCart: () => dispatch(clearCart()),
    addItemOptimistic: (product: any, quantity: number) => dispatch(addItemOptimistic({ product, quantity })),
    updateItemOptimistic: (itemId: string, quantity: number) => dispatch(updateItemOptimistic({ itemId, quantity })),
    removeItemOptimistic: (itemId: string) => dispatch(removeItemOptimistic(itemId)),
  };
} 