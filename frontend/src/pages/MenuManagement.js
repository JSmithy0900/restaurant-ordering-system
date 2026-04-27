import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import '../css/MenuManagement.css';
import '../css/app.css';

export default function MenuManagementPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Starter' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadItems = async () => {
    try {
      const res = await fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/menu');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.menuItems || []);
    } catch (err) {
      console.error('Error loading menu items:', err);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async () => {
    if (!form.name || !form.price) return;
    await fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) })
    });
    setForm({ name: '', description: '', price: '', category: 'Starter' });
    loadItems();
  };

  const startEdit = item => {
    setEditingId(item._id);
    setEditForm({ name: item.name, description: item.description, price: item.price, category: item.category });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async (id) => {
    await fetch(`https://restaurant-ordering-system-qbfz.onrender.com/api/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, price: parseFloat(editForm.price) })
    });
    setEditingId(null);
    loadItems();
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this item?')) return;
    await fetch(`https://restaurant-ordering-system-qbfz.onrender.com/api/menu/${id}`, { method: 'DELETE' });
    loadItems();
  };

  return (
    <div className="menu-management">
      <NavBar />
      <div className="mm-inner">
        <h1>Menu Management</h1>

        <div className="mm-form-card">
          <h2>Add new item</h2>
          <div className="mm-form">
            <div className="form-group">
              <label>Name</label>
              <input name="name" placeholder="e.g. Garlic Bread" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Price (£)</label>
              <input name="price" type="number" placeholder="0.00" value={form.price} onChange={handleChange} />
            </div>
            <div className="form-group span-2">
              <label>Description</label>
              <textarea name="description" placeholder="Short description..." value={form.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="Starter">Starter</option>
                <option value="Main">Main</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="mm-add-btn" onClick={handleCreate}>Add Item</button>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No menu items yet.</p>
        ) : (
          <table className="items-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  {editingId === item._id ? (
                    <>
                      <td><input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} /></td>
                      <td><input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} /></td>
                      <td><input type="number" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} style={{ width: 80 }} /></td>
                      <td>
                        <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                          <option value="Starter">Starter</option>
                          <option value="Main">Main</option>
                          <option value="Dessert">Dessert</option>
                        </select>
                      </td>
                      <td>
                        <button className="action-btn action-btn-save" onClick={() => saveEdit(item._id)}>Save</button>
                        <button className="action-btn action-btn-cancel" onClick={cancelEdit}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.name}</td>
                      <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{item.description}</td>
                      <td>£{item.price.toFixed(2)}</td>
                      <td>{item.category}</td>
                      <td>
                        <button className="action-btn action-btn-edit" onClick={() => startEdit(item)}>Edit</button>
                        <button className="action-btn action-btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}
