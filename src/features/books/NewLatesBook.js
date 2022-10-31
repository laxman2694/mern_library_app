import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetbooksQuery, useDeleteBookMutation } from "./booksApiSlice";
import { memo } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import moment from "moment";
const NewLatesBook = ({ bookId, isViewAll, isViewer }) => {
  const navigate = useNavigate();
  const { book } = useGetbooksQuery("booksList", {
    selectFromResult: ({ data }) => ({
      book: data?.entities[bookId],
    }),
  });
  const [
    deleteBook,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteBookMutation();
  if (book) {
    const created = new Date(book.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(book.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => navigate(`/dash/books/${bookId}`);

    const onDeleteBookClicked = async (id) => {
      console.log(isDelError, isDelSuccess, delerror);
      await deleteBook({ id: id });
    };

    const submit = (book) => {
      confirmAlert({
        title: "Delete Book",
        message: "Are you sure to do this.",
        buttons: [
          {
            label: "Yes",
            onClick: () => onDeleteBookClicked(book.id),
          },
          {
            label: "No",
            onClick: () => console.log("Cancelled"),
          },
        ],
      });
    };
    const getNewBooks = () => {
      let jw =
        moment(moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss"))
          .fromNow()
          .includes("day") ||
        moment(moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss"))
          .fromNow()
          .includes("hours") ||
        moment(moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss"))
          .fromNow()
          .includes("year") ||
        moment(moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss"))
          .fromNow()
          .includes("years");

      if (jw) {
        return false;
      } else if (
        Number(
          moment(moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss"))
            .fromNow()
            .substring(
              0,
              moment(moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss"))
                .fromNow()
                .indexOf(" ")
            )
        ) < 10 ||
        moment(
          moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss")
        ).fromNow() === "a minute ago" ||
        moment(
          moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss")
        ).fromNow() === "a few seconds ago"
      ) {
        return true;
      } else {
        return false;
      }

      // let t1 =
      //   Number(
      //     moment(moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss"))
      //       .fromNow()
      //       .substring(
      //         0,
      //         moment(moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss"))
      //           .fromNow()
      //           .indexOf(" ")
      //       )
      //   ) < 10;

      // let t2 =
      //   moment(
      //     moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss")
      //   ).fromNow() === "a minute ago";
      // let t3 =
      //   moment(
      //     moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss")
      //   ).fromNow() === "a few seconds ago";
      // console.log("t1", t1, t2, t3);
      // t1 = false;
      // let res =
      //   Number(
      //     moment(moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss"))
      //       .fromNow()
      //       .substring(
      //         0,
      //         moment(moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss"))
      //           .fromNow()
      //           .indexOf(" ")
      //       )
      //   ) < 10 ||
      //   moment(
      //     moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss")
      //   ).fromNow() === "a minute ago" ||
      //   moment(
      //     moment(book.createdAt).format("YYYY-MM-DD HH:mm:ss")
      //   ).fromNow() === "a few seconds ago";

      // console.log("sdf,bsdjkjfhs", res);
      // return 1;
    };
    return (
      <>
        {getNewBooks() && (
          <tr className="table__row">
            <td className="table__cell">{book.pages}</td>
            <td className="table__cell note__created">{created}</td>
            <td className="table__cell note__updated">{updated}</td>
            <td className="table__cell note__title">{book.name}</td>
            <td className="table__cell note__username">{book.author}</td>

            <td className={isViewAll || isViewer ? "" : "table__cell"}>
              {!isViewAll && (
                <>
                  <button
                    className="icon-button table__button"
                    onClick={handleEdit}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    className="icon-button table__button"
                    title="Delete"
                    onClick={() => {
                      submit(book);
                    }}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </>
              )}
            </td>
          </tr>
        )}
      </>
    );
  } else return null;
};

const memoizedLatestBook = memo(NewLatesBook);

export default memoizedLatestBook;
