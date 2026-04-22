import { FiArrowUp, FiArrowDown } from "react-icons/fi";

function VoteButtons({ votes, onUpvote, onDownvote }) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[42px]" id="vote-buttons">
      <button
        className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted text-xl transition-all hover:bg-slate-100 hover:text-accent active:scale-90"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onUpvote();
        }}
        aria-label="Upvote"
      >
        <FiArrowUp />
      </button>
      <span className="text-[1rem] font-bold text-text-main py-0.5">{votes}</span>
      <button
        className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted text-xl transition-all hover:bg-slate-100 hover:text-red-500 active:scale-90"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDownvote();
        }}
        aria-label="Downvote"
      >
        <FiArrowDown />
      </button>
    </div>
  );
}

export default VoteButtons;