import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Brain, MessageSquare, Sparkles } from 'lucide-react';
import './pageStyles/Home.css';

export default function Home() {
  const letters = "Revana".split("");
  const [glow, setGlow] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handlePortalClick = () => {
    setIsTransitioning(true);
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
          
          {/* Interactive 3D Portal */}
          <div onClick={handlePortalClick}>
            <motion.div
              className="relative w-96 h-48 mx-auto perspective-2000 cursor-pointer group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/30 via-pink-800/30 to-purple-900/30 backdrop-blur-xl"
                whileHover={{ 
                  scale: 1.05,
                  rotateX: 10,
                  rotateY: 5,
                  transition: { duration: 0.4 }
                }}
                animate={isTransitioning ? {
                  scale: [1, 2],
                  rotate: [0, 720],
                  opacity: [1, 0],
                } : {}}
                transition={isTransitioning ? {
                  duration: 1,
                  ease: "easeInOut"
                } : {}}
              >
                {/* Portal Effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={isTransitioning ? {
                    background: [
                      "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.4) 0%, transparent 60%)",
                      "radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"
                    ],
                    scale: [1, 20]
                  } : {
                    background: [
                      "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.4) 0%, transparent 60%)",
                      "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.4) 0%, transparent 60%)",
                      "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.4) 0%, transparent 60%)"
                    ]
                  }}
                  transition={isTransitioning ? {
                    duration: 1,
                    ease: "easeInOut"
                  } : { duration: 3, repeat: Infinity }}
                />
                
                {/* Floating Particles */}
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={isTransitioning ? {
                      scale: [1, 3],
                      opacity: [1, 0],
                      rotate: [0, 360],
                    } : {
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                      y: [-20, 20],
                    }}
                    transition={isTransitioning ? {
                      duration: 1,
                      ease: "easeInOut"
                    } : {
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}

                <motion.div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span 
                    className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.1 }}
                  >
                    Enter the Portal
                  </motion.span>
                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <ArrowRight className="w-8 h-8 text-white/70 group-hover:text-white/90 transition-colors" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
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
        {[...Array(40)].map((_, i) => {
          const randomX = Math.random() * window.innerWidth;
          const randomY = Math.random() * window.innerHeight;
          const randomDuration = Math.random() * 10 + 10;
          const randomDelay = Math.random() * -20;
          
          return (
            <motion.div
              key={i}
              className="absolute w-6 h-6 rounded-full"
              style={{
                background: `radial-gradient(circle at center, ${
                  i % 3 === 0 ? '#A855F7' : i % 3 === 1 ? '#EC4899' : '#3B82F6'
                }50, transparent)`,
                left: randomX,
                top: randomY,
                transformStyle: "preserve-3d"
              }}
              animate={{
                x: [
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100
                ],
                y: [
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100
                ],
                scale: [0.5, 1.5, 0.8, 1.2],
                opacity: [0.3, 0.6, 0.4, 0.5],
                rotate: [0, 180, 270, 360]
              }}
              transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "linear",
                times: [0, 0.33, 0.66, 1]
              }}
            />
          );
        })}
      </div>

      {/* Transition Overlay */}
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 bg-white z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => {
            setTimeout(() => {
              window.location.href = '/signup';
            }, 500);
          }}
        />
      )}
    </div>
  );
}