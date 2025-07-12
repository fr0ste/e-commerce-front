import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Toast, Modal } from '@/types';

interface UIState {
  sidebarOpen: boolean;
  cartOpen: boolean;
  searchOpen: boolean;
  toasts: Toast[];
  modals: Modal[];
  isLoading: boolean;
}

const initialState: UIState = {
  sidebarOpen: false,
  cartOpen: false,
  searchOpen: false,
  toasts: [],
  modals: [],
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    toggleCart: (state) => {
      state.cartOpen = !state.cartOpen;
    },
    closeCart: (state) => {
      state.cartOpen = false;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    closeSearch: (state) => {
      state.searchOpen = false;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    openModal: (state, action: PayloadAction<Omit<Modal, 'id' | 'isOpen'>>) => {
      const modal: Modal = {
        ...action.payload,
        id: Date.now().toString(),
        isOpen: true,
      };
      state.modals.push(modal);
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const modal = state.modals.find(m => m.id === action.payload);
      if (modal) {
        modal.isOpen = false;
      }
    },
    removeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(modal => modal.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  closeSidebar,
  toggleCart,
  closeCart,
  toggleSearch,
  closeSearch,
  addToast,
  removeToast,
  clearToasts,
  openModal,
  closeModal,
  removeModal,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer; 