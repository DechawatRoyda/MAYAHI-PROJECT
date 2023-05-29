import React, { useState } from 'react'
import axios from 'axios'
import Loader from '../components/Loader'
import Error from '../components/Error'
import Success from '../components/Success'

function Registerscreen() {

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [cpassword,setCpassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    async function register(){
        if(name === '' || email === '' || password === '' || cpassword === ''){
            alert('Please fill all the fields')
            return
        }
        if(password === cpassword){
            var user = {name,email,password}
            try{
                setLoading(true)
                let result = await axios.post('/api/users/register',user)
                setLoading(false)
                setSuccess(true)
                window.location.href = '/login'
            }catch(err){            
                alert(err)
                setLoading(false)
                setError(true)
                setName('')
                setEmail('')
                setPassword('')
                setCpassword('')
            }
        }
        else{
            alert('Passwords not matched')
        }
    }

  return (
    <div>
        {loading && <Loader/>}
        <div className='row justify-content-center mt-5'>
            <div className='col-md-5 mt-5'>
            {success && <Success message='Registeration Success'/>}
            {error && <Error/>}
                <div className='bs'>
                    <h2>Register</h2>
                    <input type='text' placeholder='name' className='form-control' value={name} onChange={(e)=>{setName(e.target.value)}} />
                    <input type='text' placeholder='email' className='form-control' value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                    <input type='password' placeholder='password' className='form-control' value={password} onChange={(e)=>{setPassword(e.target.value)}} />
                    <input type='password' placeholder='confirm password' className='form-control' value={cpassword} onChange={(e)=>{setCpassword(e.target.value)}} />

                    <div className='text-center'> <button className='btn mt-3 mb-3' onClick={register}>Register</button></div> 
                    
                    <p className='text-center mt-2'>Already have an account? <a href='/login'>Login</a></p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Registerscreen