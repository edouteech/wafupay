import axios from "axios";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import router from "next/router";
import Swal from "sweetalert2";

const apiUrl = process.env.NEXT_PUBLIC_APIURL;

// Définir l'interface User


export const options = {
  providers: [
    GoogleProvider({
      profile(profile : any){
        console.log("Profile Google:",profile);

        let userRole = "Google User"
        if (profile?.email == "kekeadjignonjeanpaul@gmail.com") {
          userRole = "admin";
        }
        return{
          ...profile,
          id : profile.sub,
         role : userRole,      
        }
      },
      clientId : process.env.GOOGLE_ID as string,
      clientSecret : process.env.GOOGLE_Secret as string,
    }),

    CredentialsProvider({
      type: "credentials",
      credentials: {},
      name: "credentials",

      async authorize(credentials: any, req) {
        const phone_num = credentials?.phone_num
        const email = credentials?.email
        const password = credentials?.password

        let resp;
        try {
        if (phone_num) {
            resp = await axios.post(`${apiUrl}/token`, { "phone_num": phone_num ? phone_num : null, "password": password});
          } else if (email) {
            resp = await axios.post(`${apiUrl}/token`, {"email": email ? email : null, "password": password});
          }

          if (resp && resp.data) {
            const user : any = {
              id: resp.data.data.token,
              firstname: resp.data.data.first_name,
              lastname: resp.data.data.last_name,
            };
            return user;
          }
        } catch (err  : any) {
          console.error("Error registering user:", err);
          Swal.fire({
            icon: "error",
            title: "Mauvaise entrées",
            text: err.response.data.phone_num
              ? err.response.data.phone_num
              : err.response.data.email
              ? err.response.data.email
              : "Aucun compte trouvé avec ces informations veuillez vérifier et rééssayer",
          });
        }
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.lastname = user.lastname;
        token.firstname = user.firstname;
        token.email = user.email;
        token.phone_num = user.phone_num;
      }
      return token;
    },

    async session({ session, token }: any) {
      session.user = {
        token: token.id,
        firstname: token.firstname,
        lastname: token.lastname,
        email : token.email,
        phone_num : token.phone_num
      };
      return session;
    },
  },
};

export default options;
