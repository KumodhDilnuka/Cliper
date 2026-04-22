import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiClock,
  FiArrowLeft,
  FiSend,
  FiEyeOff,
  FiEye,
  FiTrash2,
  FiMessageCircle,
  FiShieldOff,
  FiX,
} from "react-icons/fi";
import {
  getQuestion,
  getAnswers,
  createAnswer,
  deleteAnswer,
  deleteQuestion,
  upvoteQuestion,
  downvoteQuestion,
  upvoteAnswer,
  downvoteAnswer,
} from "../../../services/api";
import VoteButtons from "../../../components/VoteButtons";
import AnswerCard from "../../../components/AnswerCard";
import ForumSidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import toast from "react-hot-toast";

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Answer form state
  const [answerBody, setAnswerBody] = useState("");
  const [answerAuthor, setAnswerAuthor] = useState("");
  const [answerAnonymous, setAnswerAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [moderationError, setModerationError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [qRes, aRes] = await Promise.all([
        getQuestion(id),
        getAnswers(id),
      ]);
      setQuestion(qRes.data);
      setAnswers(aRes.data);
    } catch {
      toast.error("Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleQuestionUpvote = async () => {
    try {
      const { data } = await upvoteQuestion(id);
      setQuestion(data);
    } catch {
      toast.error("Vote failed");
    }
  };

  const handleQuestionDownvote = async () => {
    try {
      const { data } = await downvoteQuestion(id);
      setQuestion(data);
    } catch {
      toast.error("Vote failed");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Delete this question and all its answers?")) return;
    try {
      await deleteQuestion(id);
      toast.success("Question deleted");
      navigate("/");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleAnswerUpvote = async (answerId) => {
    try {
      const { data } = await upvoteAnswer(answerId);
      setAnswers((prev) => prev.map((a) => (a._id === answerId ? data : a)));
    } catch {
      toast.error("Vote failed");
    }
  };

  const handleAnswerDownvote = async (answerId) => {
    try {
      const { data } = await downvoteAnswer(answerId);
      setAnswers((prev) => prev.map((a) => (a._id === answerId ? data : a)));
    } catch {
      toast.error("Vote failed");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Delete this answer?")) return;
    try {
      await deleteAnswer(answerId);
      setAnswers((prev) => prev.filter((a) => a._id !== answerId));
      setQuestion((prev) => ({
        ...prev,
        answerCount: prev.answerCount - 1,
      }));
      toast.success("Answer deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerBody.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }
    try {
      setSubmitting(true);
      setModerationError(null);
      const { data } = await createAnswer(id, {
        body: answerBody.trim(),
        authorName: answerAnonymous ? "Anonymous" : answerAuthor.trim(),
        isAnonymous: answerAnonymous,
      });
      setAnswers((prev) => [data, ...prev]);
      setQuestion((prev) => ({
        ...prev,
        answerCount: prev.answerCount + 1,
      }));
      setAnswerBody("");
      setAnswerAuthor("");
      toast.success("Answer posted!");
    } catch (error) {
      console.error("Error creating answer:", error);
      
      // Handle AI Moderation Rejection
      if (error.response && error.response.status === 403) {
        const reason = error.response.data?.reason || "This content does not meet university guidelines.";
        setModerationError(reason);
        toast.error("Rejected by AI Moderator", { icon: '🤖' });
        
        // Scroll to error
        const errorElement = document.getElementById("answer-moderation-error");
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        toast.error(error.message || "Failed to post answer");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-slate-500">
        <div className="spinner"></div>
        <p className="text-sm font-medium">Loading question...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-20 px-6">
        <h3 className="text-xl font-bold text-slate-400 mb-4">Question not found</h3>
        <button className="bg-[#2047b8] text-white px-6 py-2 rounded-xl transition-all" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e]">
      <ForumSidebar />
      <TopBar mode="forum" title="Question Detail" />

      <main className="pt-24 pb-10 px-4 md:px-6 lg:px-8 lg:ml-64">
        <div className="mx-auto max-w-5xl animate-fadeInUp space-y-6" id="detail-page">
          <button className="flex items-center gap-2 text-text-muted hover:text-text-main hover:bg-white bg-transparent px-3 py-1.5 rounded-lg transition-all text-sm font-semibold w-fit" onClick={() => navigate("/qa")}>
            <FiArrowLeft /> Back to Feed
          </button>

          {/* Question */}
          <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex gap-4 sm:gap-8">
              <div className="flex flex-col items-center">
                <VoteButtons
                  votes={question.upvotes}
                  onUpvote={handleQuestionUpvote}
                  onDownvote={handleQuestionDownvote}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 mb-4 leading-tight">{question.title}</h1>
                <p className="text-base sm:text-[1.1rem] text-text-secondary leading-relaxed mb-6 whitespace-pre-wrap font-medium">{question.body}</p>

                {question.imageUrl && (
                  <div className="mb-8 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                    <img
                      src={question.imageUrl}
                      alt="Question Attachment"
                      className="w-full h-auto max-h-[600px] object-contain"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 flex-wrap text-[0.85rem] text-text-muted border-t border-slate-50 pt-5 mt-4">
                  <span className="flex items-center gap-1.5 font-bold">
                    <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${question.authorName}`} alt="" />
                    </div>
                    {question.isAnonymous ? "Anonymous" : question.authorName}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <FiClock />
                    {timeAgo(question.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#2047b8] font-bold">
                    <FiMessageCircle />
                    {question.answerCount} Answers
                  </span>
                  <button
                    className="flex items-center gap-1.5 text-text-muted text-[0.85rem] font-bold px-3 py-1.5 rounded-lg transition-all ml-auto hover:text-red-600 hover:bg-red-50"
                    onClick={handleDeleteQuestion}
                    aria-label="Delete question"
                  >
                    <FiTrash2 /> <span>Delete</span>
                  </button>
                </div>
                {question.tags && question.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-6">
                    {question.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[0.72rem] font-bold uppercase tracking-wide border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div>
            <h2 className="text-xl font-bold text-text-main mb-6 px-1 flex items-center gap-2">
              <FiMessageCircle className="text-[#2047b8]" />
              {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
            </h2>

            {answers.length === 0 ? (
              <div className="py-20 text-center text-text-muted bg-white border-2 border-dashed border-slate-200 rounded-2xl shadow-sm">
                <p className="text-lg font-medium">No answers yet. Be the first to help!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {answers.map((a) => (
                  <AnswerCard
                    key={a._id}
                    answer={a}
                    onUpvote={handleAnswerUpvote}
                    onDownvote={handleAnswerDownvote}
                    onDelete={handleDeleteAnswer}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add Answer Form */}
          <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm" id="add-answer-section">
            <h3 className="text-xl font-bold text-text-main mb-6">Your Answer</h3>
            
            {moderationError && (
              <div id="answer-moderation-error" className="mb-6 animate-shake bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-4 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div className="p-2 bg-red-500/10 rounded-xl text-red-600">
                  <FiShieldOff className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-red-800 font-bold text-sm mb-0.5">Answer Moderated</h4>
                  <p className="text-red-700/80 text-[13px] leading-relaxed font-medium">
                    {moderationError}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <button 
                      type="button" 
                      onClick={() => setModerationError(null)}
                      className="text-[11px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setModerationError(null)}
                  className="p-1 hover:bg-red-500/10 rounded-lg transition-all text-red-400"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmitAnswer} className="flex flex-col gap-5">
              <textarea
                className="w-full px-4 py-4 bg-slate-50 border border-border rounded-xl text-text-main text-sm focus:outline-none focus:border-[#2047b8]/50 focus:ring-4 focus:ring-[#2047b8]/10 placeholder-slate-400 transition-all min-h-[150px] font-medium leading-relaxed resize-y"
                placeholder="Write your answer here..."
                value={answerBody}
                onChange={(e) => setAnswerBody(e.target.value)}
                rows={5}
                id="answer-body-input"
              />

              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-border max-w-sm">
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${answerAnonymous ? "bg-white text-[#2047b8] shadow-sm border border-border" : "text-text-muted hover:text-text-main"}`}
                  onClick={() => setAnswerAnonymous(true)}
                >
                  <FiEyeOff />
                  Anonymous
                </button>
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${!answerAnonymous ? "bg-white text-[#2047b8] shadow-sm border border-border" : "text-text-muted hover:text-text-main"}`}
                  onClick={() => setAnswerAnonymous(false)}
                >
                  <FiEye />
                  Show Name
                </button>
              </div>

              {!answerAnonymous && (
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-text-main text-sm focus:outline-none focus:border-[#2047b8]/50 focus:ring-4 focus:ring-[#2047b8]/10 placeholder-slate-400 transition-all animate-fadeIn font-medium"
                  placeholder="Your display name"
                  value={answerAuthor}
                  onChange={(e) => setAnswerAuthor(e.target.value)}
                  id="answer-author-input"
                />
              )}

              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-[#2047b8] text-white px-8 py-3.5 rounded-2xl text-base font-bold w-full sm:w-auto self-end min-w-[180px] hover:bg-[#1a3da5] hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
                disabled={submitting}
                id="submit-answer"
              >
                <FiSend className="text-lg" />
                {submitting ? "Posting..." : "Post Answer"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default QuestionDetailPage;
