import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedEmails = [
  "spyroszacharias@hostmetric.gr",
  "mariosgeorgiou@hostmetric.gr",
];

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google,
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },

  callbacks: {
    async signIn({ user }) {
      const email =
        user.email?.toLowerCase();

      if (!email) {
        return false;
      }

      return allowedEmails.includes(
        email
      );
    },
  },

  pages: {
    signIn: "/admin/login",
  },
});