import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { TransactionItem } from "./pages/transaction";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: "transactions",
        element: <TransactionItem />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
