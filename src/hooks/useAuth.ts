import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { login, logout, register, getCurrentUser, clearError } from '@/store/slices/authSlice';

export function useAuth() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  return {
    ...auth,
    login: (data: any) => dispatch(login(data)),
    register: (data: any) => dispatch(register(data)),
    logout: () => dispatch(logout()),
    getCurrentUser: () => dispatch(getCurrentUser()),
    clearError: () => dispatch(clearError()),
  };
} 