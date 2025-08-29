import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css"; // Import modal styles
import NoteCard from "../components/NoteCard"; // Import our new NoteCard component
import baseUrl from "../config/baseURL";

// Define the shape of a User and a Note for TypeScript
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // State for managing notes
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");

  // State for the delete confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Helper function to get the auth token from local storage
  const getToken = () => localStorage.getItem("authToken");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/signin");
    }

    // Fetch the user's notes when the component loads
    const fetchNotes = async () => {
      try {
        const token = getToken();
        if (!token) {
          toast.error("Not authorized. Please log in.");
          return navigate("/signin");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(`${baseUrl}/api/notes`, config);
        setNotes(data);
      } catch (error) {
        toast.error("Could not fetch notes.");
      }
    };

    fetchNotes();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    navigate("/signin");
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) {
      return toast.error("Note cannot be empty.");
    }

    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data: newNote } = await axios.post(
        `${baseUrl}/api/notes`,
        { content: newNoteContent },
        config
      );

      setNotes([newNote, ...notes]);
      setNewNoteContent("");
      toast.success("Note created!");
    } catch (error) {
      toast.error("Failed to create note.");
    }
  };

  // This function opens the delete confirmation modal
  const openDeleteModal = (noteId: string) => {
    setNoteToDelete(noteId);
    setIsModalOpen(true);
  };

  // This function runs when the user confirms the deletion
  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${baseUrl}/api/notes/${noteToDelete}`, config);

      setNotes(notes.filter((note) => note._id !== noteToDelete));
      toast.success("Note deleted.");
    } catch (error) {
      toast.error("Failed to delete note.");
    } finally {
      setIsModalOpen(false);
      setNoteToDelete(null);
    }
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      {/* The Delete Confirmation Modal Component */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        center
        classNames={{ modal: "custom-modal" }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Delete Note</h2>
          <p>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteNote}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* The Main Page Content */}
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Sign out
              </button>
            </div>
          </nav>
        </header>

        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-medium text-gray-900">
              Welcome, {user.name}!
            </h2>
            <p className="text-gray-600 mt-1">Email: {user.email}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <form onSubmit={handleCreateNote}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create a New Note
              </h3>
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              ></textarea>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Save Note
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Your Notes
            </h2>
            <div className="space-y-4">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onDelete={openDeleteModal}
                  />
                ))
              ) : (
                <p className="text-gray-500">
                  You don't have any notes yet. Create one above!
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
