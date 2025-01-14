import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import GitHubLogin from 'react-github-login';
import { FaGithub } from 'react-icons/fa'; // GitHub logo icon from react-icons
import { useGoogleSignInMutation, useGithubSignInMutation } from "@/redux/slices/api";
import { setCurrentWidth, updateIsLoggedIn } from "@/redux/slices/appSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginWithGoogle] = useGoogleSignInMutation(); // Mutation hook for Google login
  const [loginWithGithub] = useGithubSignInMutation(); // Mutation hook for GitHub login

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      console.log(credentialResponse);
      const { credential } =  credentialResponse; // Await the credentialResponse itself
      const response = await loginWithGoogle({ idToken: credential });
      dispatch(updateIsLoggedIn(true));
      console.log(response);
      navigate('/comments'); 
    } catch (error) {
      console.error('Google Login Failed:', error);
    }
  };

  const handleGithubLoginSuccess = async (response: any) => {
    try {
      const { code } = response;
      const responseData = await loginWithGithub({ code });
      dispatch(updateIsLoggedIn(true));
      navigate('/comments'); // Redirect after GitHub login success
    } catch (error) {
      console.error('GitHub Login Failed:', error);
    }
  };

  return (
    <div className="__signup grid-bg w-full h-[calc(100dvh-60px)] flex justify-center items-center flex-col">
      <div className="__form_controller bg-black border-[1px] py-8 px-4 flex flex-col gap-5 w-[300px]">
        <h1 className="font-mono text-4xl font-bold text-center">Signup</h1>
        <p className="font-mono text-xs text-center">
          Join the community of expert frontend developers 👨‍💻
        </p>

        {/* Google Login */}
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            console.error('Google Login Failed');
          }}
        />

        {/* GitHub Login */}
        <GitHubLogin
          clientId="Ov23lid8qgHrG3SmDEJw"
          onSuccess={handleGithubLoginSuccess}
          onFailure={(error) => console.error('GitHub Login Failed', error)}
          redirectUri="http://localhost:5173/comments" // Use the correct redirect URI here
          render={(props: any) => (
            <button
              onClick={props.onClick}
              className="w-full py-2 px-4 flex items-center justify-center gap-2 bg-black text-white rounded-md border-2 border-gray-700"
            >
              <FaGithub size={20} /> {/* GitHub logo icon */}
              <span>Sign up with GitHub</span>
            </button>
          )}
        />
      </div>
    </div>
  );
};

export default Signup;
