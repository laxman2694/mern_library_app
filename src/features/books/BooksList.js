import { useGetbooksQuery } from "./booksApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Book from "./Book";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import React from "react";
const BooksList = () => {
  const navigate = useNavigate();
  useTitle("techbooks: Books List");
  const { username, isManager, isAdmin, isCreator, isViewAll, isViewer } =
    useAuth();

  const {
    data: books,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetbooksQuery("booksList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = books;
    let filteredIds;
    if (isManager || isAdmin || isCreator || isViewAll || isViewer) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (bookId) => entities[bookId].username === username
      );
    }

    const tableContent =
      ids?.length &&
      filteredIds.map((bookId) => (
        <Book
          isViewer={isViewer}
          isViewAll={isViewAll}
          key={bookId}
          bookId={bookId}
          filterType={""}
        />
      ));

    const handleFilter = () => {
      confirmAlert({
        title: "Filter Book By",
        message: "",
        buttons: [
          {
            label: "Books created within 10min ago",
            onClick: () => navigate("old"),
          },
          {
            label: "Books created within 10min",
            onClick: () => {
              navigate("latest");
            },
          },
        ],
      });
    };

    content = (
      <>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <button
            className="icon-button table__button"
            title="Filter"
            onClick={() => {
              handleFilter();
            }}
          >
            <FontAwesomeIcon color="white" icon={faFilter} />
          </button>
        </div>

        <table className="table table--notes">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th note__status">
                Pages
              </th>
              <th scope="col" className="table__th note__created">
                Created
              </th>
              <th scope="col" className="table__th note__updated">
                Updated
              </th>
              <th scope="col" className="table__th note__title">
                Book Name
              </th>
              <th scope="col" className="table__th note__username">
                Author Name
              </th>
              <th
                scope="col"
                className={isViewAll || isViewer ? "" : "table__th note__edit"}
              >
                {isViewAll || isViewer ? "" : "Edit"}
              </th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
      </>
    );
  }

  return content;
};
export default BooksList;
