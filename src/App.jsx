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
              <ProtectedRoute allowedRoles={["user"]}>
                <PrivateLayout>
                  <DashboardUser />
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
              <ProtectedRoute allowedRoles={["accountant"]}>
                <PrivateLayout>
                  <DashboardAccountant />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cafeteria"
            element={
              <ProtectedRoute allowedRoles={["cafeteria"]}>
                <PrivateLayout>
                  <DashboardCafeteria />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]} adminAccess>
                <PrivateLayout>
                  <DashboardAdmin />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
