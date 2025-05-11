import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useUserGoogleMutation } from "../context/service/user.service";
import Cookies from "js-cookie";
const GoogleLoginButton = () => {
    const [userGoogle] = useUserGoogleMutation()
    const handleSuccess = async (credentialResponse) => {
        try {

            const decoded = jwtDecode(credentialResponse.credential);
            const username = decoded.email.split("@")[0];
            const data = {
                user_email: decoded.email,
                user_name: decoded.name,
                user_photo: decoded.picture,
                user_nickname: username,
            }

            const response = await userGoogle(data).unwrap()

            Cookies.set('token', response.token)
            Cookies.set('email', response.email)
            window.location.href = '/'

        } catch (err) {
            console.log(err);

        }

    };

    const handleError = (err) => {
        console.log(err);
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
        />
    );
};

export default GoogleLoginButton;
