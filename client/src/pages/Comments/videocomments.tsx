import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserDetailsQuery } from "@/redux/slices/api";

interface Comment {
  author: string;
  text: string;
  profileImage: string;
}

interface CommentsProps {
  videoId: string;
}

export default function Comments({ videoId }: CommentsProps) {
  console.log("Rendering Comments Component");

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const { data, isSuccess } = useGetUserDetailsQuery();

  // Ensure data is available before rendering
  if (!isSuccess || !data?.email) {
    return <p className="text-gray-400">Loading comments...</p>;
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log(`Fetching comments for video ID: ${videoId}, User: ${data?.email}`);
        const response = await axios.get<{ comments: Comment[] }>(
          `http://localhost:4000/user/comments/videos/${videoId}?userEmail=${data?.email}`
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (data?.email) {
      fetchComments();
    }
  }, [videoId, data?.email]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      console.log(`Adding comment: "${newComment}" by ${data?.email}`);
      await axios.post(
        `http://localhost:4000/user/comments/videos/${videoId}/add-comment`,
        { text: newComment },
        {
          headers: {
            "user-id": data?.email,
          },
          withCredentials: true,
        }
      );

      // Reset input & update local comments
      setNewComment("");
      setComments([...comments, { author: data?.email, text: newComment, profileImage: "" }]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-300">Comments</h3>

      {/* Comment Input Box */}
      <div className="flex gap-2 mt-4 mb-4">
        <input
          type="text"
          className="border border-gray-600 p-2 flex-1 rounded bg-gray-900 text-white"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Comment
        </button>
      </div>

      {/* Render Comments */}
      {comments.length === 0 ? (
        <p className="text-gray-400">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment, index) => (
            <div key={index} className="flex items-start space-x-3 bg-gray-900 p-3 rounded-lg shadow-md">
              <img
                src={comment.profileImage || "/default-avatar.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm text-gray-400">{comment.author}</p>
                <p className="text-gray-300">{comment.text}</p>
                <p className="text-gray-300">{comment.}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
