// pages/comments/movies.tsx
import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import "../../index.css";

// Example movie data
const movies = [
    {
      id: 1,
      title: "Inception",
      image: "https://via.placeholder.com/300x450?text=Inception",
      description: "A mind-bending thriller by Christopher Nolan."
    },
    {
      id: 2,
      title: "The Dark Knight",
      image: "https://via.placeholder.com/300x450?text=The+Dark+Knight",
      description: "The iconic Batman movie by Christopher Nolan."
    },
    {
      id: 3,
      title: "Interstellar",
      image: "https://via.placeholder.com/300x450?text=Interstellar",
      description: "A sci-fi epic by Christopher Nolan exploring space and time."
    },
  ];
  
  type Comment = {
    movieId: number;
    text: string;
  };
  
  export default function Movies() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [currentComment, setCurrentComment] = useState<string>('');
  
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentComment(e.target.value);
    };
  
    const handleCommentSubmit = (movieId: number) => {
      if (currentComment.trim()) {
        setComments([
          ...comments,
          { movieId, text: currentComment.trim() }
        ]);
        setCurrentComment(''); // Clear input field after submission
      }
    };
  
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Movie Reviews & Comments</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <Card key={movie.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={movie.image} alt={movie.title} className="w-full h-64 object-cover" />
              <CardContent>
                {/* Sticky Header */}
                <CardHeader className="sticky top-0 bg-white z-10 border-b-2 border-gray-200">
                  <CardTitle className="text-xl font-semibold text-gray-800">{movie.title}</CardTitle>
                  <CardDescription className="text-gray-600">{movie.description}</CardDescription>
                </CardHeader>
  
                <div className="space-y-4 mt-4">
                  <Textarea
                    value={currentComment}
                    onChange={handleCommentChange}
                    placeholder={`Leave a comment about ${movie.title}`}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={() => handleCommentSubmit(movie.id)}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Submit Comment
                  </Button>
  
                  {/* Display comments for this movie */}
                  <div className="mt-4 max-h-60 overflow-y-auto">
                    <h4 className="font-semibold text-gray-800">Comments:</h4>
                    <div className="space-y-2 mt-2">
                      {comments.filter(comment => comment.movieId === movie.id).map((comment, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                          <p className="text-gray-800">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }