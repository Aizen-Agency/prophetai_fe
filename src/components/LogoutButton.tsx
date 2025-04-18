'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useLogin } from '@/context/LoginContext';
import Cookies from 'js-cookie';

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useLogin();

  const handleLogout = () => {
    // Expire all cookies by setting them to expire in the past
    const pastDate = new Date(0);
    Cookies.set('isLoggedIn', 'false', { expires: pastDate });
    Cookies.set('username', '', { expires: pastDate });
    Cookies.set('isAdmin', 'false', { expires: pastDate });
    Cookies.set('userId', '0', { expires: pastDate });
    
    // Call the context logout function
    logout();
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <Button 
      onClick={handleLogout} 
      className="bg-red-500 hover:bg-red-600 text-white absolute -right-2 -top-2 text-xs px-6 py-4 mx-4 my-8"
    >
      Logout
    </Button>
  );
}
