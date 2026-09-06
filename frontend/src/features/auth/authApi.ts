import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { SessionUser } from "./authSlice"

import type { ProfessionalProfile, MealPlan } from "../../api"
export type ProfileInput = Pick<ProfessionalProfile, "first_name" | "last_name" | "jobs" | "bio" | "image_url">
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
  tagTypes: ["Users", "Professionals"],
  endpoints: builder => ({
    getProfessionals: builder.query<ProfessionalProfile[], void>({ query: () => '/professionals', transformResponse: (r: { professionals: ProfessionalProfile[] }) => r.professionals, providesTags: ['Professionals'] }),
    getProfessional: builder.query<{ professional: ProfessionalProfile; plans: MealPlan[] }, string>({ query: id => `/professionals/${id}`, providesTags: ['Professionals'] }),
    getOwnProfile: builder.query<ProfessionalProfile, void>({ query: () => '/professionals/me', transformResponse: (r: { professional: ProfessionalProfile }) => r.professional, providesTags: ['Professionals'] }),
    saveOwnProfile: builder.mutation<unknown, ProfileInput>({ query: body => ({ url: '/professionals/me', method: 'PUT', body }), invalidatesTags: ['Professionals', 'Users'] }),
    login: builder.mutation<Session, { userEmail: string; password: string }>({ query: body => ({ url: "/login/", method: "POST", body }) }),
    register: builder.mutation<Session, { userEmail: string; password: string; confirm_password: string }>({ query: body => ({ url: "/register", method: "POST", body }) }),
    refreshSession: builder.mutation<Session, void>({ query: () => ({ url: "/token/refresh", method: "GET" }) }),
    getUsers: builder.query<SessionUser[], void>({ query: () => "/admin/users", transformResponse: (response: { users: SessionUser[] }) => response.users, providesTags: ["Users"] }),
    createUser: builder.mutation<unknown, { email: string; password: string; role: string } & ProfileInput>({ query: body => ({ url: "/admin/users", method: "POST", body }), invalidatesTags: ["Users", "Professionals"] }),
    updateUser: builder.mutation<unknown, { id: number; role?: string; status?: string } & ProfileInput>({ query: ({ id, ...body }) => ({ url: `/admin/users/${id}`, method: "PATCH", body }), invalidatesTags: ["Users", "Professionals"] }),
    logout: builder.mutation<void, void>({ query: () => ({ url: "/logout", method: "GET" }) }),
  }),
})

export const { useGetProfessionalsQuery, useGetProfessionalQuery, useGetOwnProfileQuery, useSaveOwnProfileMutation, useLoginMutation, useRegisterMutation, useRefreshSessionMutation, useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useLogoutMutation } = authApi
