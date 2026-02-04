import NavListItem from "./_components/nav-list-item/nav-list-item";
import "./nav-list.scss";

/**
 * @typedef {Object} NavItem
 * @property {string} icon - The name or identifier of the icon (e.g., 'cherry', 'rocket').
 * @property {string} name - The display label for the navigation item.
 */

/**
 * @param {Object} props
 * @param {NavItem[]} props.items - An array of navigation items to display.
 */
export default function NavList({ items }) {
  return (
    <div className="nav-list">
      {items.map((nav_item, index) => (
        <NavListItem
          icon={nav_item.icon}
          name={nav_item.name}
          key={`nav-list-item-${index}`}
        />
      ))}
    </div>
  );
}
