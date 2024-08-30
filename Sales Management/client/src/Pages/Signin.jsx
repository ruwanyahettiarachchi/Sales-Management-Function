import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/User/userSlice';
import OAuth from '../components/OAuth';
import './css/signup.css';

export default function SignIn() {
  const [formdata, setFormdata] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-header">Sign In</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="signup-input"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="signup-input"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="signup-button"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth className="oauth-container" />
      </form>

      <div className="signup-text">
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="signup-link">Sign Up</span>
        </Link>
        <p className="signup-error">{error ? error || 'Something went wrong!' : ''}</p>
      </div>
    </div>
  );
}
