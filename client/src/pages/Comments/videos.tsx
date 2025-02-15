import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useGetUserDetailsQuery } from "@/redux/slices/api";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  
  const { data, isSuccess } = useGetUserDetailsQuery();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchVideoById = useCallback( async (videoId: string) => {
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
  },[data, isSuccess]);

  // ✅ Check for videoId in URL on page load
  useEffect(() => {
    const videoId = searchParams.get("videoId");
    if (videoId) {
      fetchVideoById(videoId);
    }
  }, [fetchVideoById, searchParams]);

  

  const handleSearch = async () => {
    try {
      const response = await axios.get<{ videos: Video[] }>(
        `http://localhost:4000/user/comments/videos/search?query=${searchQuery}`
      );
      setVideos(response.data.videos);
      setSelectedVideo(null);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleVideoClick = async (video: Video) => {
    if (isSuccess) {
      setSelectedVideo(video);
      setComments([]);
      setNextPageToken(null);
  
      navigate(`/comments/videos/?videoId=${video.videoId}`); // ✅ Update URL

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

  return (
    <div className="p-4 w-full mx-auto text-white bg-black min-h-screen pt-16">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-200">YouTube Video Search</h1>

      {!selectedVideo ? (
        <>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              className=" border border-gray-600 p-2 flex-1 rounded bg-gray-900 text-white placeholder-gray-400"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Search
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {videos.map((video) => (
              <div
                key={video.videoId}
                className="cursor-pointer p-2 bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
                onClick={() => handleVideoClick(video)}
              >
                <img src={video.thumbnail} alt={video.title} className="rounded-lg" />
                <p className="font-medium mt-2 text-gray-200">{video.title}</p>
                <p className="text-sm text-gray-400">{video.channel}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-300">{selectedVideo.title}</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
              title="YouTube Video Player"
              allowFullScreen
              className="rounded-lg shadow-md"
            ></iframe>
          </div>

          <h3 className="text-lg font-semibold mt-6 text-gray-300">Comments</h3>
          <div className="mt-2 space-y-3">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3 bg-gray-900 p-3 rounded-lg shadow-md">
                  <img src={comment.profileImage} alt="profile" className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-semibold text-blue-400">{comment.author}</p>
                    <p className="text-gray-300">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments found.</p>
            )}
          </div>

          <button
            onClick={() => setSelectedVideo(null)}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded block"
          >
            Back to Search Results
          </button>
        </div>
      )}
    </div>
  );
}
