"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { HiStar, HiOutlineStar, HiPlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import { Fragment } from "react";

interface Note {
  id: number;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState({ content: "", tags: "" });
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [error, setError] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.q = search;
      if (tags) params.tags = tags;
      if (showFavorites) params.favorite = true;
      const res = await axios.get(`${apiUrl}/api/notes`, { params });
      setNotes(res.data);
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to fetch notes");
    }
    setLoading(false);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/auth");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    fetchNotes();
    // eslint-disable-next-line
  }, [search, tags, showFavorites]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${apiUrl}/api/notes`, {
        content: newNote.content,
        tags: newNote.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setNewNote({ content: "", tags: "" });
      fetchNotes();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to create note");
    }
  };

  const handleDelete = async (id: number) => {
    setError("");
    try {
      await axios.delete(`${apiUrl}/api/notes/${id}`);
      fetchNotes();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to delete note");
    }
  };

  const handleEdit = (note: Note) => {
    setEditNote(note);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNote) return;
    setError("");
    try {
      await axios.put(`${apiUrl}/api/notes/${editNote.id}`,
        {
          content: editNote.content,
          tags: editNote.tags,
        }
      );
      setEditNote(null);
      fetchNotes();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to update note");
    }
  };

  const handleToggleFavorite = async (id: number) => {
    setError("");
    try {
      await axios.patch(`${apiUrl}/api/notes/${id}/favorite`);
      fetchNotes();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to update favorite");
    }
  };

  return (
    <div className="min-h-screen pb-10 px-2 sm:px-0">
      <div className="max-w-3xl mx-auto p-2 sm:p-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-blue-700 drop-shadow-sm tracking-tight">📝 Notes</h1>
        <div className="flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8 items-center justify-between">
          <form className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto" onSubmit={e => { e.preventDefault(); fetchNotes(); }}>
            <input
              className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <input
              className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
              placeholder="Filter by tags (comma separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow text-base sm:text-sm" type="submit">
              <span>Search</span>
            </button>
          </form>
          <button
            className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold transition ml-0 sm:ml-4 mt-2 sm:mt-0 flex items-center gap-2 shadow ${showFavorites ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'} text-base sm:text-sm`}
            onClick={() => setShowFavorites(f => !f)}
          >
            {showFavorites ? <HiStar className="inline text-xl" /> : <HiOutlineStar className="inline text-xl" />}
            {showFavorites ? 'Show All' : 'Show Favorites'}
          </button>
        </div>
        <form className="mb-8 flex flex-col gap-3 bg-white/90 rounded-2xl shadow-xl p-4 sm:p-6 border border-blue-100" onSubmit={handleCreate}>
          <div className="flex items-center gap-2 mb-2">
            <HiPlusCircle className="text-green-500 text-2xl" />
            <span className="font-bold text-lg text-gray-700">Add a new note</span>
          </div>
          <textarea
            className="border rounded-lg px-3 py-2 min-h-[60px] focus:ring-2 focus:ring-blue-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
            placeholder="New note content..."
            value={newNote.content}
            onChange={e => setNewNote({ ...newNote, content: e.target.value })}
            required
          />
          <input
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
            placeholder="Tags (comma separated)"
            value={newNote.tags}
            onChange={e => setNewNote({ ...newNote, tags: e.target.value })}
          />
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold self-end hover:from-green-600 hover:to-blue-600 transition flex items-center gap-2 shadow text-base sm:text-sm w-full sm:w-auto" type="submit">
            <HiPlusCircle className="text-xl" /> Add Note
          </button>
        </form>
        {error && <div className="text-red-600 mb-4 text-center font-semibold text-base sm:text-sm">{error}</div>}
        {loading ? (
          <div className="flex justify-center items-center py-10"><span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></span></div>
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-xl font-semibold">No notes found. Start by adding a new note! ✨</div>
        ) : (
          <ul className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2">
            {notes.filter(note => !showFavorites || note.favorite).map(note => (
              <li key={note.id} className="border rounded-2xl p-4 sm:p-6 flex flex-col gap-3 bg-white/90 shadow-xl relative group transition hover:shadow-2xl hover:-translate-y-1 duration-200 border-blue-100">
                <button
                  className={`absolute top-4 right-4 text-2xl transition ${note.favorite ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                  title={note.favorite ? 'Unmark Favorite' : 'Mark as Favorite'}
                  onClick={() => handleToggleFavorite(note.id)}
                >
                  {note.favorite ? <HiStar /> : <HiOutlineStar />}
                </button>
                {editNote?.id === note.id ? (
                  <form className="flex flex-col gap-2" onSubmit={handleUpdate}>
                    <textarea
                      className="border rounded-lg px-3 py-2 min-h-[60px] focus:ring-2 focus:ring-blue-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
                      value={editNote.content}
                      onChange={e => setEditNote({ ...editNote, content: e.target.value })}
                    />
                    <input
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
                      value={editNote.tags.join(", ")}
                      onChange={e => setEditNote({ ...editNote, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                    />
                    <div className="flex gap-2 mt-2 flex-col sm:flex-row">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-1 text-base sm:text-sm w-full sm:w-auto" type="submit"><HiPencil /> Save</button>
                      <button className="bg-gray-300 px-3 py-1 rounded-lg font-semibold hover:bg-gray-400 transition flex items-center gap-1 text-base sm:text-sm w-full sm:w-auto" type="button" onClick={() => setEditNote(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="whitespace-pre-wrap text-gray-800 text-base font-medium min-h-[40px]">{note.content}</div>
                    <div className="flex gap-2 flex-wrap">
                      {note.tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">#{tag}</span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400">Created: {new Date(note.createdAt).toLocaleString()}</div>
                    <div className="flex gap-2 mt-2 flex-col sm:flex-row">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center gap-1 text-base sm:text-sm w-full sm:w-auto" onClick={() => handleEdit(note)}><HiPencil /> Edit</button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-1 text-base sm:text-sm w-full sm:w-auto" onClick={() => setDeleteModal({ open: true, id: note.id })}><HiTrash /> Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs mx-2 flex flex-col items-center">
            <div className="text-xl font-bold text-gray-800 mb-2">Delete Note?</div>
            <div className="text-gray-600 mb-4 text-center">Are you sure you want to delete this note? This action cannot be undone.</div>
            <div className="flex gap-3 w-full mt-2">
              <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</button>
              <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition" onClick={async () => {
                if (deleteModal.id !== null) await handleDelete(deleteModal.id);
                setDeleteModal({ open: false, id: null });
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 