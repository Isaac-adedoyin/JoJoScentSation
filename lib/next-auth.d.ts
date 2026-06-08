import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: 'admin' | 'manager' | 'customer';
  }

  interface Session {
    user: User;
  }
}
