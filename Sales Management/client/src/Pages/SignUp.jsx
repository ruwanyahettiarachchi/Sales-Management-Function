import React, { useState } from 'react'
import {Link ,useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';
import './css/signup.css';


export default function SignUp() {
  const [formdata,setFormdata]=useState({})
  const [error,setError]=useState(false);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  
  const handleChange=(e)=>{
    setFormdata({...formdata,[e.target.id]:e.target.value})
  }


  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
        setLoading(true)
        const res= await fetch('/api/auth/signup',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formdata),
        });
        const data=await res.json();
        setLoading(false)
       if(data.success===false){
        setError(true)
        return;
       }
navigate('/sign-in')
    }catch(error){
      setLoading(false)
      setError(true)
    }
 
    console.log(data)
  }


  return (
    <div className="signup-container">
      <h1 className="signup-header">Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <input type="text" placeholder="Username" id="username" className="signup-input" onChange={handleChange} />
        <input type="email" placeholder="Email" id="email" className="signup-input" onChange={handleChange} />
        <input type="password" placeholder="Password" id="password" className="signup-input" onChange={handleChange} />
        <button disabled={loading} className="signup-button">
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth className="oauth-container" />
      </form>

      <div className="signup-text">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="signup-link">Sign In</span>
        </Link>
        <p className="signup-error">{error && 'Something went wrong!'}</p>
      </div>
    </div>
  );
}