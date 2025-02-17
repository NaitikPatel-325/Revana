import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/Loader/loader";

const Home = lazy(() => import("./components/Home"));
// const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Navbar = lazy(()=> import("./pages/Comments/comments"))
const Movies = lazy(()=> import("./pages/Comments/movies"))
const VideoPage = lazy(()=> import("./pages/Comments/videopage"))
const VideoSearch = lazy(()=> import("./pages/Comments/videos"))


export default function AllRoutes() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[calc(100dvh-60px)] flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/comments" element={<Navbar />} />
        <Route path="/comments/movies" element={<Movies />} />
        <Route path="/comments/videos/:videoId" element={<VideoPage title="Video Page" />} />
        <Route path="/comments/videos/:videoId/add-comment" element={<VideoSearch />} />
        
        
        <Route path="/comments/videos/" element={<VideoSearch />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
