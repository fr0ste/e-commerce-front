import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem, Product } from '@/types';
import { cartApi } from '@/lib/api/cart';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(productId, quantity);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateCartItem(itemId, quantity);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await cartApi.removeFromCart(itemId);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartApi.clearCart();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic updates for better UX
    addItemOptimistic: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      if (!state.cart) {
        state.cart = {
          id: 'temp',
          userId: 'temp',
          items: [],
          total: 0,
          itemCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      const { product, quantity } = action.payload;
      const existingItem = state.cart.items.find(item => item.productId === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = product.price * existingItem.quantity;
      } else {
        state.cart.items.push({
          id: `temp-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          price: product.price * quantity,
        });
      }

      state.cart.itemCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      state.cart.total = state.cart.items.reduce((sum, item) => sum + item.price, 0);
      state.cart.updatedAt = new Date().toISOString();
    },
    updateItemOptimistic: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      if (!state.cart) return;

      const { itemId, quantity } = action.payload;
      const item = state.cart.items.find(item => item.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          state.cart.items = state.cart.items.filter(item => item.id !== itemId);
        } else {
          item.quantity = quantity;
          item.price = item.product.price * quantity;
        }

        state.cart.itemCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        state.cart.total = state.cart.items.reduce((sum, item) => sum + item.price, 0);
        state.cart.updatedAt = new Date().toISOString();
      }
    },
    removeItemOptimistic: (state, action: PayloadAction<string>) => {
      if (!state.cart) return;

      const itemId = action.payload;
      state.cart.items = state.cart.items.filter(item => item.id !== itemId);
      state.cart.itemCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      state.cart.total = state.cart.items.reduce((sum, item) => sum + item.price, 0);
      state.cart.updatedAt = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart.items = state.cart.items.filter(item => item.id !== action.payload);
          state.cart.itemCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
          state.cart.total = state.cart.items.reduce((sum, item) => sum + item.price, 0);
          state.cart.updatedAt = new Date().toISOString();
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  addItemOptimistic, 
  updateItemOptimistic, 
  removeItemOptimistic 
} = cartSlice.actions;

export default cartSlice.reducer; 