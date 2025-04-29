'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useLogin } from '@/context/LoginContext';
import Cookies from 'js-cookie';

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useLogin();

  const handleLogout = () => {
    // Remove all cookies with proper attributes
    Cookies.remove('isLoggedIn', { path: '/', secure: true, sameSite: 'strict' });
    Cookies.remove('username', { path: '/', secure: true, sameSite: 'strict' });
    Cookies.remove('isAdmin', { path: '/', secure: true, sameSite: 'strict' });
    Cookies.remove('userId', { path: '/', secure: true, sameSite: 'strict' });
    
    // Call the context logout function to update the state
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
