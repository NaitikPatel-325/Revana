import { Link } from 'react-router-dom';
import "../../index.css";

export default function CommentHeader() {
  return (
    <nav className="bg-blue-600 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Sticky Title */}
        <div className="text-white font-bold text-2xl">
          Comment Sections
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link to="/comments/movies" className="text-white hover:text-gray-200">
            Movies
          </Link>
          <Link to="/comments/food" className="text-white hover:text-gray-200">
            Food
          </Link>
          <Link to="/comments/videos" className="text-white hover:text-gray-200">
            Videos
          </Link>
          <Link to="/comments/fashion" className="text-white hover:text-gray-200">
            Fashion
          </Link>
        </div>
      </div>
    </nav>
  );
}
