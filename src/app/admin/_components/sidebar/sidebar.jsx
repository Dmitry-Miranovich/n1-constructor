import "./sidebar.scss";
import { SIDEBAR_DATA } from "./sidebar.data";
import { Link } from "react-router-dom";

export default function Sidebar({ type, onClick }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-name">{"Admin Panel"}</div>
      <div className="sidebar-list">
        {SIDEBAR_DATA.map((item, index) => (
          <button
            className={`${item.type === type ? "sidebar-list-item selected" : "sidebar-list-item"}`}
            key={index}
            onClick={() => {
              onClick(item.type);
            }}
          >
            {item.name}
          </button>
        ))}
        <Link to={"/"} className="exit-list-item">
          Exit
        </Link>
      </div>
    </aside>
  );
}
