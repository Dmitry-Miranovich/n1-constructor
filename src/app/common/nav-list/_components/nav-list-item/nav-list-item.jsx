import "./nav-list-item.scss";

export default function NavListItem({ icon, name, onClick }) {
  return (
    <div className="nav-list-item" onClick={() => onClick()}>
      <img
        src={`${process.env.REACT_APP_API_URL}${icon}`}
        alt="Nav List Item Icon"
        className="nav-list-item-icon"
      />
      <p className="nav-list-item-name">{name}</p>
    </div>
  );
}
