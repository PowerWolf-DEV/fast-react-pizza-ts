import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./ui/Home";
import Menu from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import Order from "./features/order/Order";
import CreateOrder from "./features/order/CreateOrder";
import AppLayout from "./ui/AppLayout";
import ErrorMessage from "./ui/ErrorMessage";
import Loader from "./ui/Loader";
import UpdateOrder from "./features/order/UpdateOrder";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorMessage />,
    HydrateFallback: () => <Loader />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: Menu.loader,
        errorElement: <ErrorMessage />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
        action: CreateOrder.action,
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: Order.loader,
        errorElement: <ErrorMessage />,
        action: UpdateOrder.action,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
