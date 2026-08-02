import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Xin chào! Tôi là CineMind AI Assistant. Hôm nay bạn muốn xem phim gì hay cần gợi ý theo tâm trạng nào?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    '🎬 Phim hành động hay nhất',
    '❤️ Phim lãng mạn nhẹ nhàng',
    '🍿 Phim hoạt hình cho gia đình',
    '🔥 Phim sắp chiếu hot nhất',
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = `Dựa trên yêu cầu "${query}", CineMind AI đề xuất các phim phù hợp nhất với tâm trạng của bạn: 1. Godzilla x Kong 2. Mai 3. Dune 2! Bạn có muốn tôi hỗ trợ đặt vé luôn không?`;
      if (query.includes('hành động')) {
        aiText = 'Dựa trên ý thích hành động kịch tính, tôi gợi ý bạn xem "Godzilla x Kong: Đế Chế Mới" hoặc "Biệt Đội Tử Thần". Đã có suất chiếu tối nay tại rạp gần bạn!';
      } else if (query.includes('lãng mạn') || query.includes('tình cảm')) {
        aiText = 'Tâm trạng thư giãn lãng mạn thích hợp nhất với phim "Mai" hoặc "Thanh Xuân 18x2". Cả hai phim đang có lượng vé bán ra rất cao!';
      } else if (query.includes('hoạt hình') || query.includes('gia đình')) {
        aiText = 'Dành cho gia đình & trẻ em, "Kung Fu Panda 4" là sự lựa chọn số 1 với nhiều tiếng cười và suất chiếu sinh động!';
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: aiText },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  CineMind AI <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                </h3>
                <p className="text-xs text-rose-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Trợ lý tư vấn phim thông minh
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-slate-800 text-white'
                      : 'bg-red-100 text-red-600 border border-red-200'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[78%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-red-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-2">
                <Bot className="w-4 h-4 text-red-500 animate-spin" />
                <span>CineMind AI đang suy nghĩ...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-xs bg-slate-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 px-2.5 py-1.5 rounded-full border border-slate-200 whitespace-nowrap transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi AI phim bất kỳ..."
                className="flex-1 bg-slate-100 border border-slate-200 text-slate-800 text-sm rounded-2xl px-4 py-2.5 focus:outline-none focus:border-red-500 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center shadow-md shadow-red-600/30 transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-red-600/40 hover:scale-105 transition-all duration-300 border border-red-500/30"
      >
        <div className="relative">
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white"></span>
        </div>
        <span className="font-semibold text-sm tracking-wide">Trợ Lý AI</span>
      </button>
    </div>
  );
};

export default AIChatWidget;
