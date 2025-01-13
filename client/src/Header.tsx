// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "./components/ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { useState, useEffect } from "react";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
// import { setCurrentWidth } from "@/redux/slices/appSlice";
// import { useGoogleSignInMutation, useGithubSignInMutation, useLogoutMutation } from "@/redux/slices/api";
// import { GoogleLogin, googleLogout } from '@react-oauth/google'; // Google OAuth
// import GitHubLogin from 'react-github-login';
// import { FaGithub } from "react-icons/fa";

// export default function Header() {
//   const [sheetOpen, setSheetOpen] = useState<boolean>(false);
//   const windowWidth = useSelector(
//     (state: RootState) => state.appSlice.currentWidth
//   );
//   const dispatch = useDispatch();
//   const isLoggedIn = useSelector(
//     (state: RootState) => state.appSlice.isLoggedIn
//   );
//   const currentUser = useSelector(
//     (state: RootState) => state.appSlice.currentUser
//   );
//   const loginMethod = useSelector(
//     (state: RootState) => state.appSlice.loginMethod // Store the login method (google/github)
//   );

//   const [logout] = useLogoutMutation();
//   const [loginWithGoogle] = useGoogleSignInMutation(); // Mutation hook for Google login
//   const [loginWithGithub] = useGithubSignInMutation(); // Mutation hook for GitHub login

//   const handleResize = () => {
//     dispatch(setCurrentWidth(window.innerWidth));
//   };

//   useEffect(() => {
//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [windowWidth]);

//   const closeSheet = () => {
//     setSheetOpen(false);
//   };

//   const handleLogout = async () => {
//     // Call logout mutation to clear session from the backend
//     await logout();

//     if (loginMethod === 'google') {
//       // If logged in via Google, revoke Google token
//       googleLogout();
//     } else if (loginMethod === 'github') {
//       // If logged in via GitHub, clear session or token
//       console.log('Logged out from GitHub');
//     }

//     // Optional: Reset Redux state for user data, set `isLoggedIn` to false
//     dispatch(setCurrentWidth(0)); // Clear any data if necessary
//   };

//   const navigate = useNavigate();

//   const handleGoogleLoginSuccess = async (credentialResponse: any) => {
//     try {
//       const { credential } = credentialResponse;
//       // Call the Google login mutation
//       const response = await loginWithGoogle({ idToken: credential });
//       // After successful login, set the login method and user data
//       dispatch(setCurrentWidth('google')); // Store login method in Redux
//       navigate('/comments'); // Redirect after Google login success
//     } catch (error) {
//       console.error('Google Login Failed:', error);
//     }
//   };

//   const handleGithubLoginSuccess = async (response: any) => {
//     try {
//       const { code } = response;
//       // Call the GitHub login mutation
//       const responseData = await loginWithGithub({ code });
//       // After successful login, set the login method and user data
//       dispatch(setCurrentWidth('github')); // Store login method in Redux
//       navigate('/comments'); // Redirect after GitHub login success
//     } catch (error) {
//       console.error('GitHub Login Failed:', error);
//     }
//   };

//   return (
//     <nav className="w-full h-[60px] bg-gray-900 text-white p-3 flex justify-between items-center">
//       <Link to="/">
//         <h2 className="font-bold select-none">JScribe Compiler</h2>
//       </Link>
//       {windowWidth > 500 ? (
//         <ul className="flex gap-2">
//           {isLoggedIn ? (
//             <>
//               <li>
//                 <Link to="/my-codes">
//                   <Button variant="blue">My Codes</Button>
//                 </Link>
//               </li>
//               <li>
//                 <Button onClick={handleLogout} variant="destructive">
//                   Logout
//                 </Button>
//               </li>
//             </>
//           ) : (
//             <>
//               <li>
//                 {/* Google Login */}
//                 <GoogleLogin
//                   onSuccess={handleGoogleLoginSuccess}
//                   onError={() => {
//                     console.error('Google Login Failed');
//                   }}
//                 />
//               </li>
//               <li>
//                 {/* GitHub Login */}
//                 <GitHubLogin
//                   clientId="Ov23lid8qgHrG3SmDEJw"
//                   onSuccess={handleGithubLoginSuccess}
//                   onFailure={(error) => console.error('GitHub Login Failed', error)}
//                   redirectUri="http://localhost:5173/comments" // Use the correct redirect URI here
//                   render={(props: any) => (
//                     <button
//                       onClick={props.onClick}
//                       className="w-full py-2 px-4 flex items-center justify-center gap-2 bg-black text-white rounded-md border-2 border-gray-700"
//                     >
//                       <FaGithub size={20} /> {/* GitHub logo icon */}
//                       <span>Sign up with GitHub</span>
//                     </button>
//                   )}
//                 />
//               </li>
//               <li>
//                 <Link to="/signup">
//                   <Button variant="blue">Signup</Button>
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>
//       ) : (
//         <div className="flex gap-2 justify-center items-center">
//           <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
//             <SheetTrigger asChild>
//               <Button>
//                 <GiHamburgerMenu />
//               </Button>
//             </SheetTrigger>
//             <SheetContent className="w-full">
//               <ul className="flex flex-col gap-2">
//                 {isLoggedIn ? (
//                   <>
//                     <li>
//                       <Link to="/my-codes">
//                         <Button className="w-full" variant="blue">
//                           My Codes
//                         </Button>
//                       </Link>
//                     </li>
//                     <li>
//                       <Button onClick={handleLogout} className="w-full" variant="destructive">
//                         Logout
//                       </Button>
//                     </li>
//                   </>
//                 ) : (
//                   <>
//                     <li>
//                       <GoogleLogin
//                         onSuccess={handleGoogleLoginSuccess}
//                         onError={(error) => console.log('Google Login Failed', error)}
//                       />
//                     </li>
//                     <li>
//                       <GitHubLogin
//                         onSuccess={handleGithubLoginSuccess}
//                         onFailure={(error) => console.log('GitHub Login Failed', error)}
//                       />
//                     </li>
//                     <li>
//                       <Link to="/signup">
//                         <Button className="w-full" variant="blue">
//                           Signup
//                         </Button>
//                       </Link>
//                     </li>
//                   </>
//                 )}
//               </ul>
//             </SheetContent>
//           </Sheet>
//         </div>
//       )}
//     </nav>
//   );
// }





import { Link, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import { setCurrentWidth } from "@/redux/slices/appSlice";
import { googleLogout } from '@react-oauth/google';

export default function Header() {
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const windowWidth = useSelector(
    (state: RootState) => state.appSlice.currentWidth
  );
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => state.appSlice.isLoggedIn
  );
  const currentUser = useSelector(
    (state: RootState) => state.appSlice.currentUser
  );
  const loginMethod = useSelector(
    (state: RootState) => state.appSlice.loginMethod
  );

  const navigate = useNavigate();

  const handleResize = () => {
    dispatch(setCurrentWidth(window.innerWidth));
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  const closeSheet = () => {
    setSheetOpen(false);
  };

  const handleLogout = () => {
    if (loginMethod === 'google') {
      googleLogout();
    } else if (loginMethod === 'github') {
      console.log('Logged out from GitHub');
    }
    // Reset Redux state for user data, set `isLoggedIn` to false if necessary
    dispatch(setCurrentWidth(0)); // Clear any data if necessary
  };

  return (
    <nav className="w-full h-[60px] bg-gray-900 text-white p-3 flex justify-between items-center">
      <Link to="/">
        <h2 className="font-bold select-none">JScribe Compiler</h2>
      </Link>
      {windowWidth > 500 ? (
        <ul className="flex gap-2">
          {isLoggedIn ? (
            <>
              <li>
                <Button onClick={handleLogout} variant="destructive">
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signup">
                  <Button variant="blue">Signup</Button>
                </Link>
              </li>
            </>
          )}
        </ul>
      ) : (
        <div className="flex gap-2 justify-center items-center">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <GiHamburgerMenu />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full">
              <ul className="flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <li>
                      <Button onClick={handleLogout} className="w-full" variant="destructive">
                        Logout
                      </Button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/signup">
                        <Button className="w-full" variant="blue">
                          Signup
                        </Button>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </nav>
  );
}
