import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { connectDB } from './mongodb';
import User from '../models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();
        
        // Buscar o crear usuario en MongoDB
        let existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Crear nuevo usuario
          existingUser = new User({
            name: user.name,
            email: user.email,
            image: user.image,
            providers: [{
              provider: account.provider,
              providerId: account.providerAccountId,
            }],
          });
          await existingUser.save();
        } else {
          // Actualizar última actividad
          await existingUser.updateLastActive();
          
          // Agregar provider si no existe
          const hasProvider = existingUser.providers.some(
            p => p.provider === account.provider && p.providerId === account.providerAccountId
          );
          
          if (!hasProvider) {
            existingUser.providers.push({
              provider: account.provider,
              providerId: account.providerAccountId,
            });
            await existingUser.save();
          }
        }
        
        return true;
      } catch (error) {
        console.error('Error en signIn callback:', error);
        return false;
      }
    },
    async session({ session, token }) {
      try {
        await connectDB();
        const user = await User.findOne({ email: session.user.email });
        
        if (user) {
          session.user.id = user._id.toString();
          session.user.projectsCount = user.projectsCount;
          session.user.editorSettings = user.editorSettings;
        }
        
        return session;
      } catch (error) {
        console.error('Error en session callback:', error);
        return session;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
};