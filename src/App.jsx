import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicRoute from "./components/auth/PublicRoute";
import DashboardUser from "./pages/user/DashboardUser";
import DashboardChef from "./pages/chef/DashboardChef";
import DashboardAccountant from "./pages/accountant/DashboardAccountant";
import DashboardCafeteria from "./pages/cafeteria/DashboardCafeteria";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import PrivateLayout from "./layouts/PrivateLayout";
import Orders from "./pages/user/Orders";
import OrdersList from "./pages/user/OrdersList";
import ChangePassword from "./pages/user/ChangePassword";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import Drinks from "./pages/user/Drinks";
import UsersPage from "./pages/accountant/UsersPage";
import OrderSummary from "./pages/accountant/OrderSummary";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "admin", "accountant"]}>
                <PrivateLayout>
                  <DashboardUser />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          {/* disabling drinks temporary */}
          {/* <Route
            path="/user/drinks"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "admin", "accountant"]}>
                <PrivateLayout>
                  <Drinks />
                </PrivateLayout>
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/user/orders"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "admin", "accountant"]}>
                <PrivateLayout>
                  <Orders />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/orders/orderlist/:dates"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "admin", "accountant"]}>
                <PrivateLayout>
                  <OrdersList />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/change-password"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "admin", "accountant", "cafeteria"]}>
                <PrivateLayout>
                  <ChangePassword />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chef"
            element={
              <ProtectedRoute allowedRoles={["chef"]}>
                <PrivateLayout>
                  <DashboardChef />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/accountant"
            element={
              <ProtectedRoute allowedRoles={["accountant", "admin"]}>
                <PrivateLayout>
                  <DashboardAccountant />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/users/:dates"
            element={
              <ProtectedRoute allowedRoles={["accountant", "admin"]}>
                <PrivateLayout>
                  <UsersPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/ordersSummary/:dates"
            element={
              <ProtectedRoute allowedRoles={["accountant", "admin"]}>
                <PrivateLayout>
                  <OrderSummary />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cafeteria"
            element={
              <ProtectedRoute allowedRoles={["cafeteria", "admin"]}>
                <PrivateLayout>
                  <DashboardCafeteria />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]} adminAccess>
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
