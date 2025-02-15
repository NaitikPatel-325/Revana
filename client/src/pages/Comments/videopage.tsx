// import { useParams } from "react-router-dom";
import VideoPlayer from "./videoplayer";
import Comments from "./videocomments";

import { useSearchParams } from "react-router-dom";


export default function VideoPage() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId");

  if (!videoId) return <p className="text-center text-gray-400">No video selected.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto text-white bg-black min-h-screen pt-16">
      <VideoPlayer videoId={videoId} title="Playing Video" />
      <Comments videoId={videoId} />
    </div>
  );
}
