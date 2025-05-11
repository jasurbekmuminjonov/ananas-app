import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Auth = () => {
    return (
        <div className='auth'>
            <GoogleOAuthProvider clientId="781252775123-6du9tno7el7e62rd28ve6a4tnjrmqvtk.apps.googleusercontent.com">
                    <GoogleLoginButton />
            </GoogleOAuthProvider>
        </div>
    );
};


export default Auth;