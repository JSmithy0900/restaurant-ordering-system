// src/pages/MenuManagementPage.js
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';

export default function MenuManagementPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Starter'
  });

  // load all menu items
  const loadItems = async () => {
    try {
      const res = await fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/menu');
      const data = await res.json();
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
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category
    };
    await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });
    setForm({ name:'', description:'', price:'', category:'Starter' });
    loadItems();
  };

  const handleEdit = async id => {
    const i = items.find(x => x._id === id);
    const name = prompt('New name?', i.name);
    const description = prompt('New description?', i.description);
    const price = prompt('New price?', i.price);
    const category = prompt(
      'New category? (Starter, Main, Dessert)',
      i.category
    );
    if (name && !isNaN(parseFloat(price)) && ['Starter','Main','Dessert'].includes(category)) {
      await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          name, description, price: parseFloat(price), category
        })
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
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="Starter">Starter</option>
          <option value="Main">Main</option>
          <option value="Dessert">Dessert</option>
        </select>
        <button onClick={handleCreate}>Add Item</button>
      </div>

      {items.length === 0 ? (
        <p>No menu items yet.</p>
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
            {items.map(i => (
              <tr key={i._id}>
                <td>{i.name}</td>
                <td>{i.description}</td>
                <td>${i.price.toFixed(2)}</td>
                <td>{i.category}</td>
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
