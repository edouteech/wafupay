import axios from "axios";
import { log } from "console";
import { NextAuthOptions, SessionStrategy, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import router from "next/router";
import Swal from "sweetalert2";

const apiUrl = process.env.NEXT_PUBLIC_APIURL;
// Définir l'interface User


export const options = {
  providers: [
    GoogleProvider({
      profile: async (profile: any) => {
        console.log("Profile Google:", profile);

        let userRole = "Google User"
        if (profile?.email == "kekeadjignonjeanpaul@gmail.com") {
          userRole = "admin";
        }
        try {
          const resp = await axios.post(`${apiUrl}/token/login-with-google`, { "email": profile?.email, "first_name": profile.given_name, "last_name": profile.family_name, "googleId": profile.sub })
          if (resp) {
            const user = {
              token: resp.data.data.token,
            }
            return {
              ...profile,
              id: profile.sub,
              token: user.token,
              firstname: profile.given_name,
              lastname: profile.family_name,
              role: userRole

            }
          }
        } catch (error) {
          console.error('API Request Error:', error);
        }
        return {
          ...profile,
          id: profile.sub,
          firstname: profile.given_name,
          lastname: profile.family_name,
          role: userRole

        }

      },
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_Secret as string,
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
          if (email) {
            resp =  await axios.post(`${apiUrl}/token`, { "email" : email ? email : null, "password": password });
          }else{
            resp =  await axios.post(`${apiUrl}/token`, { "phone_num": phone_num ? phone_num : null, "password": password });
          }
          let infos = resp.data?.data
          
          if (infos) {
            const user: any = {
              id: infos.token,
              firstname: infos.first_name,
              lastname: infos.last_name,
              email: infos.email,
              phone_num: infos.phone_num,
              role: infos.is_admin,
              is_verified: infos.is_verified
            };
            return user;
          }
        } catch (err: any) {
          console.error("Error registering user:", err);
          // return {"email" : err};
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
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        if (user.role) {
          token.googleID = user.id,
            token.token = user.token
          token.role = user.role;
          token.firstname = user.firstname;
          token.lastname = user.lastname;
        }
        if (user.phone_num) {
          token.id = user.id;
          token.lastname = user.lastname;
          token.firstname = user.firstname;
          token.email = user.email;
          token.phone_num = user.phone_num;
          token.phone_num = user.phone_num;
          token.is_verified = user.is_verified

          if (user.role == '0') {
            user.role = 'user';
          } else {
            user.role = 'admin';
          }
          token.role = user.role;
        }

      }
      return token;
    },

    async session({ session, token }: any) {
      session.user = {
        google_token: token.token,
        googleID: token.googleID,
        token: token.id,
        role: token.role,
        firstname: token.firstname,
        lastname: token.lastname,
        email: token.email,
        phone_num: token.phone_num
      };
      return session;
    },
  },
};

export default options;