import React, { useState } from 'react'
import axios from 'axios'
import '../styles/LandingPage.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", email: "", password: "" })
    const [toggleForm, setToggleForm] = useState(0)

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const loginHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/user/login', { email: user.email, password: user.password });
            if (res.data.success) {
                localStorage.setItem('token', res.data.data.token);
                toast(res.data.message);
                setUser(res.data.data)
                navigate(`/user-dashboard/${res.data.data._id}`)
            } else {
                toast(res.data.message)
            }
        } catch (error) {
            toast("Error occured")
        }
    }

    const registerHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/user/register', { name: user.name, email: user.email, password: user.password });
            if (res.data.success) {
                toast(res.data.message)
                setUser(res.data.data)
                setToggleForm(0)
                // localStorage.setItem('user', )
            } else {
                toast(res.data.message)
            }
        } catch (error) {
            toast("Error occured")
        }
    }

    return (
        <div className='container-fluid form-container mont'>
            <form className='form'>
                <div className={`login-form ${toggleForm === 0 ? "d-block" : "d-none"}`}>
                    <div className="mb-3 row">
                        <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                        <div className="col-12">
                            <input onChange={handleChange} name='email' type="text" className="form-control" id="email" />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                        <div className="col-12">
                            <input onChange={handleChange} name='password' type="password" className="form-control" id="password" />
                        </div>
                    </div>
                    <button onClick={loginHandler}>Login</button>
                    <p className='text-center mt-2'>New User? <Link onClick={() => setToggleForm(1)}>Register Here</Link></p>
                </div>

                <div className={`register-form ${toggleForm === 1 ? "d-block" : "d-none"}`}>
                    <div className="mb-3 row">
                        <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                        <div className="col-12">
                            <input onChange={handleChange} name='name' type="text" className="form-control" id="name" />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                        <div className="col-12">
                            <input onChange={handleChange} name='email' type="text" className="form-control" id="email" />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                        <div className="col-12">
                            <input onChange={handleChange} name='password' type="password" className="form-control" id="password" />
                        </div>
                    </div>
                    <button onClick={registerHandler}>Register</button>
                    <p className='text-center mt-2'>Already a User? <Link onClick={() => setToggleForm(0)}>Login Here</Link></p>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default LandingPage
