import { Link } from "react-router-dom";
import "./NotFound.css";
import spaceImage from "../../assets/images/space404.jpg";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div
          className="notfound-oops"
          style={{ backgroundImage: `url(${spaceImage})` }}
        >
          oops!
        </div>
        <h1 className="notfound-title">404 - PAGE NOT FOUND</h1>
        <p className="notfound-message">
          The page you are looking for might have been removed
          <br />
          had its name changed or is temporarily unavailable.
        </p>
        <Link to="/" className="notfound-button">
          GO TO HOMEPAGE
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
