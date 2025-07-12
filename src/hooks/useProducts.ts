import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  fetchProducts,
  fetchProductById,
  fetchFeaturedProducts,
  fetchCategories,
  setFilters,
  clearFilters,
  setPage,
  clearCurrentProduct,
} from '@/store/slices/productSlice';

export function useProducts() {
  const product = useSelector((state: RootState) => state.product);
  const dispatch = useDispatch<AppDispatch>();

  return {
    ...product,
    fetchProducts: (filters: any) => dispatch(fetchProducts(filters)),
    fetchProductById: (id: string) => dispatch(fetchProductById(id)),
    fetchFeaturedProducts: () => dispatch(fetchFeaturedProducts()),
    fetchCategories: () => dispatch(fetchCategories()),
    setFilters: (filters: any) => dispatch(setFilters(filters)),
    clearFilters: () => dispatch(clearFilters()),
    setPage: (page: number) => dispatch(setPage(page)),
    clearCurrentProduct: () => dispatch(clearCurrentProduct()),
  };
} 