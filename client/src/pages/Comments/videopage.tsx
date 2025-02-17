import { useSearchParams } from "react-router-dom";
import VideoPlayer from "./videoplayer";
import Comments from "./videocomments";


interface VideoPageProps {
  title: string;
}

export default function VideoPage({ title }: VideoPageProps) {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId");

  if (!videoId) return <p className="text-center text-gray-400">No video selected.</p>;

  return (
    <div className="flex gap-6">
      {/* Left Side: Video Player & Comments */}
      <div className="flex-1">
        <VideoPlayer videoId={videoId} title={title} />
        <Comments videoId={videoId} />
      </div>

      {/* Right Side: Sentiment Analysis */}
      <div className="w-1/3 bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 h-fit">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">Sentiment Analysis</h2>

        <div className="space-y-4">
          {/* Positive Sentiment */}
          <div className="flex items-center">
            <p className="w-24 text-green-400 font-semibold">Positive</p>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: "60%" }}></div>
            </div>
            <span className="ml-2 text-gray-300">60%</span>
          </div>

          {/* Negative Sentiment */}
          <div className="flex items-center">
            <p className="w-24 text-red-400 font-semibold">Negative</p>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-red-500 h-3 rounded-full" style={{ width: "20%" }}></div>
            </div>
            <span className="ml-2 text-gray-300">20%</span>
          </div>

          {/* Neutral Sentiment */}
          <div className="flex items-center">
            <p className="w-24 text-gray-400 font-semibold">Neutral</p>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-gray-500 h-3 rounded-full" style={{ width: "20%" }}></div>
            </div>
            <span className="ml-2 text-gray-300">20%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
