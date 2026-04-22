import { FiUser, FiClock, FiTrash2 } from "react-icons/fi";
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

function AnswerCard({ answer, onUpvote, onDownvote, onDelete }) {
  return (
    <div className="flex gap-5 p-5 bg-white border border-border rounded-xl mb-3 shadow-sm hover:shadow-md transition-all duration-200" id={`answer-${answer._id}`}>
      <div className="flex flex-col items-center">
        <VoteButtons
          votes={answer.upvotes}
          onUpvote={() => onUpvote(answer._id)}
          onDownvote={() => onDownvote(answer._id)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[1.05rem] text-slate-800 leading-relaxed mb-4 whitespace-pre-wrap font-semibold">{answer.body}</p>
        <div className="flex items-center gap-4 text-[0.82rem] text-text-muted border-t border-slate-50 pt-4">
          <span className="flex items-center gap-1.5 font-bold text-text-main">
            <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${answer.authorName}`} alt="" />
            </div>
            {answer.isAnonymous ? "Anonymous" : answer.authorName}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <FiClock />
            {timeAgo(answer.createdAt)}
          </span>
          <button
            className="flex items-center gap-1.5 text-text-muted text-[0.82rem] font-bold px-2 py-1 rounded-md transition-all ml-auto hover:text-red-500 hover:bg-red-50"
            onClick={() => onDelete(answer._id)}
            aria-label="Delete answer"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnswerCard;
