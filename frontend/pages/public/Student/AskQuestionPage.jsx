import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../../../services/api";
import toast from "react-hot-toast";
import { FiSend, FiEyeOff, FiEye, FiArrowLeft, FiImage, FiX, FiShieldOff } from "react-icons/fi";
import { supabase } from "../../../src/supabaseClient";

function AskQuestionPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [moderationError, setModerationError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;
    const fileExt = image.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `questions/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("ITPM")
      .upload(filePath, image);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("ITPM")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    try {
      setSubmitting(true);
      setModerationError(null);

      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage();
      }

      await createQuestion({
        title: title.trim(),
        body: body.trim(),
        authorName: isAnonymous ? "Anonymous" : authorName.trim(),
        isAnonymous,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        imageUrl,
      });
      toast.success("Question posted!");
      navigate("/qa");
    } catch (error) {
      console.error("Error creating question:", error);

      // Handle AI Moderation Rejection
      if (error.response && error.response.status === 403) {
        const reason = error.response.data?.reason || "This content does not meet university guidelines.";
        setModerationError(reason);
        toast.error("Rejected by AI Moderator", { icon: '🤖' });
        
        // Scroll to error
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error(error.message || "Failed to post question");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeInUp" id="ask-page">
      <button className="flex items-center gap-2 text-text-muted hover:text-slate-900 hover:bg-white bg-transparent px-3 py-1.5 rounded-lg transition-all text-sm mb-4" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-extrabold tracking-tight text-blue-800 mb-1">Ask a Question</h2>
        <p className="text-slate-400 text-sm mb-6">
          Share your question with the community. You can post anonymously.
        </p>

        {moderationError && (
          <div className="mb-6 animate-shake bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-4 shadow-sm relative overflow-hidden group transition-all duration-500 ease-in-out">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="p-2 bg-red-500/10 rounded-xl text-red-600">
              <FiShieldOff className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-red-800 font-bold text-sm mb-0.5">Content Moderated</h4>
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
                <span className="w-1 h-1 rounded-full bg-red-300"></span>
                <span className="text-[11px] text-red-400 font-medium italic">Please revise your question to meet our educational guidelines.</span>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setModerationError(null)}
              className="p-1 hover:bg-red-500/10 rounded-lg transition-all text-red-400 group-hover:text-red-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="question-title" className="text-[0.82rem] font-bold text-text-muted uppercase tracking-wider">Title</label>
            <input
              id="question-title"
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400 transition-all font-medium"
              placeholder="What's your question?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={300}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="question-body" className="text-[0.82rem] font-bold text-text-muted uppercase tracking-wider">Details</label>
            <textarea
              id="question-body"
              className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400 transition-all min-h-[150px] leading-relaxed resize-y font-medium"
              placeholder="Provide more details about your question..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="question-tags" className="text-[0.82rem] font-bold text-text-muted uppercase tracking-wider">Tags (comma separated, optional)</label>
            <input
              id="question-tags"
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400 transition-all font-medium"
              placeholder="e.g. math, physics, programming"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.82rem] font-bold text-text-muted uppercase tracking-wider">Image (Optional)</label>
            <div className="relative group">
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl bg-slate-50 hover:border-blue-500/50 hover:bg-indigo-50/50 transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiImage className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-500 font-medium">Click to upload or drag and drop</p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, GIF (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              ) : (
                <div className="relative w-full h-48 bg-slate-50 rounded-xl overflow-hidden border border-border">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-border">
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${isAnonymous ? "bg-white text-blue-600 shadow-sm border border-border" : "text-text-muted hover:text-slate-900"}`}
              onClick={() => setIsAnonymous(true)}
              id="toggle-anonymous"
            >
              <FiEyeOff />
              Post Anonymously
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${!isAnonymous ? "bg-white text-blue-600 shadow-sm border border-border" : "text-text-muted hover:text-slate-900"}`}
              onClick={() => setIsAnonymous(false)}
              id="toggle-named"
            >
              <FiEye />
              Show My Name
            </button>
          </div>

          {!isAnonymous && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label htmlFor="author-name" className="text-[0.82rem] font-bold text-text-muted uppercase tracking-wider">Your Display Name</label>
              <input
                id="author-name"
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400 transition-all font-medium"
                placeholder="Enter your name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold text-[1rem] transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            disabled={submitting}
            id="submit-question"
          >
            <FiSend />
            {submitting ? "Posting..." : "Post Question"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AskQuestionPage;
