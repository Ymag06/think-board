import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import api from "../lib/axios";
import NotesNotFound from "../components/NotesNotFound";
const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // const res = await fetch("http://localhost:5001/api/notes");
        // const data = await res.json();

        const res = await api.get("/notes");
        setNotes(res.data);
        setIsRateLimited(false);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        // Check if the error is due to rate limiting (HTTP status code 429)
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          setLoadError(true);
          toast.error("Fail to fetch notes. Please try again later.");
        }
      } finally {
        // finally block will always execute, regardless of whether the try block succeeds or the catch block is triggered.
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {isLoading ? (
          <div className="text-center text-primary py-10">Loading notes...</div>
        ) : loadError ? (
          <p className="text-center py-10">
            Could not load notes. Please try again.
          </p>
        ) : isRateLimited ? (
          <RateLimitedUI />
        ) : notes.length === 0 ? (
          <NotesNotFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
