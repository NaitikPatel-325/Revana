import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserDetailsQuery } from "@/redux/slices/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentVideo } from "@/redux/slices/appSlice";
import VideoPage from "./videopage";
import { ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";
import { RootState } from "@/redux/store";
import { Navigate } from "react-router-dom";

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
}

interface Comment {
  author: string;
  text: string;
  profileImage: string;
  email?: string;
}

export default function VideoSearch() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const isLoggedIn = useSelector((state: RootState) => state.appSlice.isLoggedIn);
  
  const { data, isSuccess } = useGetUserDetailsQuery();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const videoId = searchParams.get("videoId");
    if (videoId) {
      navigate(`/comments/videos/?videoId=${videoId}`); 
    }
  }, [navigate, searchParams]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await axios.get<{ videos: Video[] }>(
        `http://localhost:4000/user/comments/videos/search?query=${searchQuery}`
      );
      setVideos(response.data.videos);
      setSelectedVideo(null);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVideoClick = async (video: Video) => {
    if (isSuccess) {
      setSelectedVideo(video);
      setComments([]);
      setNextPageToken(null);

      const VideoData = {
        videoId: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        channel: video.channel,
        descriptions: {Pd: "", Nd: ""}
      }

      dispatch(updateCurrentVideo(VideoData));
  
      navigate(`/comments/videos/?videoId=${video.videoId}`); 

      try {
        const response = await axios.get<{ comments: Comment[] }>(
          `http://localhost:4000/user/comments/videos/${video.videoId}?userEmail=${data.email}`
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, rotateX: -20 }} 
      animate={{ opacity: 1, rotateX: 0 }} 
      transition={{ duration: 0.8, type: "spring" }}
      className="max-w-7xl mx-auto px-4 py-8 perspective-1000 mt-[60px]"
    >
      <motion.h1 
        className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600"
        initial={{ y: -50, opacity: 0, rotateX: -90 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      >
        Video Search
      </motion.h1>

      {!selectedVideo ? (
        <motion.div
          initial={{ y: 50, opacity: 0, rotateX: 30 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="transform-gpu"
        >
          <div className="flex gap-4 mb-12 max-w-2xl mx-auto">
            <motion.div 
              className="relative flex-1 perspective-1000"
              whileHover={{ scale: 1.02, rotateX: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <input
                type="text"
                className="w-full px-6 py-4 rounded-xl bg-gray-900/50 border-2 border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-lg backdrop-blur-sm"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={24} />
              </motion.div>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05, rotateY: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-purple-500/25"
            >
              {isSearching ? "Searching..." : "Search"}
            </motion.button>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            {videos.map((video) => (
              <motion.div
                key={video.videoId}
                variants={{
                  hidden: { opacity: 0, y: 50, rotateX: 30 },
                  visible: { opacity: 1, y: 0, rotateX: 0 }
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50,
                  transition: { duration: 0.3 }
                }}
                className="cursor-pointer overflow-hidden rounded-2xl bg-gray-900/50 border-2 border-gray-800 hover:border-purple-500/50 shadow-xl transition-all duration-300 transform-gpu backdrop-blur-sm"
                onClick={() => handleVideoClick(video)}
              >
                <motion.div 
                  className="aspect-video overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div 
                  className="p-6"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="font-semibold text-xl text-gray-200 line-clamp-2 mb-3">{video.title}</h3>
                  <p className="text-sm text-purple-400">{video.channel}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mt-8 transform-gpu"
        >
          <VideoPage title={selectedVideo.title} />
          
          <motion.button
            whileHover={{ scale: 1.05, rotateY: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedVideo(null)}
            className="mt-10 inline-flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
          >
            <motion.div
              whileHover={{ x: -5 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowLeft size={24} />
            </motion.div>
            Back to Search
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}