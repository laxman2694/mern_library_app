import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewBookMutation } from "./booksApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewBookForm = ({ users }) => {
  const [addNewBook, { isLoading, isSuccess, isError, error }] =
    useAddNewBookMutation();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState(0);
  const [userId, setUserId] = useState(users[0].id);

  useEffect(() => {
    if (isSuccess) {
      setName("");
      setAuthor("");
      setUserId("");
      navigate("/dash/books");
    }
  }, [isSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);
  const onAuthorChanged = (e) => setAuthor(e.target.value);
  const onPagesChanged = (e) => {
    if (!isNaN(e.target.value)) setPages(e.target.value);
  };
  //const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [name, author, pages, userId].every(Boolean) && !isLoading;

  const onSaveBookClicked = async (e) => {
    setPages(Number(pages));
    e.preventDefault();
    if (canSave) {
      await addNewBook({ user: userId, name, author, pages });
    }
  };

  //   const options = users.map((user) => {
  //     return (
  //       <option key={user.id} value={user.id}>
  //         {" "}
  //         {user.username}
  //       </option>
  //     );
  //   });

  const errClass = isError ? "errmsg" : "offscreen";
  const validNameClass = !name ? "form__input--incomplete" : "";
  const validAuthorClass = !author ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveBookClicked}>
        <div className="form__title-row">
          <h2>New Book</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Book Name:
        </label>
        <input
          className={`form__input ${validNameClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={name}
          onChange={onNameChanged}
        />

        <label className="form__label" htmlFor="text">
          Author Name:
        </label>
        <input
          className={`form__input ${validAuthorClass}`}
          id="text"
          name="text"
          type={"text"}
          autoComplete="off"
          value={author}
          onChange={onAuthorChanged}
        />
        <label className="form__label" htmlFor="text">
          Total Pages:
        </label>
        <input
          className={`form__input ${validAuthorClass}`}
          id="text"
          name="text"
          type={"text"}
          autoComplete="off"
          value={pages}
          onChange={onPagesChanged}
        />

        {/* <label
          className="form__label form__checkbox-container"
          htmlFor="username"
        >
          ASSIGNED TO:
        </label>
        <select
          id="username"
          name="username"
          className="form__select"
          value={userId}
          onChange={onUserIdChanged}
        >
          {options}
        </select> */}
      </form>
    </>
  );

  return content;
};

export default NewBookForm;
