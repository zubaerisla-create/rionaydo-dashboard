import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// Requests go through the Next.js proxy defined in next.config.ts
// which forwards /api/* to the real backend server-side (no CORS issues)
//  URGENT: KEEP baseUrl as '' OR THE DASHBOARD WILL STOP WORKING.
const baseUrl = 'https://doleritic-goutily-shila.ngrok-free.dev';

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const access = (getState() as any).auth.access;
    if (access) headers.set('Authorization', `Bearer ${access}`);
    headers.set('Content-Type', 'application/json');
    headers.set('ngrok-skip-browser-warning', 'true');
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  // For now, just return result. Add refresh logic when endpoint is available.
  return result;
};


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: '/api/admin/login/',
        method: 'POST',
        body,
      }),
    }),
    resetPasswordRequest: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/api/admin/reset-password/request/',
        method: 'POST',
        body,
      }),
    }),
    resetPasswordVerify: builder.mutation<any, { email: string; code: string }>({
      query: (body) => ({
        url: '/api/admin/reset-password/verify/',
        method: 'POST',
        body,
      }),
    }),
    resetPasswordReset: builder.mutation<any, { email: string; new_password: string; password_reset_token: string }>({
      query: (body) => ({
        url: '/api/admin/reset-password/reset/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useResetPasswordRequestMutation,
  useResetPasswordVerifyMutation,
  useResetPasswordResetMutation,
} = authApi;
