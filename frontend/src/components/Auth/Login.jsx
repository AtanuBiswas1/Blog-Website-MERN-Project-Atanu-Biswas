import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [passwordValid, setPasswordValid] = useState(false); // Password validation state
  const [emailValid, setEmailValid] = useState(false); // Email validation state
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const validatePassword = (password) => {
    // Password must have at least 8 characters, including at least 1 number and 1 special character
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    // Basic email format validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handlePasswordChange = (e) => {
    const inputPassword = e.target.value;
    setPassword(inputPassword);
    setPasswordValid(validatePassword(inputPassword)); // Update password validation state
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setEmailValid(validateEmail(inputEmail)); // Update email validation state
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailValid || !passwordValid) {
      setError("Please fix validation errors before submitting.");
      return;
    }
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const user=response.data.data.user
      const token=response.data.data.accessToken
      dispatch(loginSuccess({user,token}));
      navigate('/');
    } catch (err) {
      setError( 'Login failed.');
    //   err.response.data.message ||
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            // onChange={(e) => setEmail(e.target.value)}
            onChange={handleEmailChange}
            // className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            className={`shadow appearance-none border rounded w-full py-2 px-3 ${
              emailValid ? "border-green-500" : email ? "border-red-500" : "border-gray-300"
            } text-gray-700`}
            required
          />
          {!emailValid && email && (
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
            value={password}
            // onChange={(e) => setPassword(e.target.value)}
            // className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            onChange={handlePasswordChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 ${
              passwordValid ? "border-green-500" : password ? "border-red-500" : "border-gray-300"
            } text-gray-700`}
            required
          />
          {!passwordValid && password && (
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
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
