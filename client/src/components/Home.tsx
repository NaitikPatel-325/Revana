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
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Sentiment Analysis",
      description: "Analyze comments with advanced AI"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Real-time Comments",
      description: "Engage with videos instantly"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Smart Insights",
      description: "Get AI-powered engagement metrics"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-[calc(100dvh-60px)] text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <h1 className="text-6xl font-bold mb-6">
            {letters.map((letter, index) => (
              <span
                key={index}
                className={`letter ${glow ? 'glow' : ''}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <p className="text-xl text-gray-400 mb-8 animated-text">
            Advanced Semantic Analysis Platform
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full font-medium transition-colors duration-300"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 py-20"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
        >
          Powerful Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
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
    </div>
  );
}