import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserDetailsQuery } from "@/redux/slices/api";
import { setSentimentCounts, setVideoDescription, updateCurrentVideo } from "@/redux/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Upload } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Comment {
  author: string;
  text: string;
  profileImage: string;
  sentiment: number;
  sentimentText: string;
}

interface CommentsProps {
  videoId: string;
}

export interface SentimentCountType {
  good: number;
  neutral: number;
  bad: number;
}

export default function Comments({ videoId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const commentsPerPage = 5;

  const { data } = useGetUserDetailsQuery();
  const dispatch = useDispatch();
  const videodata = useSelector((state: RootState) => state.appSlice.videodata);
  console.log("VideoData : ", videodata);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ comments: Comment[]; sentimentCounts: SentimentCountType; descriptions: { Pd: string; Nd: string } }>(
          `http://localhost:4000/user/comments/videos/${videoId}?userEmail=${data?.email}`
        );
        console.log(response.data.descriptions);
        setComments(response.data.comments);

        dispatch(setSentimentCounts(response.data.sentimentCounts));
        dispatch(setVideoDescription(response.data.descriptions));
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (data?.email) {
      fetchComments();
    }
  }, [videoId, data?.email, dispatch]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `http://localhost:4000/user/comments/videos/${videoId}/add-comment`,
        { text: newComment },
        {
          headers: {
            "user-id": data?.email,
            "video-id": videoId,
            channel: videodata.channel,
            thumbnail: videodata.thumbnail,
            title: videodata.title,
          },
          withCredentials: true,
        }
      );

      const newCommentObj: Comment = {
        author: data?.email as string,
        text: newComment,
        profileImage: "",
        sentiment: 1,
        sentimentText: newComment,
      };

      setNewComment("");
      setComments((prev) => [newCommentObj, ...prev]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  const getSentimentLabel = (sentiment: number) => {
    switch (sentiment) {
      case 2:
        return {
          text: "Positive",
          color: "bg-gradient-to-r from-green-400 to-green-600",
          textColor: "text-green-50",
          ringColor: "ring-green-400/30",
          iconEmoji: "🌟"
        };
      case 1:
        return {
          text: "Neutral",
          color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
          textColor: "text-yellow-50",
          ringColor: "ring-yellow-400/30",
          iconEmoji: "⚖️"
        };
      case 0:
        return {
          text: "Negative",
          color: "bg-gradient-to-r from-red-400 to-red-600",
          textColor: "text-red-50",
          ringColor: "ring-red-400/30",
          iconEmoji: "⚠️"
        };
      default:
        return {
          text: "Unknown",
          color: "bg-gradient-to-r from-gray-400 to-gray-600",
          textColor: "text-gray-50",
          ringColor: "ring-gray-400/30",
          iconEmoji: "❔"
        };
    }
  };

  // Skeleton loader component for comments
  const CommentSkeleton = ({ count = 5 }: { count?: number }) => {
    return (
      <>
        {[...Array(count)].map((_, index) => (
          <motion.div
            key={`skeleton-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 animate-pulse"
          >
            <div className="flex items-start space-x-4">
              {/* Profile image skeleton */}
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              <div className="flex-1 space-y-2">
                {/* Author name skeleton */}
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                {/* Comment text skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
                {/* Sentiment badge skeleton */}
                <div className="flex justify-end">
                  <div className="h-6 bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8 bg-gray-900/50 backdrop-blur-lg rounded-xl shadow-xl border border-gray-800 p-6"
    >
      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
        Comments
      </h3>

      {/* Comment Input Section */}
      <div className="relative mb-8">
        <textarea
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 min-h-[100px] resize-none"
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddComment}
          className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors duration-300"
        >
          <Send size={20} />
        </motion.button>
      </div>

      {/* Comments List */}
      <AnimatePresence mode="wait">
        {loading ? (
          <CommentSkeleton />
        ) : comments.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        ) : (
          <>
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {currentComments.map((comment, index) => {
                  const sentiment = getSentimentLabel(comment.sentiment);
                  return (
                    <motion.div
                      key={indexOfFirstComment + index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                      className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-[1.02]"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={comment.profileImage || "/default-avatar.png"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 space-y-2">
                          <p className="text-sm text-gray-400">{comment.author}</p>
                          <div className="relative bg-gray-700/30 rounded-lg p-3">
                            <p className="text-gray-200">{comment.text}</p>
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute -top-10 -right-2"

                            >
                              <motion.span
                                  whileHover={{ scale: 1.1 }}
                                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-mono font-semibold ${sentiment.color} ${sentiment.textColor} ring-2 ${sentiment.ringColor} shadow-lg transition-all duration-300`}
                                >
                                  <span className="mr-2 text-lg">{sentiment.iconEmoji}</span>
                                  <span>{sentiment.text}</span>
                              </motion.span>

                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={`transition-all duration-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                          className="transition-all duration-300 hover:scale-105"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={`transition-all duration-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}