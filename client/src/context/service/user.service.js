import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body) => ({
        url: "/user/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ['User']
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: "/user/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ['User']

    }),
    userGoogle: builder.mutation({
      query: (body) => ({
        url: "/user/google",
        method: "POST",
        body,
      }),
      invalidatesTags: ['User']

    }),
    verifyUser: builder.mutation({
      query: (body) => ({
        url: "/user/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ['User']

    }),
    resendOtp: builder.mutation({
      query: (body) => ({
        url: "/user/resend",
        method: "POST",
        body,
      }),
      invalidatesTags: ['User']
    }),
    checkNickname: builder.mutation({
      query: (body) => ({
        url: '/user/check/nickname',
        body,
        method: "POST"
      })
    }),
    checkGoogle: builder.mutation({
      query: (body) => ({
        url: '/user/check/google',
        body,
        method: "POST"
      })
    }),
    getOtherUsers: builder.query({
      query: () => ({
        url: '/user/get/others',
        method: "GET",
      })
    }),
    getSelfUser: builder.query({
      query: () => ({
        url: '/user/get/self',
        method: "GET",
      })
    })
  }),
});

export const {
  useLoginUserMutation,
  useCreateUserMutation,
  useResendOtpMutation,
  useUserGoogleMutation,
  useVerifyUserMutation,
  useCheckNicknameMutation,
  useCheckGoogleMutation,
  useGetOtherUsersQuery,
  useGetSelfUserQuery
} = userApi;
