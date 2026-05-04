import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api/auth.service';

export function useCurrentUser(redirectIfNotAuth = true) {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await getCurrentUser();
        if (!meRes.user) {
          if (redirectIfNotAuth) router.push('/login');
          return;
        }
        setUserId(meRes.user.id);
        setUserEmail(meRes.user.email);
        setUserName(meRes.user.email.split('@')[0]);
        setUserRole(meRes.user.role);
      } catch (error) {
        if (redirectIfNotAuth) router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router, redirectIfNotAuth]);

  return { userId, userName, userRole, userEmail, loading };
}