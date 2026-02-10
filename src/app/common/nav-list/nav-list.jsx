import NavListItem from "./_components/nav-list-item/nav-list-item";
import "./nav-list.scss";

/**
 * @typedef {Object} NavItem
 * @property {string} icon - The name or identifier of the icon (e.g., 'cherry', 'rocket').
 * @property {string} name - The display label for the navigation item.
 * @property {string} filter - The display label for the navigation item.
 */

/**
 * @param {Object} props
 * @param {NavItem[]} props.items - An array of navigation items to display.
 * @param {(filter:any)=>void} props.onClick
 */
export default function NavList({ items, onClick }) {
  return (
    <div className="nav-list">
      <div className="nav-list-content">
        {items.map((nav_item, index) => (
          <NavListItem
            icon={nav_item.icon}
            name={nav_item.name}
            onClick={() => onClick(nav_item)}
            key={`nav-list-item-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
