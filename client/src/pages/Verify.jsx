import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { Button } from 'antd';
import { useResendOtpMutation, useVerifyUserMutation } from '../context/service/user.service';
import { BsArrowLeft } from 'react-icons/bs';

const Verify = () => {
    const [verifyOtp, { isLoading: sendLoading }] = useVerifyUserMutation()
    const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation()
    const location = useLocation()
    const [otp, setOtp] = useState('');
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const [error, setError] = useState('')

    if (!email) {
        window.location.href = '/'
    }

    async function handleSendOtp() {
        if (otp.length < 6) {
            setError('Kodni to\'liq kiriting')
            return
        } else {
            setError('')
        }
        try {
            const data = {
                otp,
                user_email: email
            }
            const res = await verifyOtp(data)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('email', res.data.email)
            localStorage.setItem('user_id', res.data.user_id)
            window.location.href = '/'
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='auth'>
            <div className="auth_body">
                <button onClick={() => window.location.href = '/'} style={{ background: "transparent", alignItems: "center", cursor: "pointer", width: "30px", height: "30px", marginBottom: "15px", display: "flex", alignSelf: "start", border: "none" }}>
                    <BsArrowLeft size={25} />
                </button>
                <p style={{ marginBottom: "15px", fontSize: "15px", color: "#000" }}><mark>{email}</mark> ga yuborilgan 6 xonali kodni kiriting</p>
                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    containerStyle={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}
                    inputStyle={!error ? { width: "45px", height: "45px", borderRadius: "6px", border: "1px solid #757575" } : { width: "45px", height: "45px", borderRadius: "6px", border: "1px solid red" }}
                    renderInput={(props) => <input type='number' className='otp_input' {...props} />}
                />
                <p style={{ color: "red" }}>{error}</p>
                <Button loading={sendLoading} onClick={handleSendOtp} type='primary' style={{ width: "100%", height: '40px', borderRadius: "0px", marginTop: "15px" }}>Yuborish</Button>
                <Button loading={resendLoading} style={{ width: "100%", height: '40px', borderRadius: "0px", marginTop: "15px" }}>Kodni qayta olish</Button>
            </div>
        </div>
    );
};


export default Verify;