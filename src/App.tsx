import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { TransactionItem } from "./pages/transaction";
import { Dashboard } from "./pages/dashboard";

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
        path: "dashboard",
        element: <Dashboard />,
      },
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
