import React, { useEffect } from 'react'
import Button from '@mui/material/Button';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function EmailVarify() {

    axios.defaults.withCredentials = true;

    const inputRef = React.useRef([]);
    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
            inputRef.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRef.current[index - 1].focus();
        }
    }


     const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        const pasteArray = pastedText.split('');

        if (pasteArray.length === 6) {
            pasteArray.forEach((char, index) => {
                if (inputRef.current[index]) {
                    inputRef.current[index].value = char;
                }
            });
            // After pasting, move focus to the next available input
            if (inputRef.current[5]) {
                inputRef.current[5].focus();
            }
        }
    }

    const { backendUrl, userData, isLoggedin, getUserData } = useContext(AppContext)

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const otpArray = inputRef.current.map((e) => e.value);
            const otp = otpArray.join("");

            const { data } = await axios.post(`${backendUrl}/auth/verify-accound`, {
                otp
            })

            if (data.success) {
                navigate("/");
                toast.success(data.message)
                getUserData();
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(err.message)
        }
    }

    useEffect(() => {
        isLoggedin && userData && userData.isAccountVerify && navigate("/");
    })


    return (
        <div style={{ border: "2px solid green", padding: "2rem", backgroundColor: "#d7e360", width: "fit-content", borderRadius: "2rem" }}
            className='p-5 m-auto mt-5'
        >
            <h2 className='' >Email varify OTP </h2>
            <p>Enter the 6-digit code sent to your email id </p>
            <div >
                <form action="" onSubmit={handleSubmit}  >
                    <div className='' onPaste={handlePaste} >
                        {
                            Array(6).fill(0).map((_, index) => {
                                return (<input className='p-2 m-2' style={{ width: "5rem", borderRadius: "0.4rem" }} type="text" maxLength={1} name="" key={index} id="" required
                                    ref={e => inputRef.current[index] = e}
                                    onInput={(e) => handleInput(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />)
                            })
                        }
                    </div>
                    <Button type='submit' className='mt-5' variant="contained" color='success'  >
                        Verify Email
                    </Button>
                </form>

            </div>

        </div>
    )
}



