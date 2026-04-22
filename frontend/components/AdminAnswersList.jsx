import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiChevronDown, FiChevronUp, FiTrash2, FiUser, FiClock, FiThumbsUp, FiMessageSquare } from "react-icons/fi";
import { getAdminAnswers, deleteAdminAnswer } from "../services/api";

const AdminAnswersList = ({ questions }) => {
  const [openQuestionId, setOpenQuestionId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const loadAnswers = async (questionId) => {
    if (openQuestionId === questionId) {
      setOpenQuestionId(null);
      return;
    }

    // Use cached and refresh if needed
    try {
      setLoadingId(questionId);
      const { data } = await getAdminAnswers(questionId);
      setAnswers((prev) => ({ ...prev, [questionId]: data }));
      setOpenQuestionId(questionId);
    } catch (error) {
      toast.error("Database connection interrupted");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteAnswer = async (answerId, questionId) => {
    if (!window.confirm("Authorize permanent deletion of this contribution?")) return;
    try {
      await deleteAdminAnswer(answerId);
      setAnswers((prev) => ({
        ...prev,
        [questionId]: prev[questionId].filter((a) => a._id !== answerId),
      }));
      toast.success("Contribution expunged", { icon: "🧹" });
    } catch (error) {
      toast.error("Declassification failed");
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Registry Empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q._id} className={`overflow-hidden transition-all duration-500 border rounded-[2.5rem] ${openQuestionId === q._id ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
          <div 
            className="flex items-center justify-between p-6 cursor-pointer group"
            onClick={() => loadAnswers(q._id)}
          >
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2 mb-2">
                 <div className={`w-2 h-2 rounded-full ${q.answerCount > 0 ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Records</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                {q.title}
              </h3>
              <p className="text-slate-500 text-xs font-semibold mt-1 truncate">{q.body}</p>
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[11px] font-black text-slate-900">{q.answerCount || 0}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Responses</span>
               </div>
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${openQuestionId === q._id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                  {loadingId === q._id ? (
                     <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : openQuestionId === q._id ? (
                    <FiChevronUp className="text-xl" />
                  ) : (
                    <FiChevronDown className="text-xl" />
                  )}
               </div>
            </div>
          </div>

          {openQuestionId === q._id && (
            <div className="px-6 pb-6 animate-fadeIn">
              <div className="h-px bg-slate-200 mb-6"></div>
              {answers[q._id] && answers[q._id].length > 0 ? (
                <div className="space-y-3">
                  {answers[q._id].map((a) => (
                    <div key={a._id} className="group/item flex items-center justify-between gap-6 p-5 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-4">{a.body}</p>
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                 <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${a.authorName}`} alt="" />
                              </div>
                              <span className="text-[11px] font-black text-slate-900">{a.isAnonymous ? 'Restricted' : a.authorName}</span>
                           </div>
                           
                           <div className="flex items-center gap-4 text-slate-400">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight">
                                 <FiClock />
                                 {new Date(a.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight text-blue-500">
                                 <FiThumbsUp />
                                 {a.upvotes || 0}
                              </div>
                           </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDeleteAnswer(a._id, q._id)} 
                        className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all border border-slate-100"
                      > 
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-white/50 rounded-[2rem] border border-dashed border-slate-200">
                  <FiMessageSquare className="text-3xl text-slate-200 mx-auto mb-4" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No contributions found</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminAnswersList;
