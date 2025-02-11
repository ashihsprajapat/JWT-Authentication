import React, { useContext } from 'react'
import Button from '@mui/material/Button';
import { Link } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function NavBar() {
    const navigate = useNavigate();
    const { backendUrl, userData, setIsLoggedin,
        setUserData } = useContext(AppContext);

    const handleLogout = async () => {
        axios.defaults.withCredentials = true;
        try {
            let { data } = await axios.post(`${backendUrl}/auth/logout`);
            console.log(data);
            data.success && setIsLoggedin(false)
            data.success && setUserData(false);
            navigate("/");
            toast.success("log Out Successfull")

        } catch (err) {
            toast.err(err.message)
        }

    }


    let sendVerificationOTP = async () => {
        try {
            axios.defaults.withCredentials = true;
            let { data } = await axios.post(`${backendUrl}/auth/send-verifiy-otp`);
            if (data.success) {
                navigate("/email-verify")
                toast.success(data.message)
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(err.message);
        }
    }


    return (
        <div className='p-2 mt-3 border-bottom  ' style={{ display: 'flex', justifyContent: 'space-between', marginLeft: "2rem", marginRight: "2rem" }} >
            <div>
                <p className='fs-4  ' >
                    MERN Auth
                </p>

            </div>

            {
                userData ?
                    <div className='p-2 group position-relative'  >
                        {userData.name[0].toUpperCase()}
                        <div >
                            <ul  >
                                {
                                    !userData.isAccountVerify && <li
                                        onClick={sendVerificationOTP} className='p-2' style={{ listStyle: "none" }}>
                                        Verify Email
                                    </li>
                                }

                                <li onClick={handleLogout} className='p-2' style={{ listStyle: "none" }}>
                                    Logout
                                </li>
                            </ul>

                        </div>
                    </div>

                    : <>


                        <Button onClick={() => navigate("/login")} variant="outlined" size='small' >
                            Login <ArrowForwardIcon />
                        </Button>
                    </>
            }


        </div>
    )
}
