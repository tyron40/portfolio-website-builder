import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { setUser } from '../store/slices/authSlice';
import { useTypedSelector } from './useTypedSelector';

export const useAuth = () => {
  const dispatch = useDispatch();
  const isGuest = useTypedSelector((state) => state.auth.isGuest);

  useEffect(() => {
    // Skip Firebase auth listener for guest users
    if (isGuest) return;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            id: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || undefined,
          })
        );
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch, isGuest]);
};