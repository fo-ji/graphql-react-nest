import type { Payload } from '@/types/payload';
import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';

interface AuthInfo {
  checked: boolean;
  isAuthenticated: boolean;
}

const INITIAL_AUTH_INFO = {
  checked: false,
  isAuthenticated: false,
};

export const useAuth = () => {
  const [authInfo, setAuthInfo] = useState<AuthInfo>(INITIAL_AUTH_INFO);

  useEffect(() => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const decodedToken = jwtDecode<Payload>(token);
        // MEMO: 取得したトークンが現在時刻より古い場合は期限切れ
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setAuthInfo({ checked: true, isAuthenticated: false });
        } else {
          setAuthInfo({ checked: true, isAuthenticated: true });
        }
      } else {
        setAuthInfo({ checked: true, isAuthenticated: false });
      }
    } catch (error) {
      setAuthInfo({ checked: true, isAuthenticated: false });
    }
  }, []);

  return { authInfo };
};
