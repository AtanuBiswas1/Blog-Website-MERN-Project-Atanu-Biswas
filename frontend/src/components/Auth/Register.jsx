import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [nameValid, setNameValid] = useState(false);
  const navigate = useNavigate();

  const validateName = (name) => {
    // Name must not contain numbers, special characters or '0'
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
  };
  const validateEmail = (email) => {
    // Basic email format validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    // Password must have at least 8 characters, including at least 1 number and 1 special character
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate the fields as they are being typed
    if (name === 'name') {
      setNameValid(validateName(value));
    } else if (name === 'email') {
      setEmailValid(validateEmail(value));
    } else if (name === 'password') {
      setPasswordValid(validatePassword(value));
    }
  };

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  console.log(formData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nameValid || !emailValid || !passwordValid) {
      setError("Please fix validation errors before submitting.");
      return;
    }

    try {
      const response = await axios.post(`${API}/auth/register`, formData);
      setSuccess(true);
      //console.log(response)
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError( 'Registration failed.');
      //err.response?.data?.message ||
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-6">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Registration successful! Redirecting to login...</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            //className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            className={`shadow appearance-none border rounded w-full py-2 px-3 ${
              nameValid ? "border-green-500" : formData.name ? "border-red-500" : "border-gray-300"
            } text-gray-700`}
            required
          />
          {!nameValid && formData.name && (
            <p className="text-red-500 text-xs mt-1">Name should not contain numbers or special characters.</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            //className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            className={`shadow appearance-none border rounded w-full py-2 px-3 ${
              emailValid ? "border-green-500" : formData.email ? "border-red-500" : "border-gray-300"
            } text-gray-700`}
            required
          />
          {!emailValid && formData.email && (
            <p className="text-red-500 text-xs mt-1">Enter a valid email address.</p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            //className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            className={`shadow appearance-none border rounded w-full py-2 px-3 ${
              passwordValid ? "border-green-500" : formData.password ? "border-red-500" : "border-gray-300"
            } text-gray-700`}
            required
          />
          {!passwordValid && formData.password && (
            <p className="text-red-500 text-xs mt-1">
              Password must be at least 8 characters, with 1 number and 1 special character.
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
