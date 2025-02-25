import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserDetailsQuery } from "@/redux/slices/api";
import { setSentimentCounts } from "@/redux/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Comment {
  author: string;
  text: string;
  profileImage: string;
  sentiment: number;
  SentimentText: string;
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
  const commentsPerPage = 5; // Number of comments per page

  const { data, isSuccess } = useGetUserDetailsQuery();
  const dispatch = useDispatch();

  const videodata = useSelector((state: RootState) => state.appSlice.videodata);

  if (!isSuccess || !data?.email) {
    return <p className="text-gray-400">Loading comments...</p>;
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get<{
          comments: Comment[];
          sentimentCounts: SentimentCountType;
        }>(
          `http://localhost:4000/user/comments/videos/${videoId}?userEmail=${data?.email}`
        );
        setComments(response.data.comments);
        dispatch(setSentimentCounts(response.data.sentimentCounts));
      } catch (error) {
        console.error("Error fetching comments:", error);
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
        author: data?.email,
        text: newComment,
        profileImage: "",
        sentiment: 1,
        SentimentText: newComment,
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

  // Pagination logic
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
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
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        ) : (
          <>
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {currentComments.map((comment, index) => (
                  <motion.div
                    key={indexOfFirstComment + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                    className="flex items-start space-x-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-[1.02]"
                  >
                    <img
                      src={comment.profileImage || "/default-avatar.png"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">{comment.author}</p>
                      <p className="text-gray-200">{comment.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {getPageNumbers().map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
