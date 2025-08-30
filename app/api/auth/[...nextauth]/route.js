import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import clientPromise from '../../../../lib/mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, user, token }) {
      // Agregar el ID del usuario a la sesión de forma segura
      if (user) {
        session.user.id = user.id;
      } else if (token) {
        session.user.id = token.id;
      }

      // Obtener información adicional del usuario desde la base de datos
      try {
        const client = await clientPromise;
        const db = client.db();
        const userData = await db.collection('users').findOne(
          { email: session.user.email },
          { projection: { role: 1, banned: 1, muted: 1 } }
        );
        
        if (userData) {
          session.user.role = userData.role || 'user';
          session.user.banned = userData.banned || false;
          session.user.muted = userData.muted || false;
        } else {
          session.user.role = 'user';
          session.user.banned = false;
          session.user.muted = false;
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        session.user.role = 'user';
        session.user.banned = false;
        session.user.muted = false;
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    profile: '/profile',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
