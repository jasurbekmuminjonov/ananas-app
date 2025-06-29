import { Button, Form, Input } from 'antd'
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useCheckNicknameMutation, useCreateUserMutation, useUserGoogleMutation } from '../context/service/user.service';

const Register = () => {
    const [form] = Form.useForm()
    const [userGoogle] = useUserGoogleMutation()
    const [checkNickname] = useCheckNicknameMutation()
    const [createUser] = useCreateUserMutation()

    const userData = JSON.parse(localStorage.getItem('user_data'))


    const handleSubmit = async (values) => {
        try {
            if (userData) {
                const res = await userGoogle({ user_email: userData.user_email, user_photo: userData.user_photo, user_nickname: values.user_nickname })
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('email', res.data.email)
                localStorage.setItem('user_id', res.data.user_id)
                window.location.href = '/'

            } else {

                const formData = new FormData();

                formData.append('user_email', values.user_email);
                formData.append('user_nickname', values.user_nickname);
                formData.append('user_password', values.user_password);

                if (values.user_photo) {
                    formData.append('user_photo', values.user_photo);
                }
                const res = await createUser(formData)
                window.location.href = `/verify?email=${res.data.email}`
            }
        } catch (err) {
            console.log(err);

        }
    };


    return (
        <div className='auth'>
            <div className="auth_body">
                <h3>Yangi hisob yaratish</h3>
                <Form autoComplete='off' onFinish={handleSubmit} style={{ width: "100%" }} layout="vertical" form={form}>
                    <Form.Item initialValue={userData ? userData.user_email : null} label="Email" name='user_email' required rules={[
                        { required: true, message: "Emailni kiriting" },
                        { type: "email", message: "To'g'ri email manzilini kiriting" }
                    ]}>
                        <Input disabled={userData} style={{ height: "40px", borderRadius: "0px" }} placeholder="Email kiriting" type="email" />
                    </Form.Item>
                    <Form.Item
                        required
                        label="Foydalanuvchi nomi"
                        name='user_nickname'
                        rules={[
                            { required: true, message: "Foydalanuvchi nomini kiriting" },
                            {
                                pattern: /^[a-z0-9._]+$/,
                                message: "Faqat kichik harflar, raqamlar, nuqta va pastki chiziq (_) bo'lishi mumkin"
                            },
                            {
                                validator: async (_, value) => {
                                    if (!value) return Promise.resolve();
                                    try {
                                        const res = await checkNickname({ nickname: value }).unwrap();
                                        if (!res.isSelectable) {
                                            return Promise.reject("Bu foydalanuvchi nomi band");
                                        }
                                        return Promise.resolve();
                                    } catch (err) {
                                        console.error(err);
                                        return Promise.reject("Server bilan xatolik");
                                    }
                                }
                            }
                        ]}
                    >
                        <Input style={{ height: "40px", borderRadius: "0px" }} placeholder="Foydalanuvchi nomi kiriting" type="text" />
                    </Form.Item>
                    {/* <Form.Item valuePropName="file"
                        getValueFromEvent={e => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e && e.target ? e.target.files[0] : null;
                        }} name='user_photo' label='Profil rasmi'>
                        <Input disabled={userData} type="file" style={{ height: "40px", borderRadius: "0px" }} />
                    </Form.Item> */}
                    <Form.Item label="Parol" name='user_password' required rules={!userData ? [
                        { required: true, message: "Parolni kiriting" }
                    ] : []}>
                        <Input.Password disabled={userData} style={{ height: "40px", borderRadius: "0px" }} placeholder="Parol kiriting" />
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ width: "100%", height: '40px', borderRadius: "0px" }} type="primary" htmlType="submit">
                            Hisob yaratish
                        </Button>
                    </Form.Item>
                </Form>
                <div className="auth_footer">
                    <p>YOKI</p>
                    <GoogleLoginButton />
                    <p>Allaqachon hisobingiz bormi? <a href="/">Hisobga kirish</a></p>
                </div>
            </div>
        </div >
    );
};

export default Register;