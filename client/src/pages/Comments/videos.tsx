import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useGetUserDetailsQuery } from "@/redux/slices/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCurrentVideo } from "@/redux/slices/appSlice";
import VideoPage from "./videopage";
import { ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

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
  
  const { data, isSuccess } = useGetUserDetailsQuery();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const fetchVideoById = useCallback(async (videoId: string) => {
    try {
      const response = await axios.get<{ video: Video }>(
        `http://localhost:4000/user/comments/videos/get-video?videoId=${videoId}`
      );
      setSelectedVideo(response.data.video);
      setComments([]);

      if (isSuccess) {
        const commentsResponse = await axios.get<{ comments: Comment[] }>(
          `http://localhost:4000/user/comments/videos/${videoId}?userEmail=${data.email}`
        );
        setComments(commentsResponse.data.comments);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    const videoId = searchParams.get("videoId");
    if (videoId) {
      fetchVideoById(videoId);
    }
  }, [fetchVideoById, searchParams]);

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
      dispatch(updateCurrentVideo(video));
      setComments([]);
      setNextPageToken(null);
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

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Video Search
      </motion.h1>

      {!selectedVideo ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex gap-4 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </motion.button>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {videos.map((video, index) => (
              <motion.div
                key={video.videoId}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                className="cursor-pointer overflow-hidden rounded-xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 shadow-lg transition-all duration-300"
                onClick={() => handleVideoClick(video)}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-200 line-clamp-2 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-400">{video.channel}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <VideoPage title={selectedVideo.title} />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedVideo(null)}
            className="mt-8 inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            Back to Search
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}