import React, { useState } from "react";

const ChatPanel_lec = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="bg-white rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b font-bold">Session Chat</div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        <div className="bg-gray-200 p-3 rounded-lg text-sm self-start">
          Hello everyone 👋
        </div>

        <div className="bg-blue-500 text-white p-3 rounded-lg text-sm self-end">
          Welcome to the session
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel_lec;