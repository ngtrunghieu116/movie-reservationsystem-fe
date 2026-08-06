import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import Button from '../ui/Button';

const FloatingAITrigger = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white focus:outline-none"
        title="Trợ lý phim CineMind AI"
      >
        {isOpen ? <X size={24} /> : <Bot size={28} className="animate-bounce" />}
      </button>

      {/* AI Chat Popup Placeholder */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-96 animate-scaleUp">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">CineMind AI Assistant</h4>
                <p className="text-[10px] text-slate-400">Trợ lý gợi ý phim thông minh</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-100 max-w-[85%] text-slate-700">
              👋 Xin chào! Tôi là Trợ lý AI của <strong>CineMind</strong>. Tôi có thể giúp bạn tìm kiếm phim, gợi ý suất chiếu hoặc trả lời thắc mắc rạp chiếu phim!
            </div>
            <div className="text-[10px] text-center text-slate-400 my-2">Tính năng AI đang ở dạng UI Placeholder (Sprint 1)</div>
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Nhập câu hỏi của bạn..."
              disabled
              className="flex-1 bg-slate-100 border-none text-xs rounded-lg px-3 py-2 text-slate-400 cursor-not-allowed"
            />
            <Button size="sm" disabled icon={Send}>
              Gửi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingAITrigger;
