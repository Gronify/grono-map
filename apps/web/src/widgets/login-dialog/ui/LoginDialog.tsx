'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { LoginForm, RegisterForm } from '@/features/auth';
import { useUser } from '@/entities/user/model/useUser';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function LoginDialog() {
  const { user, logout, isLoading } = useUser();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (isLoading)
    return (
      <Skeleton className="h-9 w-9 rounded-full fixed top-4 right-4 z-[9999]" />
    );

  if (user) {
    return (
      <div className="fixed top-4 right-4 z-[9999]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 rounded-full cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {user.email?.[0]?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed top-4 right-4 z-[9999]">Sign In</Button>
      </DialogTrigger>

      <DialogContent className="z-[9999]">
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Login' : 'Register'}</DialogTitle>
        </DialogHeader>
        {mode === 'login' ? (
          <>
            <LoginForm onSuccess={() => setOpen(false)} />
            <p className="mt-2 text-sm text-center">
              No account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm onSuccess={() => setOpen(false)} />
            <p className="mt-2 text-sm text-center">
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Login
              </button>
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
