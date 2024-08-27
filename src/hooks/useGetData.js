import { useEffect } from 'react';
import { useAppDispatch } from './store';
import { getUsers } from '../store/users/thunks';
import { verifyLoggedUser } from '../store/auth/thunks';

export function useGetData() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(verifyLoggedUser());
    dispatch(getUsers());

  }, []);

  return {};
}
