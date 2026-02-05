import Carousel from "../common/carousel";
import pic1 from "../_assets/pictures/pic-1.webp";
import "./page.scss";
import NavList from "../common/nav-list/nav-list";
import { navItemsDefault } from "./_utils/nav-items";
import CardList from "../common/card-list/card-list";

const templateData = [
  {
    src: pic1,
    value: "1",
    href: "",
  },
  {
    src: pic1,
    value: "2",
    href: "",
  },
  {
    src: pic1,
    value: "3",
    href: "",
  },
];

export default function HomePage() {
  return (
    <div className="page">
      <Carousel images={templateData} autoPlay={false} />
      <NavList items={navItemsDefault} />
      <CardList items={[]} icon={pic1} name="Top" />
    </div>
  );
}
