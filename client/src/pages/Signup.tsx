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
      description: "Personalized experience based on your interactions",
      gradient: "from-blue-400 to-indigo-600"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Analysis", 
      description: "Advanced sentiment analysis of comments",
      gradient: "from-purple-400 to-pink-600"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Access",
      description: "Your data is protected with industry-standard security",
      gradient: "from-emerald-400 to-cyan-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="grid-bg w-full min-h-[calc(100vh-60px)] flex justify-center items-center py-16 px-4 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_100%)] pointer-events-none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2 }}
      />

      <div className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Side - Enhanced Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:block space-y-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Welcome to Revana
            </h2>
            <p className="text-xl text-gray-400 mt-4">Experience the next generation of comment analysis</p>
          </motion.div>
          
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, translateX: 10 }}
                className="flex items-start gap-6 p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
              >
                <motion.div 
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 flex items-center justify-center shrink-0`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-lg">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Enhanced Sign Up Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg mx-auto"
        >
          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 shadow-xl relative overflow-hidden"
            whileHover={{ boxShadow: "0 0 40px rgba(147, 51, 234, 0.3)" }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
              animate={{ 
                background: ["rgba(147, 51, 234, 0.1)", "rgba(236, 72, 153, 0.1)"],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            />
            
            <div className="text-center mb-12 relative">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ rotate: 180 }}
              >
                <Key className="w-16 h-16 mx-auto mb-6 text-purple-500" />
              </motion.div>
              <motion.h1 
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent p-10 "
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                Sign Up
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center w-full"
            >
              <motion.div 
                className="w-full flex justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => console.error("Google Login Failed")}
                  theme="filled_black"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="300"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Animated Background Elements */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`,
          }}
          animate={{
            x: ["0%", "100%", "0%"],
            y: ["0%", "100%", "0%"],
            scale: [1, 1.5, 1],
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
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
};

export default Signup;