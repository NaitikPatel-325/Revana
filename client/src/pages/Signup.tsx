import { useGoogleSignInMutation } from '@/redux/slices/api';
import { updateCurrentUser, updateIsLoggedIn, updateLoginMethod } from '@/redux/slices/appSlice';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Bot, Key, Lock, UserCircle2 } from 'lucide-react';
import Cookies from "js-cookie";
import { useDispatch } from 'react-redux';

const Signup = () => {
  const dispatch = useDispatch();
  const [loginWithGoogle] = useGoogleSignInMutation();

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
  
    } catch (error) {
      console.error("Google Login Failed:", error);
    }
  };

  const features = [
    {
      icon: <UserCircle2 className="w-6 h-6" />,
      title: "Smart Profile",
      description: "Personalized experience based on your interactions"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Analysis",
      description: "Advanced sentiment analysis of comments"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Access",
      description: "Your data is protected with industry-standard security"
    }
  ];

  return (
    <div className="grid-bg w-full min-h-[calc(100vh-60px)] flex justify-center items-center py-16 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left Side - Features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block space-y-10"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to Revana
          </motion.h2>
          
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-6 p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm"
              >
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-lg">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Sign Up Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg mx-auto"
        >
          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 shadow-xl"
            whileHover={{ boxShadow: "0 0 30px rgba(147, 51, 234, 0.2)" }}
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Key className="w-16 h-16 mx-auto mb-6 text-purple-500" />
              </motion.div>
              <h1 className="text-4xl font-bold mb-4">Sign Up</h1>
              <p className="text-gray-400 text-lg mb-8">
                Join our community of expert developers 👨‍💻
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center w-full"
            >
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => console.error("Google Login Failed")}
                  theme="filled_black"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="300"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-500/20 rounded-full"
          animate={{
            x: ["0%", "100%", "0%"],
            y: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            ease: "linear",
            delay: -Math.random() * 20,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default Signup;