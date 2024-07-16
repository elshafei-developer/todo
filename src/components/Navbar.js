import { Link } from "react-router-dom";
import "../style/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">الرئيسية</Link>
        </li>
        <li>
          <Link to="/about">حول</Link>
        </li>
        <li>
          <Link to="/contact">تواصل</Link>
        </li>
      </ul>
    </nav>
  );
}
