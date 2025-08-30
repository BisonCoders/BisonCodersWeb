import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import clientPromise, { connectMongoDB } from '../../../../lib/mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import User from '../../../../models/User';

export const authOptions = {
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
    async signIn({ user, account, profile }) {
      try {
        await connectMongoDB();
        
        // Buscar o crear usuario en MongoDB con Mongoose
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
    async session({ session, user, token }) {
      try {
        await connectMongoDB();
        const userData = await User.findOne({ email: session.user.email });
        
        if (userData) {
          session.user.id = userData._id.toString();
          session.user.projectsCount = userData.projectsCount;
          session.user.editorSettings = userData.editorSettings;
          session.user.role = userData.role || 'user';
          session.user.banned = userData.banned || false;
          session.user.muted = userData.muted || false;
        } else {
          session.user.role = 'user';
          session.user.banned = false;
          session.user.muted = false;
        }
        
        return session;
      } catch (error) {
        console.error('Error en session callback:', error);
        return session;
      }
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
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  debug: process.env.NODE_ENV === 'development',
});

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };