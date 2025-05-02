import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegistrationPage from './pages/Registration';
import MenuPage from './pages/Menu';
import AdminCreateUser from './pages/CreateUser';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/UserRoute';
import CheckoutPage from './pages/Checkout';
import MapPage from './pages/Map';
import PaymentPage from './pages/Payment';
import OrdersManagement from './pages/OrderManagement';
import OrderTrackingPage from './pages/OrderTracking';
import StaffRoute from './components/StaffRoute';
import MenuManagementPage from './pages/MenuManagement';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/checkout"  element={<ProtectedRoute> <CheckoutPage /> </ProtectedRoute>} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/create-user" element={ <AdminRoute> <AdminCreateUser /> </AdminRoute>}  />
        <Route path="/orders" element={<OrdersManagement />} />
        <Route path="/order/:orderId/tracking" element={<OrderTrackingPage />} />
        <Route path="/menu-management"  element={<StaffRoute> <MenuManagementPage /> </StaffRoute> } />
      </Routes>
    </Router>
  );
}

export default App;