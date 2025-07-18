import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
const baseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:8080/",
  // baseUrl: "https://ananas-server.vercel.app/",
  baseUrl: "http://34.30.21.85:8080/",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Cache-Control", "no-cache");
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 });

const customBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQueryWithRetry(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    localStorage.clear();
    window.window.location.href = "/";
  }

  return result;
};

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: customBaseQuery,
  tagTypes: [],
  endpoints: () => ({}),
});
