import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    occupation: '',
    gender: 'Male'
  });
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (loggedIn) {
      fetchUsers();
    }
  }, [loggedIn]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      setMessage('Error fetching users');
      console.error(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, loginData);
      setMessage(response.data.message);
      setLoggedIn(true);
    } catch (error) {
      setMessage('Invalid credentials');
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        await axios.put(`${API_URL}/users/${currentUserId}`, formData);
        setMessage('User updated successfully');
      } else {
        await axios.post(`${API_URL}/users`, formData);
        setMessage('User added successfully');
      }
      
      fetchUsers();
      resetForm();
    } catch (error) {
      setMessage('Error saving user');
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      date_of_birth: user.date_of_birth,
      occupation: user.occupation,
      gender: user.gender
    });
    setEditMode(true);
    setCurrentUserId(user.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/users/${id}`);
        setMessage('User deleted successfully');
        fetchUsers();
      } catch (error) {
        setMessage('Error deleting user');
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      date_of_birth: '',
      occupation: '',
      gender: 'Male'
    });
    setEditMode(false);
    setCurrentUserId(null);
  };

  if (!loggedIn) {
    return (
      <div className="login-container">
        <h1>Ekco User Management</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
        <p className="credentials-note">
          Note: Use username: <strong>admin</strong> and password: <strong>ekco123</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>User Management System</h1>
      
      {message && <p className="message">{message}</p>}
      
      <div className="form-container">
        <h2>{editMode ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Occupation:</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <button type="submit">{editMode ? 'Update' : 'Add'}</button>
          {editMode && <button type="button" onClick={resetForm}>Cancel</button>}
        </form>
      </div>
      
      <div className="users-container">
        <h2>User List</h2>
        <button onClick={() => fetchUsers()}>Refresh List</button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Occupation</th>
              <th>Gender</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.date_of_birth}</td>
                <td>{user.occupation}</td>
                <td>{user.gender}</td>
                <td>{user.date_added}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;