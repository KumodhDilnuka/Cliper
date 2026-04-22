import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { getQuestions, upvoteQuestion, downvoteQuestion } from "../../../services/api";
import QuestionCard from "../../../components/QuestionCard";
import ForumSidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import toast from "react-hot-toast";

function QA() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await getQuestions(search, sort);
      setQuestions(data);
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [sort]);

  // Read `sort` from query param when page loads or when URL changes
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSort = params.get("sort");
    if (urlSort && urlSort !== sort) {
      setSort(urlSort);
    }
    // if no sort param and current sort isn't newest, reset to newest
    if (!urlSort && sort !== "newest") {
      setSort("newest");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleUpvote = async (id) => {
    try {
      const { data } = await upvoteQuestion(id);
      setQuestions((prev) =>
        prev.map((q) => (q._id === id ? data : q))
      );
    } catch {
      toast.error("Vote failed");
    }
  };

  const handleDownvote = async (id) => {
    try {
      const { data } = await downvoteQuestion(id);
      setQuestions((prev) =>
        prev.map((q) => (q._id === id ? data : q))
      );
    } catch {
      toast.error("Vote failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e]">
      <ForumSidebar />
      <TopBar mode="forum" title="Academic Atelier" />

      <main className="pt-24 pb-10 px-4 md:px-6 lg:px-8 lg:ml-64">
        <div className="mx-auto max-w-5xl animate-fadeInUp space-y-6" id="home-page">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/70 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-100 flex-shrink-0">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <form className="flex-1 relative" onSubmit={handleSearch}>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#0040a1]/30 focus:ring-4 focus:ring-[#0040a1]/5 transition-all text-slate-700 placeholder-slate-400"
                placeholder="Create a post..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <Link
              to="/ask"
              className="bg-[#2047b8] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#1a3da5] transition-colors shadow-sm"
              id="create-post-btn"
            >
              Create Post
            </Link>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "newest", label: "Newest" },
              { id: "popular", label: "Top Rated" },
              { id: "following", label: "Following" },
              { id: "academic", label: "Academic Peer Review" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  sort === tab.id
                    ? "bg-indigo-100 text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
                onClick={() => {
                  setSearch("");
                  setSort(tab.id);
                  const params = new URLSearchParams(location.search);
                  if (tab.id === "newest") {
                    params.delete("sort");
                  } else {
                    params.set("sort", tab.id);
                  }
                  navigate({ pathname: "/qa", search: params.toString() }, { replace: true });
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4" id="questions-feed">
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-12 text-slate-500">
                <div className="spinner"></div>
                <p className="text-sm font-medium">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/70 shadow-sm">
                <FiSearch className="text-5xl mx-auto mb-4 text-slate-200" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No questions yet</h3>
                <p className="text-slate-500 mb-6">Be the first to ask a question!</p>
                <Link
                  to="/ask"
                  className="inline-flex bg-[#2047b8] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#1a3da5] transition-colors"
                >
                  Ask a Question
                </Link>
              </div>
            ) : (
              questions.map((q) => (
                <QuestionCard
                  key={q._id}
                  question={q}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                  showVotes={sort !== "popular"}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default QA;
