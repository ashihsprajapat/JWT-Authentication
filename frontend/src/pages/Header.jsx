import React, { useContext } from 'react'
import Button from '@mui/material/Button';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

export default function Header() {

    const { userData } = useContext(AppContext);
    console.log(userData)
    return (
        <div className='row'>


            <div className=' mt-5 header_hero m-auto p-5' >
                <h1 className=' mt-4 mb-4 ' >Hi {userData ? userData.name : "Developer"} !  </h1>
                <h2>Welcome to my website</h2>
                <p className='mb-4'>
                    Let's start with a quick product tour and we will have you and running in no time!
                </p>
                <Button onClick={() => toast.success("fuck")} variant="contained" className='m-auto ' color="success">Get Started</Button>
            </div>
        </div>
    )
}
