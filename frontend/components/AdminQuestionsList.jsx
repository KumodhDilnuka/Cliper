import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle, FiXCircle, FiTrash2, FiExternalLink, FiUser, FiClock, FiMessageSquare, FiShield } from "react-icons/fi";
import { deleteQuestion, approveQuestion, rejectQuestion } from "../services/api";

const AdminQuestionsList = ({ questions }) => {
  const [questionsList, setQuestionsList] = useState(questions);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    setQuestionsList(questions);
  }, [questions]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this question and its historical data?")) return;

    setActionLoading(id);
    try {
      await deleteQuestion(id);
      setQuestionsList((prev) => prev.filter((q) => q._id !== id));
      toast.success("Record expunged successfully", { icon: "🗑️" });
    } catch (error) {
      toast.error("Deletion protocol failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(`approve-${id}`);
    try {
      await approveQuestion(id);
      setQuestionsList((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: "approved" } : q))
      );
      toast.success("Content Authorized", { icon: "✅" });
    } catch (error) {
      toast.error("Authorization failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(`reject-${id}`);
    try {
      await rejectQuestion(id);
      setQuestionsList((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: "rejected" } : q))
      );
      toast.success("Content Restricted", { icon: "🚫" });
    } catch (error) {
      toast.error("Rejection failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (questionsList.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <FiShield className="text-3xl text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">Vault Empty</h3>
        <p className="text-slate-500 font-medium mt-1">No content records match the current filter.</p>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-4">
      {questionsList.map((question) => (
        <div
          key={question._id}
          className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1"
        >
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            {/* Question Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border ${getStatusStyle(question.status)}`}>
                  {question.status || "Pending Review"}
                </span>
                <span className="text-[11px] font-bold text-slate-400">ID: {question._id.slice(-6).toUpperCase()}</span>
              </div>

              <div className="mb-4">
                <a
                  href={`/question/${question._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight block mb-2"
                >
                  {question.title}
                </a>
                <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                  {question.body}
                </p>
              </div>

              {/* Meta Stats Panel */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${question.authorName}`} alt="" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-800 leading-none mb-0.5">{question.isAnonymous ? "Private Source" : question.authorName}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Contributor</span>
                   </div>
                </div>

                <div className="flex items-center gap-3 h-8 px-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <FiClock className="text-xs" />
                    <span className="text-[11px] font-bold">{new Date(question.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="w-px h-3 bg-slate-200"></div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <FiMessageSquare className="text-xs" />
                    <span className="text-[11px] font-bold">{question.answerCount || 0}</span>
                  </div>
                </div>

                {question.tags && (
                  <div className="flex gap-2">
                    {question.tags.map((tag, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-black uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Premium Action Console */}
            <div className="flex gap-2 xl:flex-col min-w-max p-2 bg-slate-50 xl:bg-transparent rounded-2xl sm:self-end">
              <button
                onClick={() => handleApprove(question._id)}
                disabled={actionLoading === `approve-${question._id}` || question.status === "approved"}
                className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white hover:bg-green-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-500/20 disabled:grayscale disabled:opacity-30 disabled:scale-95"
              >
                <FiCheckCircle className="text-sm" />
                Authorize
              </button>

              <button
                onClick={() => handleReject(question._id)}
                disabled={actionLoading === `reject-${question._id}` || question.status === "rejected"}
                className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white hover:bg-red-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 disabled:grayscale disabled:opacity-30 disabled:scale-95"
              >
                <FiXCircle className="text-sm" />
                Restrict
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(question._id)}
                  disabled={actionLoading === question._id}
                  className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-2xl shadow-sm transition-all flex-1 xl:flex-none"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminQuestionsList;
