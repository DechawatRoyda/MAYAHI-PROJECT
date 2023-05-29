import React, { useState } from 'react'
import axios from 'axios'
import Loader from '../components/Loader'
import Error from '../components/Error'
import bcrypt from 'bcryptjs'

function Loginscreen() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    async function login() {
        const user = { email, password };
        try {
            setLoading(true);
            const result = await axios.post('/api/users/login', user);
            setLoading(false);
            const currentUser = result.data;
            const isPasswordValid = bcrypt.compare(password, currentUser.password);

            if (isPasswordValid) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                window.location.href = '/home';
            } else {
                setError(true);
                alert('Invalid credentials');
            }
        } catch (err) {
            setLoading(false);
            setError(true);
            alert(err.message);
        }
    }

    return (
        <div>
            {loading && <Loader />}
            <div className='row justify-content-center mt-5'>
                <div className='col-md-5 mt-5'>
                    {error && <Error message='Invalid Credentials' />}
                    <div className='bs'>
                        <h2>Login</h2>
                        <input type='text' placeholder='email' className='form-control' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        <input type='password' placeholder='password' className='form-control' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                        <div className='text-center'> <button className='btn  mt-3 mb-3' onClick={login}>Login</button> </div> 
                        <p className='text-center mt-2'>Don't have an account? <a href='/register'>Register</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loginscreen