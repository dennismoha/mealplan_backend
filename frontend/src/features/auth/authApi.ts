import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { SessionUser } from "./authSlice"

type Session = { token: string; user: SessionUser }

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/user",
    credentials: "include",
    prepareHeaders: (headers, api) => {
      const token = (api.getState() as { auth: { token: string | null } }).auth.token
      if (token) headers.set("authorization", `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ["Users"],
  endpoints: builder => ({
    login: builder.mutation<Session, { userEmail: string; password: string }>({ query: body => ({ url: "/login/", method: "POST", body }) }),
    register: builder.mutation<Session, { userEmail: string; password: string; confirm_password: string }>({ query: body => ({ url: "/register", method: "POST", body }) }),
    refreshSession: builder.mutation<Session, void>({ query: () => ({ url: "/token/refresh", method: "GET" }) }),
    getUsers: builder.query<SessionUser[], void>({ query: () => "/admin/users", transformResponse: (response: { users: SessionUser[] }) => response.users, providesTags: ["Users"] }),
    createUser: builder.mutation<unknown, { email: string; password: string; role: string }>({ query: body => ({ url: "/admin/users", method: "POST", body }), invalidatesTags: ["Users"] }),
    updateUser: builder.mutation<unknown, { id: number; role?: string; status?: string }>({ query: ({ id, ...body }) => ({ url: `/admin/users/${id}`, method: "PATCH", body }), invalidatesTags: ["Users"] }),
    logout: builder.mutation<void, void>({ query: () => ({ url: "/logout", method: "GET" }) }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useRefreshSessionMutation, useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useLogoutMutation } = authApi
