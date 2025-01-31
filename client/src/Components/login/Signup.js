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
  
      try {
          await axios.post(
              "http://localhost:8000/api/users/signup",
              {
                  name: name,
                  email: email,
                  password: password
              },
              {
                  headers: {
                      "Content-Type": "application/json", 
                  },
              }
          )
          .then(res => {
              console.log("Signup Successful:", res.data);
              alert("You are successfully signup... Now sign in your account"); 
              window.location.href = "/signin";
          })
          .catch(error => {
              console.error("Signup Failed:", error.response ? error.response.data : error.message);
              alert(error.response?.data?.message || "Signup failed, please try again.");
          });
  
      } catch (error) {
          console.error("Error signing up:", error);
          alert("An error occurred. Please try again.");
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
