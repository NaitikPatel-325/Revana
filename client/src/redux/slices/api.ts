import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types for user and credentials
export interface userInfoType {
  username: string;
  email: string;
  picture?: string;
}

interface googleSignInResponseType {
  token: string;
  user: userInfoType;
}

interface githubSignInResponseType {
  token: string;
  user: userInfoType;
}


export interface loginCredentialsType {
  email: string;
  password: string;
}

export interface signupCredentialsType {
  username: string;
  email: string;
  password: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    credentials: "include", // to allow cookies and credentials
  }),
  tagTypes: ["myCodes", "allCodes"],
  endpoints: (builder) => ({
    login: builder.mutation<userInfoType, loginCredentialsType>({
      query: (body) => ({
        url: "/user/login",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    signup: builder.mutation<userInfoType, signupCredentialsType>({
      query: (body) => ({
        url: "/user/signup",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/user/logout",
        method: "POST",
        credentials: "include",
      }),
    }),
    getUserDetails: builder.query<userInfoType, void>({
      query: () => ({
        url: "/user/user-details",
        cache: "no-store",
      }),
    }),
    googleSignIn: builder.mutation<googleSignInResponseType, { idToken: string }>({
      query: (body) => ({
        url: "/user/googleSignin",
        method: "POST",
        body,
      }),
    }),    
    githubSignIn: builder.mutation<githubSignInResponseType, { code: string }>({
      query: (body) => ({
        url: "/user/githubSignin",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserDetailsQuery,
  useSignupMutation,
  useGoogleSignInMutation,
  useGithubSignInMutation,
} = api;
