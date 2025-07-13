import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { login, logout, register, getCurrentUser, clearError } from '@/store/slices/authSlice';
import { LoginForm, RegisterForm } from '@/types';

export function useAuth() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  return {
    ...auth,
    login: (data: LoginForm) => dispatch(login(data)),
    register: (data: RegisterForm) => dispatch(register(data)),
    logout: () => dispatch(logout()),
    getCurrentUser: () => dispatch(getCurrentUser()),
    clearError: () => dispatch(clearError()),
  };
} 