import React, { useState } from "react";
import { Link } from "react-router-dom";
import login from '../assets/login.png'
import axios from 'axios';


const Signup = () => {
    const[name,setName]=useState("");
    const [email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validate if all fields are filled
      if (!name || !email || !password) {
          alert("Kindly fill all details...");
          return;
      }
      try {
          const response = await axios.post(
              "http://localhost:8000/api/users/signup",
              {
                  name: name,
                  email: email,
                  password: password,
              },
              {
                  headers: {
                      "Content-Type": "application/json",
                  },
              }
          );
          if (response.status === 201) {
              alert("You have successfully signed up! Now sign in to your account.");
              window.location.href = "/signin"; 
          }
      } catch (error) {
          if (error.response) {
              console.error("Signup Failed:", error.response.data);
              alert(error.response.data.message || "Signup failed, please try again.");
          } else if (error.request) {
              console.error("No response received:", error.request);
              alert("No response from the server. Please try again.");
          } else {
              console.error("Error setting up the request:", error.message);
              alert("An error occurred. Please try again.");
          }
      }
  };
  

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-6 bg-gray-100">
      <div className="w-full md:block md:w-1/2">
        <img src={login}/>
      </div>

      <div className="md:w-1/2 w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign up</h2>
        <form>
          <input
            type="text"
            placeholder="Name"
            onChange={(e)=>setName(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700" onClick={handleSubmit}>
            Sign up
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account? <Link to="/signin" className="text-blue-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
