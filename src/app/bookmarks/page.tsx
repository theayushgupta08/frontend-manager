"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { HiStar, HiOutlineStar, HiPlusCircle, HiPencil, HiTrash, HiLink } from "react-icons/hi2";
import { Fragment } from "react";

interface Bookmark {
  id: number;
  url: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ url: "", title: "", description: "", tags: "" });
  const [editBookmark, setEditBookmark] = useState<Bookmark | null>(null);
  const [error, setError] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.q = search;
      if (tags) params.tags = tags;
      const res = await axios.get(`${apiUrl}/api/bookmarks`, { params });
      setBookmarks(res.data);
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to fetch bookmarks");
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
    fetchBookmarks();
    // eslint-disable-next-line
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${apiUrl}/api/bookmarks`, {
        url: newBookmark.url,
        title: newBookmark.title,
        description: newBookmark.description,
        tags: newBookmark.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setNewBookmark({ url: "", title: "", description: "", tags: "" });
      fetchBookmarks();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to create bookmark");
    }
  };

  const handleDelete = async (id: number) => {
    setError("");
    try {
      await axios.delete(`${apiUrl}/api/bookmarks/${id}`);
      fetchBookmarks();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to delete bookmark");
    }
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditBookmark(bookmark);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBookmark) return;
    setError("");
    try {
      await axios.put(`${apiUrl}/api/bookmarks/${editBookmark.id}`,
        {
          url: editBookmark.url,
          title: editBookmark.title,
          description: editBookmark.description,
          tags: editBookmark.tags,
        }
      );
      setEditBookmark(null);
      fetchBookmarks();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to update bookmark");
    }
  };

  const handleToggleFavorite = async (id: number) => {
    setError("");
    try {
      await axios.patch(`${apiUrl}/api/bookmarks/${id}/favorite`);
      fetchBookmarks();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to update favorite");
    }
  };

  return (
    <div className="min-h-screen pb-10 px-2 sm:px-0">
      <div className="max-w-3xl mx-auto p-2 sm:p-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-green-700 drop-shadow-sm tracking-tight">🔖 Bookmarks</h1>
        <div className="flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8 items-center justify-between">
          <form className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto" onSubmit={e => { e.preventDefault(); fetchBookmarks(); }}>
            <input
              className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-green-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
              placeholder="Search bookmarks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <input
              className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-green-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
              placeholder="Filter by tags (comma separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2 shadow text-base sm:text-sm" type="submit">
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
        <form className="mb-8 flex flex-col gap-3 bg-white/90 rounded-2xl shadow-xl p-4 sm:p-6 border border-green-100" onSubmit={handleCreate}>
          <div className="flex items-center gap-2 mb-2">
            <HiPlusCircle className="text-green-500 text-2xl" />
            <span className="font-bold text-lg text-gray-700">Add a new bookmark</span>
          </div>
          <input
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
            placeholder="Bookmark URL..."
            value={newBookmark.url}
            onChange={e => setNewBookmark({ ...newBookmark, url: e.target.value })}
            required
          />
          <input
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
            placeholder="Title (optional)"
            value={newBookmark.title}
            onChange={e => setNewBookmark({ ...newBookmark, title: e.target.value })}
          />
          <input
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
            placeholder="Description (optional)"
            value={newBookmark.description}
            onChange={e => setNewBookmark({ ...newBookmark, description: e.target.value })}
          />
          <input
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
            placeholder="Tags (comma separated)"
            value={newBookmark.tags}
            onChange={e => setNewBookmark({ ...newBookmark, tags: e.target.value })}
          />
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold self-end hover:from-green-600 hover:to-blue-600 transition flex items-center gap-2 shadow text-base sm:text-sm w-full sm:w-auto" type="submit">
            <HiPlusCircle className="text-xl" /> Add Bookmark
          </button>
        </form>
        {error && <div className="text-red-600 mb-4 text-center font-semibold text-base sm:text-sm">{error}</div>}
        {loading ? (
          <div className="flex justify-center items-center py-10"><span className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></span></div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-xl font-semibold">No bookmarks found. Start by adding a new bookmark! ✨</div>
        ) : (
          <ul className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2">
            {bookmarks.filter(bm => !showFavorites || bm.favorite).map(bookmark => (
              <li key={bookmark.id} className="border rounded-2xl p-4 sm:p-6 flex flex-col gap-3 bg-white/90 shadow-xl relative group transition hover:shadow-2xl hover:-translate-y-1 duration-200 border-green-100">
                <button
                  className={`absolute top-4 right-4 text-2xl transition ${bookmark.favorite ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                  title={bookmark.favorite ? 'Unmark Favorite' : 'Mark as Favorite'}
                  onClick={() => handleToggleFavorite(bookmark.id)}
                >
                  {bookmark.favorite ? <HiStar /> : <HiOutlineStar />}
                </button>
                {editBookmark?.id === bookmark.id ? (
                  <form className="flex flex-col gap-2" onSubmit={handleUpdate}>
                    <input
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
                      value={editBookmark.url}
                      onChange={e => setEditBookmark({ ...editBookmark, url: e.target.value })}
                    />
                    <input
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
                      value={editBookmark.title}
                      onChange={e => setEditBookmark({ ...editBookmark, title: e.target.value })}
                    />
                    <input
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
                      value={editBookmark.description}
                      onChange={e => setEditBookmark({ ...editBookmark, description: e.target.value })}
                    />
                    <input
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 transition shadow-sm placeholder-gray-500 text-black text-base sm:text-sm"
                      value={editBookmark.tags.join(", ")}
                      onChange={e => setEditBookmark({ ...editBookmark, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                    />
                    <div className="flex gap-2 mt-2 flex-col sm:flex-row">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-1 text-base sm:text-sm w-full sm:w-auto" type="submit"><HiPencil /> Save</button>
                      <button className="bg-gray-300 px-3 py-1 rounded-lg font-semibold hover:bg-gray-400 transition flex items-center gap-1 text-base sm:text-sm w-full sm:w-auto" type="button" onClick={() => setEditBookmark(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline flex items-center gap-2 text-lg">
                      <HiLink className="text-blue-400" />
                      {bookmark.title || bookmark.url}
                    </a>
                    <div className="text-sm text-gray-700 min-h-[24px]">{bookmark.description}</div>
                    <div className="flex gap-2 flex-wrap">
                      {bookmark.tags.map(tag => (
                        <span key={tag} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">#{tag}</span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400">Created: {new Date(bookmark.createdAt).toLocaleString()}</div>
                    <div className="flex gap-2 mt-2 flex-col sm:flex-row">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center gap-1 text-base sm:text-sm w-full sm:w-auto" onClick={() => handleEdit(bookmark)}><HiPencil /> Edit</button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-1 text-base sm:text-sm w-full sm:w-auto" onClick={() => setDeleteModal({ open: true, id: bookmark.id })}><HiTrash /> Delete</button>
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
            <div className="text-xl font-bold text-gray-800 mb-2">Delete Bookmark?</div>
            <div className="text-gray-600 mb-4 text-center">Are you sure you want to delete this bookmark? This action cannot be undone.</div>
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