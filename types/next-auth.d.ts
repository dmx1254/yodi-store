// types/next-auth.d.ts

import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string;
    phone?: string;
    firstname?: string;
    lastname?: string;
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstname: string;
      lastname: string;
      address: string;
      city: string;
      zip: string;
      country: string;
      phone: string;
      
    };
  }
}

interface JWT {
  id?: string;
  email?: string;
  phone?: string;
  firstname?: string;
  lastname?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  
}