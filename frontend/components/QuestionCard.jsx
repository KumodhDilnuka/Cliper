import { Link } from "react-router-dom";
import { FiMessageSquare, FiShare2, FiBookmark } from "react-icons/fi";
import VoteButtons from "./VoteButtons";

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

function QuestionCard({ question, onUpvote, onDownvote, showVotes = true }) {
  const isProfessor = question.authorRole === "PROFESSOR"; // Assuming this might exist or we can mock it

  return (
    <div
      className="group flex bg-white border border-border rounded-2xl overflow-hidden hover:shadow-premium transition-all duration-300 relative"
      id={`question-${question._id}`}
    >
      {/* Active Accent Line (Top left decor as seen in SS) */}
      <div className="w-1.5 bg-indigo-600 self-stretch opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex p-5 gap-5 flex-1">
        {/* Left Side: Votes (hidden when showVotes=false) */}
        {showVotes ? (
          <div className="flex flex-col items-center">
            <VoteButtons
              votes={question.upvotes}
              onUpvote={() => onUpvote && onUpvote(question._id)}
              onDownvote={() => onDownvote && onDownvote(question._id)}
            />
          </div>
        ) : null}

        {/* Right Side: Content */}
        <div className="flex-1 min-w-0">
          <Link to={`/question/${question._id}`} className="block">
            {/* Author Info */}
            <div className="flex items-center gap-2.5 mb-3 text-[0.82rem]">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-100">
                <img 
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${question.authorName || 'anon'}`} 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-text-main">{question.isAnonymous ? "Anonymous" : question.authorName}</span>
              <span className={`px-2 py-0.5 rounded text-[0.65rem] font-black uppercase tracking-wider ${
                isProfessor ? 'bg-slate-200 text-slate-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {isProfessor ? 'PROFESSOR' : 'STUDENT'}
              </span>
              <span className="text-text-muted flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                {timeAgo(question.createdAt)}
              </span>
            </div>

            {/* Title & Body */}
            <h3 className="text-xl font-extrabold text-slate-800 mb-2 leading-tight group-hover:text-accent transition-colors">
              {question.title}
            </h3>
            <p className="text-[0.92rem] text-text-secondary leading-relaxed mb-4 line-clamp-3">
              {question.body}
            </p>

            {/* Image Snippet */}
            {question.imageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden border border-slate-100 shadow-sm max-h-[300px]">
                <img
                  src={question.imageUrl}
                  alt="Question Attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-6">
                {question.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[0.72rem] font-bold uppercase tracking-wide border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>

          {/* Interaction Footer */}
          <div className="flex items-center gap-6 text-[0.82rem] text-text-muted border-t border-slate-50 pt-4 mt-auto">
            <button className="flex items-center gap-2 hover:text-accent font-bold transition-colors">
              <FiMessageSquare className="text-lg" />
              <span>{question.answerCount} Comments</span>
            </button>
            <button className="flex items-center gap-2 hover:text-accent font-bold transition-colors">
              <FiShare2 className="text-lg" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-2 hover:text-accent font-bold transition-colors">
              <FiBookmark className="text-lg" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
