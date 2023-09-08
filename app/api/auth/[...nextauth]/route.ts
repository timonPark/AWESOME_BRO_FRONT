import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import { env } from "process";
import {LOCATOR, Post} from "@/app/utils/axios";
import {SocialUser} from "@/app/types/user/user.type";
import {JWT} from "next-auth/jwt";
import {Account} from "next-auth";

type NextAuthTokenType =
  | {
      name: string;
      email: string;
      picture: string;
      sub: string;
      iat: string;
      exp: string;
      jti: string;
    }
  | undefined;

const createSocialUser = (token:JWT, account: Account) =>
  ({
    name: token.name,
    email: token.email,
    nickname: token.name,
    loginType: account.provider,
    socialId: account.providerAccountId,
    profilePicture: token.picture
  })

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "",
      credentials: {
        email: { label: "이메일", type: "text", placeholder: "이메일 주소" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return;
        }
        console.log(`credentials: ${JSON.stringify(credentials)}`);
        const user: any = {
          csrfToken: "1",
          email: "m05214@naver.com",
          name: "박종훈",
          passowrd: "password",
        };
        if (
          credentials.email === user.email &&
          credentials.password === user.passowrd
        ) {
          console.log(`user: ${JSON.stringify(user)}`);
          return user;
        } else {
          return null;
        }
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID ? process.env.KAKAO_CLIENT_ID : "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET
        ? process.env.KAKAO_CLIENT_SECRET
        : "",
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID ? process.env.NAVER_CLIENT_ID : "",
      clientSecret: process.env.NAVER_CLIENT_SECRET
        ? process.env.NAVER_CLIENT_SECRET
        : "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
        ? process.env.GOOGLE_CLIENT_SECRET
        : "",
    }),
  ],
  callbacks: {
    async jwt({ token, account}) {
      if (account) {
        const result = await Post(LOCATOR.backend + '/user/social', createSocialUser(token, account))
        token['id'] = result.data.data;
        token['loginType'] = account.provider;
      }
      return token;
    },
    async session({ session, token, user}) {
      session['userId'] = token['id'];
      session['loginType'] = token['loginType']
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export { handler as GET, handler as POST };
