import { Button, Form, Input } from 'antd'
import { FiLogIn } from "react-icons/fi";
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useLoginUserMutation } from '../context/service/user.service';

const Login = () => {
    const [form] = Form.useForm()
    const [loginUser, { isLoading, data, error, isError }] = useLoginUserMutation()
    async function handleSubmit(values) {
        try {
            const res = await loginUser(values)
            console.log(res);
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
                <h3>Hisobingizga kiring</h3>
                <Form autoComplete='off' onFinish={handleSubmit} style={{ width: "100%" }} layout="vertical" form={form}>
                    <Form.Item label="Email" name='user_email' required rules={[
                        { required: true, message: "Emailni kiriting" },
                        { type: "email", message: "To'g'ri email manzilini kiriting" }
                    ]}>
                        <Input style={{ height: "40px", borderRadius: "0px" }} placeholder="Email kiriting" type="email" />
                    </Form.Item>
                    <Form.Item label="Parol" name='user_password' required rules={[
                        { required: true, message: "Parolni kiriting" }
                    ]}>
                        <Input.Password style={{ height: "40px", borderRadius: "0px" }} placeholder="Parol kiriting" />
                    </Form.Item>
                    <Form.Item>
                        <Button loading={isLoading} style={{ width: "100%", height: '40px', borderRadius: "0px" }} icon={<FiLogIn />} type="primary" htmlType="submit">
                            Kirish
                        </Button>
                        <p style={{ color: "red" }}>{error?.data.message}</p>
                    </Form.Item>
                </Form>
                <div className="auth_footer">

                    <p>YOKI</p>
                    <GoogleLoginButton />
                    <p>Hali hisobingiz yo'qmi? <a href="/register">Yangi hisob yaratish</a></p>
                </div>
            </div>
        </div >
    );
};

export default Login;