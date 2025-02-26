import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Brain, MessageSquare, Sparkles } from 'lucide-react';
import './pageStyles/Home.css';

export default function Home() {
  const letters = "Revana".split("");
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGlow(true);
    }, 1000); // Reduced delay for faster initial glow

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Sentiment Analysis",
      description: "Analyze comments with advanced AI",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Real-time Comments",
      description: "Engage with videos instantly",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Smart Insights",
      description: "Get AI-powered engagement metrics",
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, rotateX: -45 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-[calc(100dvh-60px)] text-white perspective-1000">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -45 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
          className="absolute inset-0 pointer-events-none transform-style-3d"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_100%)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, z: -200 }}
          animate={{ opacity: 1, z: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
          className="text-center z-10 transform-style-3d"
        >
          <h1 className="text-8xl font-bold mb-8 perspective-1000">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                className={`letter inline-block ${glow ? 'glow' : ''}`}
                initial={{ opacity: 0, rotateY: -180, scale: 0.5 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 1.2,
                  type: "spring",
                  bounce: 0.4
                }}
                whileHover={{
                  scale: 1.4,
                  rotateY: 360,
                  color: "#A855F7",
                  transition: { duration: 0.6, type: "spring" }
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
          <motion.p 
            className="text-3xl text-gray-300 mb-10 animated-text font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, type: "spring" }}
          >
            Advanced Semantic Analysis Platform
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.1, rotateY: 15 }}
            whileTap={{ scale: 0.95 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-10 py-5 rounded-full font-semibold text-lg transition-all duration-500 shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] hover:bg-gradient-to-r hover:from-pink-600 hover:via-purple-600 hover:to-pink-600"
            >
              Get Started <ArrowRight className="w-6 h-6 animate-[bounce-x_1s_ease-in-out_infinite]" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotateY: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-10 h-10 text-purple-400" />
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
        >
          Powerful Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 15,
                z: 50,
                transition: { duration: 0.4 }
              }}
              style={{ 
                transformStyle: "preserve-3d",
                perspective: "1500px"
              }}
              className="p-10 rounded-3xl bg-gradient-to-b from-gray-900/90 to-gray-900/50 border border-gray-800/50 backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-700"
            >
              <motion.div 
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 flex items-center justify-center mb-8`}
                whileHover={{ 
                  rotateY: 180,
                  scale: 1.1,
                  transition: { duration: 0.6 }
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{feature.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Floating Particles */}
      <div className="fixed inset-0 pointer-events-none perspective-1000">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${
                i % 3 === 0 ? '#A855F7' : i % 3 === 1 ? '#EC4899' : '#3B82F6'
              }30, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transformStyle: "preserve-3d"
            }}
            animate={{
              x: Array.from({ length: 20 }, () => `${Math.random() * 200 - 100}%`),
              y: Array.from({ length: 20 }, () => `${Math.random() * 200 - 100}%`),
              z: Array.from({ length: 20 }, () => Math.random() * 500 - 250),
              scale: [0.5, Math.random() * 3 + 1, 0.5],
              opacity: [0.1, Math.random() * 0.6 + 0.2, 0.1],
              rotate: Array.from({ length: 20 }, () => Math.random() * 360)
            }}
            transition={{
              duration: Math.random() * 15 + 8,
              repeat: Infinity,
              ease: "linear",
              times: Array.from({ length: 20 }, (_, i) => i / 19)
            }}
          />
        ))}
      </div>
    </div>
  );
}