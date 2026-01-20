
import React, { useState, useEffect, useRef } from 'react';
import { Video, ChatMessage, Comment } from '../types';
import { ThumbsUp, ThumbsDown, Share2, Save, Sparkles, Send, Mic, BrainCircuit, MessageSquare, ListFilter } from 'lucide-react';
import { summarizeVideo, chatWithVideo } from '../services/geminiService';

interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const [summary, setSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>(video.comments || [
    { id: 'c1', author: 'QuantumExplorer', text: 'This is absolutely mind-blowing content!', timestamp: '2 hours ago', likes: 142 },
    { id: 'c2', author: 'FutureVoyager', text: 'I love how the AI explains the complex parts.', timestamp: '1 hour ago', likes: 85 }
  ]);
  const [newComment, setNewComment] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSummarize = async () => {
    setLoadingSummary(true);
    const result = await summarizeVideo(video.title, video.description);
    setSummary(result);
    setLoadingSummary(false);
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsChatLoading(true);

    const response = await chatWithVideo(userInput, chatMessages, `${video.title}: ${video.description}`);
    
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: response,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, aiMsg]);
    setIsChatLoading(false);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `c-${Date.now()}`,
      author: 'You',
      text: newComment,
      timestamp: 'Just now',
      likes: 0
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="lg:col-span-2 space-y-6">
        {/* The Player */}
        <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative group">
          <video 
            src={video.videoUrl} 
            controls 
            className="w-full h-full"
            poster={video.thumbnail}
            autoPlay
          />
        </div>

        {/* Video Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{video.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-y border-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                  <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${video.author}`} alt={video.author} />
                </div>
                <div>
                  <h4 className="font-bold">{video.author}</h4>
                  <p className="text-xs text-slate-400">1.2M subscribers</p>
                </div>
              </div>
              <button className="bg-slate-100 text-slate-950 px-6 py-2 rounded-full font-bold hover:bg-white transition-colors">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                <button className="px-4 py-2 hover:bg-slate-800 flex items-center gap-2 border-r border-slate-800 transition-colors">
                  <ThumbsUp className="w-5 h-5" /> 24K
                </button>
                <button className="px-4 py-2 hover:bg-slate-800 transition-colors">
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>
              <button className="p-2 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 transition-colors">
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* AI Insights Bar */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-slate-200">AI Narrative Insights</h3>
              </div>
              {!summary && (
                <button 
                  onClick={handleSummarize}
                  disabled={loadingSummary}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                >
                  {loadingSummary ? 'Synthesizing...' : 'Generate Deep Summary'}
                </button>
              )}
            </div>

            {summary ? (
              <div className="space-y-3 animate-in fade-in duration-500">
                <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-indigo-500 pl-4">
                  "{summary.summary}"
                </p>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl">
                <p className="text-slate-500 text-sm">Tap generate to unlock video intelligence</p>
              </div>
            )}
          </div>

          {/* Real People Comments Section */}
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-slate-400" />
                <h3 className="text-xl font-bold">{comments.length} Comments</h3>
              </div>
              <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <ListFilter className="w-4 h-4" /> Sort by
              </button>
            </div>

            <form onSubmit={handlePostComment} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white font-bold">
                Y
              </div>
              <div className="flex-1 space-y-2">
                <input 
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment as a real human..."
                  className="w-full bg-transparent border-b border-slate-800 focus:border-indigo-500 py-2 focus:outline-none transition-all text-slate-200"
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setNewComment('')} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={!newComment.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold disabled:opacity-50 disabled:bg-slate-800">Comment</button>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author}`} alt={comment.author} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">@{comment.author}</span>
                      <span className="text-xs text-slate-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-300">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white">
                        <ThumbsUp className="w-4 h-4" /> {comment.likes}
                      </button>
                      <button className="text-xs text-slate-500 hover:text-white">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[600px] lg:h-auto lg:sticky lg:top-20">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl flex flex-col h-full overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold">Chat with Video</h3>
            </div>
            <div className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
              AI Active
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chatMessages.length === 0 && (
              <div className="text-center py-8 space-y-2">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-sm text-slate-500">Ask anything about this content.</p>
              </div>
            )}
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChat} className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask Nova..."
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button 
                  type="submit" 
                  disabled={!userInput.trim() || isChatLoading}
                  className="p-2 bg-indigo-600 rounded-xl text-white disabled:opacity-50 hover:bg-indigo-500 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
