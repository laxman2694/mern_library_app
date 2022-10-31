import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const booksAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = booksAdapter.getInitialState();

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getbooks: builder.query({
      query: () => ({
        url: "/books",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedbooks = responseData.map((book) => {
          book.id = book._id;
          return book;
        });
        return booksAdapter.setAll(initialState, loadedbooks);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Book", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Book", id })),
          ];
        } else return [{ type: "Book", id: "LIST" }];
      },
    }),
    addNewBook: builder.mutation({
      query: (initialBook) => ({
        url: "/books",
        method: "POST",
        body: {
          ...initialBook,
        },
      }),
      invalidatesTags: [{ type: "Book", id: "LIST" }],
    }),
    updateBook: builder.mutation({
      query: (initialBook) => ({
        url: "/books",
        method: "PATCH",
        body: {
          ...initialBook,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Book", id: arg.id }],
    }),
    deleteBook: builder.mutation({
      query: ({ id }) => ({
        url: `/books`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Book", id: arg.id }],
    }),
  }),
});

export const {
  useGetbooksQuery,
  useAddNewBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApiSlice;

// returns the query result object
export const selectbooksResult = booksApiSlice.endpoints.getbooks.select();

// creates memoized selector
const selectbooksData = createSelector(
  selectbooksResult,
  (booksResult) => booksResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllbooks,
  selectById: selectBookById,
  selectIds: selectBookIds,
  // Pass in a selector that returns the books slice of state
} = booksAdapter.getSelectors(
  (state) => selectbooksData(state) ?? initialState
);
