import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap"> Library</span>
        </h1>
      </header>
      <main className="public__main">
        <p>Located in Beautiful Downtown Mohol city.</p>
        <address className="public__addr">
          At/Post: Bital
          <br />
          Tal: Mohol
          <br />
          Dist: Solapur
          <br />
        </address>
        <br />
        <p>Owner: Laxman</p>
      </main>
      <footer>
        <Link to="/login">Login</Link>
      </footer>
    </section>
  );
  return content;
};
export default Public;
