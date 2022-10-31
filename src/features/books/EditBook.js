import { useParams } from "react-router-dom";
import EditBookForm from "./EditBookForm";
import { useGetbooksQuery } from "./booksApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditBook = () => {
  useTitle("Library: Edit Book");

  const { id } = useParams();

  const { username, isManager, isAdmin, isCreator } = useAuth();

  const { book } = useGetbooksQuery("booksList", {
    selectFromResult: ({ data }) => ({
      book: data?.entities[id],
    }),
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!book || !users?.length) return <PulseLoader color={"#FFF"} />;

  if (!isManager && !isAdmin && !isCreator) {
    if (book.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditBookForm book={book} users={users} />;

  return content;
};
export default EditBook;
