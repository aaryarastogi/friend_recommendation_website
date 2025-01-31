import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import login from '../assets/login.png';
import axios from "axios";

const Signin = () => {
    const [email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[token,setToken]=useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
        try{
            await axios.post("http://localhost:8000/api/users/signin",{
              email: email,
              password: password
            })
            .then(res=>{
                if(res.data.message=="exist"){
                    if(email && password){
                        alert("Succesfully login...")
                        navigate('/users')
                    }
                    else{
                        alert("Kindly fill all details!")
                    }
                    localStorage.setItem("token",res.data.token);
                    window.location.reload();
                }
                else if(res.data.message=="not exist"){
                    alert("User is not found")
                }
            })
            .catch(e=>{
                alert("wrong details")
                console.log(e);
            })
        }
        catch(e){
            console.log(e);
        }
    };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-6 bg-gray-100">
      <div className="md:w-1/2 w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign in</h2>
        <form>
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
            Sign in
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account? <Link to="/" className="text-blue-500">Sign up</Link>
        </p>
      </div>

      <div className="w-full md:block md:w-1/2">
        <img src={login}/>
      </div>
    </div>
  );
};

export default Signin;