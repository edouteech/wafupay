import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      firstname: string;
      lastname: string;
    };
  }

  interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  }
}