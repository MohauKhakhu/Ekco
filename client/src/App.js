import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import './index.css';
const API = 'http://localhost:8800';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', date_of_birth: '', occupation: '', gender: '', date_added: '' });
  const [login, setLogin] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchUsers = () => {
    axios.get(`${API}/users`).then(res => setUsers(res.data));
  };

  const handleLogin = () => {
    axios.post(`${API}/login`, login)
      .then(() => {
        setIsLoggedIn(true);
        fetchUsers();
      })
      .catch(() => alert('Login failed'));
  };

  const handleAdd = () => {
    axios.post(`${API}/users`, form).then(() => {
      fetchUsers();
      setForm({ name: '', date_of_birth: '', occupation: '', gender: '', date_added: '' });
    });
  };

  const handleDelete = (id) => {
    axios.delete(`${API}/users/${id}`).then(fetchUsers);
  };

  const handleEdit = (id) => {
    const updated = prompt('Enter new name:');
    if (updated) {
      axios.put(`${API}/users/${id}`, { ...form, name: updated }).then(fetchUsers);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <input
            className="w-full p-2 border mb-3 rounded"
            placeholder="Username"
            onChange={e => setLogin({ ...login, username: e.target.value })}
          />
          <input
            className="w-full p-2 border mb-3 rounded"
            type="password"
            placeholder="Password"
            onChange={e => setLogin({ ...login, password: e.target.value })}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">User Management</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">User List</h3>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.occupation} | {user.date_of_birth}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Add New User</h3>
          <div className="bg-white p-4 rounded shadow space-y-3">
            <input
              className="w-full p-2 border rounded"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded"
              type="date"
              value={form.date_of_birth}
              onChange={e => setForm({ ...form, date_of_birth: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Occupation"
              value={form.occupation}
              onChange={e => setForm({ ...form, occupation: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Gender"
              value={form.gender}
              onChange={e => setForm({ ...form, gender: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded"
              type="date"
              value={form.date_added}
              onChange={e => setForm({ ...form, date_added: e.target.value })}
            />
            <button
              onClick={handleAdd}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
