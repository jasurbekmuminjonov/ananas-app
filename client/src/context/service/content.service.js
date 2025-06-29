import { api } from "./api";

export const contentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createContent: builder.mutation({
      query: (body) => ({
        url: "/content/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Content"],
    }),
    getContents: builder.query({
      query: () => ({
        url: "/content",
        method: "GET",
      }),
      providesTags: ["Content"],
    }),
    // getProductByBarcode: builder.query({
    //   query: (barcode) => ({
    //     url: `/product/barcode?barcode=${barcode}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["Content"],
    // }),
    // getProductByPage: builder.query({
    //   query: (page) => ({
    //     url: `/product?page=${page}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["Content"],
    // }),
    // getProductByName: builder.query({
    //   query: (name) => ({
    //     url: `/product/name?name=${encodeURIComponent(name)}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["Content"],
    // }),
    // updateProduct: builder.mutation({
    //   query: ({ id, body }) => ({
    //     url: `/product/${id}`,
    //     method: "PUT",
    //     body,
    //   }),
    //   invalidatesTags: ["Content"],
    // }),
    // updateProductStock: builder.mutation({
    //   query: (body) => ({
    //     url: `/product/stock`,
    //     method: "PUT",
    //     body,
    //   }),
    //   invalidatesTags: ["Content"],
    // }),
  }),
});

export const { useCreateContentMutation, useGetContentsQuery } = contentApi;
