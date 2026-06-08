import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: 'admin' | 'customer';
  }

  interface Session {
    user: User;
  }
}
