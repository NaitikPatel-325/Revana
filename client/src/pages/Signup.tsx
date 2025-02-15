import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import GitHubLogin from "react-github-login";
import { FaGithub } from "react-icons/fa";
import { useGoogleSignInMutation, useGithubSignInMutation } from "@/redux/slices/api";
import { updateIsLoggedIn, updateCurrentUser, updateLoginMethod } from "@/redux/slices/appSlice";
import Cookies from "js-cookie";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginWithGoogle] = useGoogleSignInMutation();
  const [loginWithGithub] = useGithubSignInMutation();

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      const data = await loginWithGoogle({ idToken: credential }).unwrap();
  
      console.log("Google Login Response:", data);
      const { token, user } = data;
  
      Cookies.set("token", token, { expires: 7 });
  
      dispatch(updateCurrentUser(user));
      dispatch(updateIsLoggedIn(true));
      dispatch(updateLoginMethod("google"));
  
      navigate("/comments", { replace: true }); 
    } catch (error) {
      console.error("Google Login Failed:", error);
    }
  };

  const handleGithubLoginSuccess = async (response: any) => {
    try {
      console.log("GitHub Response:", response);
      
      const { code } = response;
      if (!code) throw new Error("GitHub authorization code is missing");
  
      console.log("Sending code to backend:", code); // ✅ Debug log
      
      const result = await loginWithGithub({ code }).unwrap();
      console.log("GitHub API Response:", result);
      
      if (!result || !result.token || !result.user) {
        throw new Error("Invalid response from server");
      }
  
      Cookies.set("token", result.token, { expires: 7 });
  
      dispatch(updateCurrentUser(result.user));
      dispatch(updateIsLoggedIn(true));
      dispatch(updateLoginMethod("github"));
  
      navigate("/comments", { replace: true });
    } catch (error) {
      console.error("GitHub Login Failed:", error);
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
          onError={() => console.error("Google Login Failed")}
        />

        {/* GitHub Login */}
        <GitHubLogin
        clientId={import.meta.env.VITE_GITHUB_CLIENT_ID} // Use env variable
        onSuccess={handleGithubLoginSuccess}
        onFailure={(error: any) => console.error("GitHub Login Failed", error)}
        // ❌ REMOVE THIS LINE
        redirectUri="http://localhost:5173/comments"
        render={(props: any) => (
          <button
            onClick={props.onClick}
            className="w-full py-2 px-4 flex items-center justify-center gap-2 bg-black text-white rounded-md border-2 border-gray-700"
          >
            <FaGithub size={20} />
            <span>Sign up with GitHub</span>
          </button>
        )}
      />

      </div>
    </div>
  );
};

export default Signup;
