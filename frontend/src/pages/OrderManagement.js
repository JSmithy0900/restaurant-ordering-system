import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import '../css/OrderManagement.css';

export default function OrdersManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [showDelivered, setShowDelivered] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/orders/all-orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch orders');
        setOrders(data.orders);
      } catch (error) {
        setMessage(error.message);
      }
    };
    fetchOrders();
  }, []);

  // Handler to update an order's status
  const updateStatus = async (orderId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://restaurant-ordering-system-qbfz.onrender.com/api/orders/${orderId}/status`, { //http://localhost:5000/api/
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentStatus })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update order');
      setOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Access control
  if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
    return (
      <div className="orders-management">
        <NavBar />
        <h1>Access Denied</h1>
        <p>You must be a staff member or admin to view this page.</p>
        <Link to="/">Go back Home</Link>
      </div>
    );
  }

  // Separate orders
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'PendingPayment');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  // Filter delivered by search
  const filteredDelivered = deliveredOrders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="orders-management">
      <NavBar />
      <main>
        <h1>Order Management</h1>
        {message && <p className="error">{message}</p>}

        {/* Active Orders Section */}
        <section>
          <h2>Active Orders</h2>
          {activeOrders.length === 0 ? (
            <p>No active orders.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Address</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Advance Status</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.customerInfo.firstName} {order.customerInfo.lastName}</td>
                    <td>
                      {order.items.map(item => {
                        const name = item.menuItem?.name ?? item.menuItem;
                        return (
                          <div key={item._id || item.menuItem}>
                            {name} x {item.quantity}
                          </div>
                        );
                      })}
                    </td>
                    <td>{order.address}</td>
                    <td>£{order.total.toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>
                      <button onClick={() => updateStatus(order._id, order.status)}>
                        Next Stage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Toggle Delivered */}
        <section>
          <button className="toggle-btn" onClick={() => setShowDelivered(prev => !prev)}>
            {showDelivered ? 'Hide Delivered Orders' : 'Show Delivered Orders'}
          </button>

          {showDelivered && (
            <div className="delivered-section">
              <h2>Delivered Orders</h2>
              <input
                type="text"
                placeholder="Search by Order ID"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {filteredDelivered.length === 0 ? (
                <p>No delivered orders match your search.</p>
              ) : (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Address</th>
                      <th>Total</th>
                      <th>Delivered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDelivered.map(order => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.customerInfo.firstName} {order.customerInfo.lastName}</td>
                        <td>
                          {order.items.map(item => {
                            const name = item.menuItem?.name ?? item.menuItem;
                            return (
                              <div key={item._id || item.menuItem}>
                                {name} x {item.quantity}
                              </div>
                            );
                          })}
                        </td>
                        <td>{order.address}</td>
                        <td>£{order.total.toFixed(2)}</td>
                        <td>{new Date(order.updatedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </main>
      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}
