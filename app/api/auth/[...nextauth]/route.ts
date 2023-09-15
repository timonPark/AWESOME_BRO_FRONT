import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";

import {Get, LOCATOR, Post} from "@/app/utils/axios";
import {JWT} from "next-auth/jwt";
import {Account, User} from "next-auth";
import {UserDto} from "@/app/types/user/user.type";
import {ApiErrorType, ApiResponse} from "@/app/types/api/api.response";
import {apiResponseFail, apiResponseSuccess} from "@/app/utils/api.response";



const login = (email: string, password: string) =>
  ({
    email: email,
    password: password
  })

const createUserDto = (token:JWT, account: Account): UserDto =>
  ({
    name: token.name,
    email: token.email,
    nickname: token.name,
    loginType: account.provider,
    socialId: account.providerAccountId ? account.providerAccountId : 'credentials' ,
    profilePicture: token.picture
  })

const apiResponseAfterCreateUserDto = (response: any): UserDto =>
  ({
    name: response.name,
    email: response.email,
    nickname: response.name,
    loginType: response.loginType,
    socialId: response.socialId ,
    profilePicture: response.picture
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
        try {
          const result = await Post(LOCATOR.backend + '/user/login', login(credentials.email, credentials.password));
          const user: User = {
            id: result.data.data.accessToken, image: "", name: "",
            email: credentials.email
          };
          return user;
        } catch (e) {
          return {
            id: "", image: "", name: "",
            email: credentials.email
          };
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
    async jwt({ token, account, profile}) {

        if (account) {
          if (account.type === 'credentials') {
            const result: ApiResponse<UserDto> | ApiErrorType = await Get(LOCATOR.backend + '/user/email/' + token.email, 'Bearer ' + token.sub)
              .then((response) =>
                apiResponseSuccess(
                  response.data.success,
                  apiResponseAfterCreateUserDto(response),
              )
            ).catch((response) => {
              console.log(response);
                return apiResponseFail
                (
                  response.data.success,
                  response.data.errorCode,
                  response.data.message
                );
              });
            if (result.type === "success"){
              token['accessToken'] = token.sub;
              token.name = result.data.name;
              token['loginType'] = result.data.loginType;
            } else {
              token['message'] = result.message;
            }
          } else {
            const result = await Post(LOCATOR.backend + '/user/social', createUserDto(token, account));
            token['accessToken'] = result.data.data.accessToken;
            token['loginType'] = account.provider;
          }
        }
      return token;
    },
    async session({ session, token, user}) {
      session['message'] = token['message'];
      session['accessToken'] = token['accessToken'];
      session['loginType'] = token['loginType'];

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export { handler as GET, handler as POST };
