import { motion } from "framer-motion";

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="perspective-1000"
    >
      <motion.h2 
        className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ y: -30, opacity: 0, rotateX: -90 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      >
        {title}
      </motion.h2>
      <motion.div 
        className="relative w-full rounded-xl overflow-hidden shadow-2xl transform-gpu"
        style={{ paddingBottom: "56.25%" }}
        initial={{ scale: 0.95, rotateY: -15 }}
        animate={{ scale: 1, rotateY: 0 }}
        whileHover={{ 
          scale: 1.02,
          rotateY: 5,
          boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.25)"
        }}
        transition={{ 
          duration: 0.6, 
          type: "spring",
          stiffness: 200
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
          animate={{ 
            background: ["rgba(147, 51, 234, 0.1)", "rgba(236, 72, 153, 0.1)"],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        />
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </motion.div>
    </motion.div>
  );
}