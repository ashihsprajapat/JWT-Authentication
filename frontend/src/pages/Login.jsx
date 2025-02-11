import React, { useContext, useState } from 'react'
import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import "./loginForm.css"
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';


export const Login = () => {
    let navigate = useNavigate();


    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);


    let [state, setState] = useState("signup")

    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    let colorStyle = {
        '& .MuiInputLabel-root': {
            color: 'black',
            // label color
        },
        '& .MuiInputBase-root': {
            color: 'black',
            background: "gray" // input text color
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
        },
    }

    let handleSubmit = async (event) => {
        try {
            event.preventDefault();
            axios.defaults.withCredentials = true;

            if (state === "signup") {
                const url = `${backendUrl}/auth/register`;
                let { data } = await axios.post(`${url}`, {
                    name,
                    email,
                    password,
                })
                if (data.success) {
                    setIsLoggedin(true);
                    getUserData();
                    navigate("/");
                    toast.success(data.message)
                } else {
                    toast.error(data.message)
                }

            } else {
                const url = `${backendUrl}/auth/login`
                let { data } = await axios.post(`${url}`, {
                    email,
                    password,
                })
                if (data.success) {
                    setIsLoggedin(true);
                    getUserData();
                    navigate("/");
                    toast.success(data.message)
                } else {
                    toast.error(data.message);
                }
            }

        } catch (err) {
            toast.error(err.message)
        }
    }


    return (
        <div className='login'>
            <form action="" onSubmit={handleSubmit} >
                <div className="row">

                    <div className='border loginForm col-sm-11 col-lg-3 col-md-6 m-auto mt-5 ' >
                        <h2>{state === "signup" ? "Create  account" : "Login "}</h2>
                        <p>
                            {state === "signup" ? "Create your account" : "Login Account"}
                        </p>
                        {state === "signup" && (
                            <TextField
                                id="outlined-multiline-flexible"
                                label={<><PersonIcon />Full Name </>}
                                // multiline
                                size='small'
                                maxRows={4}
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                required
                                sx={colorStyle}
                                className='m-2'
                            />
                        )}
                        <br />
                        <TextField
                            sx={colorStyle}
                            id="outlined-multiline-flexible"
                            label={<><EmailIcon />Mail </>}
                            // multiline
                            size='small'
                            maxRows={4}
                            className='m-2'
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <br />
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                size='small'
                                required
                                //  maxRows={4}
                                sx={colorStyle}
                                label="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
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
                        </FormControl>
                        <br />
                        <p onClick={() => navigate("/reset-password")} style={{ color: "blue", cursor: 'pointer' }} className='forget'>Forgot password ?</p>
                        <Button color="secondary" variant='contained' type='submit'>
                            {
                                state === "signup" ? "register" : "Login"
                            }
                        </Button>
                        {state === "signup" ?
                            (<p>Already have Accound <span onClick={() => setState("login")} className='forget' style={{ color: "blue", cursor: 'pointer' }} >Login here</span></p>)
                            :
                            (<p>Don't have Accound <span onClick={() => setState("signup")} className='forget' style={{ color: "blue", cursor: 'pointer' }} >Sign up</span></p>)}


                    </div>

                </div>
            </form>

        </div>
    )
}
