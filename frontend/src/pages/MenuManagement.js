import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';

export default function MenuManagementPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', description:'', price:'' });

  // load the menu items
  const loadItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      console.log('Fetched menu-admin:', data);
      setItems(Array.isArray(data) ? data : data.menuItems || []);
    } catch (err) {
      console.error('Error loading menu items:', err);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price)
      })
    });
    setForm({ name:'', description:'', price:'' });
    loadItems();
  };

  const handleEdit = async id => {
    const i = items.find(x => x._id === id);
    const name = prompt('New name?', i.name);
    const description = prompt('New description?', i.description);
    const price = prompt('New price?', i.price);
    if (name && !isNaN(parseFloat(price))) {
      await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ name, description, price: parseFloat(price) })
      });
      loadItems();
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this item?')) {
      await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      loadItems();
    }
  };

  return (
    <div className="menu-management">
        <NavBar />
      <h1>Menu Management</h1>

      <div className="form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
        />
        <button onClick={handleCreate}>Add Item</button>
      </div>

      {items.length === 0 ? (
        <p>No menu items yet.</p>
      ) : (
        <table className="items-table">
          <thead>
            <tr>
              <th>Name</th><th>Description</th><th>Price</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i._id}>
                <td>{i.name}</td>
                <td>{i.description}</td>
                <td>${i.price.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(i._id)}>✏️</button>
                  <button onClick={() => handleDelete(i._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
