import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, tabClasses } from '@mui/material';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@mui/icons-material/Email';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function ResetPassword() {
    const [showPassword, setShowPassword] = React.useState(false);

    let [newPassword, setNewPassword] = useState("")

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };


    const navigate = useNavigate();
    let [email, setEmail] = useState("");

    axios.defaults.withCredentials = true;

    const inputRef = React.useRef([]);
    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
            inputRef.current[index + 1].focus();
        }
    }

    let { backendUrl, userData, sLoggedin,
        getUserData, } = useContext(AppContext);

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

    let [isEmailSent, setIsEmailSent] = useState(false);
    let [otp, setOtp] = useState(0);
    let [isOtpSubmited, setOtpSubmited] = useState(false);


    const handleOtpSend = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;

            let { data } = await axios.post(`${backendUrl}/auth/send-reset-otp`, { email });

            if (data.success) {
                toast.success(data.message);
                setIsEmailSent(true)

            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(err.message)
        }
    }


    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        const otpArray = inputRef.current.map((e) => e.value);
        setOtp(otpArray.join(""))
        setOtpSubmited(true);
        try {

        }
        catch (err) {
            toast.error(err.message);
        }
    }

    const handleResetPaddword = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        try {
            let { data } = await axios.post(`${backendUrl}/auth/reset-password`, { email, otp, newPassword })
            if (data.success) {
                navigate("/login")
                toast.success(data.message);
            } else {
                toast.error(data.message);
                navigate("/reset-password")
            }


        } catch (err) {
            toast.error(err.message)
        }
    }



    return (
        <div>

            {
                !isEmailSent && (
                    <div className=' mt-5 p-5 m-auto' style={{ border: '2px solid green', backgroundColor: "#939ed5", width: "fit-content", borderRadius: "2rem" }}>
                        <h2 className='mt-3 '>Reset  Password</h2>
                        <p className='mt-3 mb-4'>Enter your register email address</p>
                        <form action="" onSubmit={handleOtpSend}>
                            <TextField
                                label={<><EmailIcon />Mail </>} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required /> <br />
                            <Button className='mt-3' size='small' color="success" variant='contained' type='submit' >
                                Send otp
                            </Button>
                        </form>
                    </div>
                )
            }

            {
                !isOtpSubmited && isEmailSent && (
                    <div>
                        <div style={{ border: "2px solid green", padding: "2rem", backgroundColor: "#d7e360", width: "fit-content", borderRadius: "2rem" }}
                            className='p-5 m-auto mt-5'
                        >
                            <h2 className='' >Reset Password OTP  </h2>
                            <p>Enter the 6-digit code sent to your email id </p>
                            <div >
                                <form action="" onSubmit={handleSubmitOtp}  >
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
                                        Submit
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                isOtpSubmited && isEmailSent && (
                    <div className=' mt-5 p-5 m-auto' style={{ border: '2px solid green', backgroundColor: "#939ed5", width: "fit-content", borderRadius: "2rem" }}>
                        <h2 className='mt-3 '>New  Password</h2>
                        <p className='mb-4 mt-3'>Enter new password in below</p>
                        <form action="" onSubmit={handleResetPaddword}>
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    size='small'
                                    required
                                    //  maxRows={4}
                                    label="Password"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }

                                />
                            </FormControl> <br />
                            <Button className='mt-3' size='small' color="success" variant='contained' type='submit' >
                                Reset
                            </Button>
                        </form>
                    </div>
                )
            }




        </div>
    )
}
