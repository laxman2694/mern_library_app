import { useState, useEffect } from "react";
import { useUpdateBookMutation, useDeleteBookMutation } from "./booksApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditBookForm = ({ book, users }) => {
  const { isManager, isAdmin, isCreator } = useAuth();

  const [updateBook, { isLoading, isSuccess, isError, error }] =
    useUpdateBookMutation();

  const [
    deleteBook,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteBookMutation();

  const navigate = useNavigate();

  const [name, setName] = useState(book.name);
  const [author, setAuthor] = useState(book.author);
  //const [completed, setCompleted] = useState(book.completed);
  const [userId, setUserId] = useState(book.user);
  const [pages, setPages] = useState(book.pages);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setName("");
      setAuthor("");
      setUserId("");
      navigate("/dash/books");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);
  const onAuthorChanged = (e) => setAuthor(e.target.value);
  const onPagesChanged = (e) => setPages(e.target.value);
  //const onCompletedChanged = (e) => setCompleted((prev) => !prev);
  //const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [name, author, userId].every(Boolean) && !isLoading;

  const onSaveBookClicked = async (e) => {
    if (canSave || isCreator) {
      await updateBook({
        id: book.id,
        user: userId,
        name,
        pages,
        author,
        completed: false,
      });
    }
  };

  const onDeleteBookClicked = async () => {
    await deleteBook({ id: book.id });
  };

  const created = new Date(book.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(book.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  // const options = users.map((user) => {
  //   return (
  //     <option key={user.id} value={user.id}>
  //       {" "}
  //       {user.username}
  //     </option>
  //   );
  // });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validNameClass = !name ? "form__input--incomplete" : "";
  const validAuthorClass = !author ? "form__input--incomplete" : "";
  const validPagesClass = !pages ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deleteButton = null;
  if (isManager || isAdmin || isCreator) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteBookClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Book #{book.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveBookClicked}
              disabled={!canSave || isCreator ? false : true}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>
        <label className="form__label" htmlFor="note-title">
          Book Name:
        </label>
        <input
          className={`form__input ${validNameClass}`}
          id="note-title"
          name="title"
          type="text"
          autoComplete="off"
          value={name}
          onChange={onNameChanged}
        />

        <label className="form__label" htmlFor="note-text">
          Author Name:
        </label>
        <input
          className={`form__input ${validAuthorClass}`}
          id="note-text"
          name="text"
          type="text"
          autoComplete="off"
          value={author}
          onChange={onAuthorChanged}
        />
        <label className="form__label" htmlFor="note-text">
          Total Pages:
        </label>
        <input
          className={`form__input ${validPagesClass}`}
          id="note-text"
          name="text"
          type="text"
          autoComplete="off"
          value={pages}
          onChange={onPagesChanged}
        />
        <div className="form__row">
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {created}
            </p>
            <p className="form__updated">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditBookForm;
