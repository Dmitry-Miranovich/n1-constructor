import Carousel from "../common/carousel";
import pic1 from "../_assets/pictures/pic-1.webp";
import "./page.scss";
import NavList from "../common/nav-list/nav-list";
import { navItemsDefault } from "./_utils/nav-items";
import CardList from "../common/card-list/card-list";
import { useGet } from "../_utils/hooks/useGet";
import { useEffect } from "react";

export default function HomePage() {
  const { data } = useGet("banner");

  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL);
  }, [data]);

  return (
    <div className="page">
      {data && data.length > 0 && (
        <Carousel
          images={data.map((banner) => ({
            src: `${process.env.REACT_APP_API_URL}${banner.imageUrl}`,
            value: banner.name,
            href: "",
          }))}
          autoPlay={false}
        />
      )}
      <NavList items={navItemsDefault} />
      {/* <CardList items={[]} icon={pic1} name="Top" /> */}
    </div>
  );
}
