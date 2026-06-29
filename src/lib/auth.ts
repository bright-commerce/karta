import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Check for Admin Override from Environment Variables
        if (
          process.env.ADMIN_USERNAME && 
          process.env.ADMIN_PASSWORD && 
          credentials.email.toLowerCase() === process.env.ADMIN_USERNAME.toLowerCase() && 
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "system-admin-id",
            email: process.env.ADMIN_USERNAME,
            name: "Admin",
            role: "ADMIN",
          };
        }
        
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          // Frictionless Auth: Create the user if they don't exist
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              role: "BUYER",
            }
          });
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        if (!user.password) {
          throw new Error("Invalid login method");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // We will build a custom login page
  }
};
