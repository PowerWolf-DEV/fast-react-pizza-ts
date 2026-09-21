import { useLoaderData } from "react-router";
import { getMenu } from "@/services/apiRestaurant";
import type { Pizza } from "@/services/apiRestaurant";
import MenuItem from "./MenuItem";

function Menu() {
  const menu: Pizza[] = useLoaderData();

  return (
    <ul className="divide-y divide-stone-200 px-2">
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

async function loader() {
  const menu: Pizza[] = await getMenu();
  return menu;
}

Menu.loader = loader;

export default Menu;
