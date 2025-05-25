import GoogleLogin from "react-google-login";
import { useCheckGoogleMutation, useUserGoogleMutation } from "../context/service/user.service";
import { FcGoogle } from "react-icons/fc";
import { gapi } from "gapi-script";
import { useEffect } from 'react';
const GoogleLoginButton = () => {
    const [userGoogle] = useUserGoogleMutation()
    const [checkGoogle] = useCheckGoogleMutation()

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: '781252775123-6du9tno7el7e62rd28ve6a4tnjrmqvtk.apps.googleusercontent.com',
                scope: "",
            });
        }
        gapi.load("client:auth2", start);
    }, []);

    return (
        <GoogleLogin
            clientId={'781252775123-6du9tno7el7e62rd28ve6a4tnjrmqvtk.apps.googleusercontent.com'}
            buttonText="Google bilan davom etish"
            onSuccess={async (res) => {

                try {
                    const isExist = await checkGoogle({ user_email: res.profileObj.email })
                    if (isExist.data) {
                        const response = await userGoogle({ user_email: res.profileObj.email })
                        localStorage.setItem('token', response.data.token)
                        localStorage.setItem('email', response.data.email)
                        localStorage.setItem('user_id', response.data.user_id)
                        window.location.href = '/'
                    } else {
                        localStorage.setItem('user_data', JSON.stringify({
                            user_email: res.profileObj.email,
                            user_photo: res.profileObj.imageUrl
                        }))
                        window.location.href = '/register'
                    }
                } catch (err) {
                    console.log(err);
                }
            }}
            onFailure={(res) => {
            }}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
                <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
                    <FcGoogle size={20} />
                    Google bilan davom etish
                </button>
            )}
        />
    );
};

export default GoogleLoginButton;
