
import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Film, CheckCircle2, Loader2, User, Upload, Image as ImageIcon, Video as VideoIcon, Play, Trash2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { Video } from '../types';
import { CATEGORIES, MOODS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (video: Video) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onPublish }) => {
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step, setStep] = useState<'prompt' | 'preview' | 'success'>('prompt');
  const [generatedData, setGeneratedData] = useState<any>(null);
  
  // Manual form states
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualCategory, setManualCategory] = useState('Entertainment');
  const [manualMood, setManualMood] = useState('Energetic');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>('');
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isUploading]);

  useEffect(() => {
    if (uploadProgress >= 100 && isUploading) {
      setTimeout(() => {
        setIsUploading(false);
        setStep('success');
      }, 500);
    }
  }, [uploadProgress, isUploading]);

  if (!isOpen) return null;

  const handleAIDraft = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate creative video metadata for a new video about: ${prompt}. 
                   Return JSON with title, description, mood (Energetic, Calm, Focus, Dark, or Funny), and duration (mm:ss).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              mood: { type: Type.STRING },
              duration: { type: Type.STRING }
            },
            required: ['title', 'description', 'mood', 'duration']
          }
        }
      });
      
      const data = JSON.parse(response.text);
      setGeneratedData(data);
      setStep('preview');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  const handleThumbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreviewUrl(url);
    }
  };

  const startManualUpload = () => {
    if (!manualTitle || !selectedVideoFile) return;
    setIsUploading(true);
    setUploadProgress(0);
  };

  const handleFinalizePublish = () => {
    const isManual = mode === 'manual';
    const newVideo: Video = isManual ? {
      id: `v-man-${Date.now()}`,
      title: manualTitle,
      description: manualDesc || 'A video by a real creator.',
      thumbnail: thumbnailPreviewUrl || `https://picsum.photos/seed/${Date.now()}/800/450`,
      videoUrl: videoPreviewUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      author: 'Real Human Creator',
      views: '0',
      timestamp: 'Just now',
      category: manualCategory,
      duration: '1:30',
      mood: manualMood as any,
      comments: []
    } : {
      id: `v-ai-${Date.now()}`,
      ...generatedData,
      thumbnail: `https://picsum.photos/seed/${Date.now()}/800/450`,
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      author: 'You (AI Assisted)',
      views: '0',
      timestamp: 'Just now',
      category: 'Innovation',
      comments: []
    };

    onPublish(newVideo);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStep('prompt');
    setPrompt('');
    setManualTitle('');
    setManualDesc('');
    setSelectedVideoFile(null);
    setSelectedThumbnailFile(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setVideoPreviewUrl('');
    setThumbnailPreviewUrl('');
    setMode('ai');
    setIsUploading(false);
    setUploadProgress(0);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <VideoIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-white">Nova Studio</h2>
              <p className="text-xs text-slate-500">Creator Dashboard</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-12 animate-in fade-in">
            <div className="w-full max-w-md space-y-6 text-center">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={376.8}
                    strokeDashoffset={376.8 - (376.8 * uploadProgress) / 100}
                    className="text-indigo-500 transition-all duration-300 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-white">
                  {Math.round(uploadProgress)}%
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Uploading "{manualTitle}"</h3>
                <p className="text-slate-400 text-sm">Processing high-quality stream... Do not close the studio.</p>
              </div>
            </div>
          </div>
        )}

        {/* Mode Switcher */}
        {step !== 'success' && !isUploading && (
          <div className="flex p-1.5 bg-slate-950/50 mx-8 mt-6 rounded-2xl border border-slate-800 shadow-inner">
            <button 
              onClick={() => setMode('ai')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'ai' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Sparkles className="w-4 h-4" /> AI Co-pilot
            </button>
            <button 
              onClick={() => setMode('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'manual' ? 'bg-white text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <User className="w-4 h-4" /> Human Creator
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {step === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Content Transmitted!</h2>
                <p className="text-slate-400">Your video is now live on the global NovaTube stream.</p>
              </div>
              <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-9 bg-slate-800 rounded overflow-hidden">
                  <img src={thumbnailPreviewUrl || `https://picsum.photos/seed/live/200/100`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-white truncate">{manualTitle || (generatedData?.title)}</p>
                  <p className="text-xs text-indigo-400">novatube.live/v/28391</p>
                </div>
              </div>
              <button
                onClick={handleFinalizePublish}
                className="px-8 py-3 bg-white text-slate-950 rounded-full font-bold hover:bg-slate-200 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          ) : mode === 'ai' ? (
            step === 'prompt' ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vision Statement</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your video vision... (e.g., 'A poetic journey through the rings of Saturn')"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 h-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-slate-200"
                  />
                </div>
                <button
                  onClick={handleAIDraft}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  Generate Content Architecture
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-indigo-400">{generatedData?.title}</h3>
                    <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-mono">{generatedData?.duration}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed italic border-l-4 border-indigo-600/30 pl-6">{generatedData?.description}</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep('prompt')} className="flex-1 border border-slate-800 py-4 rounded-2xl font-bold text-slate-500 hover:text-white transition-all">Revise Draft</button>
                  <button onClick={() => setStep('success')} className="flex-1 bg-white text-slate-950 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all">Finalize & Post</button>
                </div>
              </div>
            )
          ) : (
            <div className="space-y-8 animate-in slide-in-from-left-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Media Upload */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Video Content</label>
                    <div 
                      onClick={() => videoInputRef.current?.click()}
                      className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${selectedVideoFile ? 'border-green-500/50 bg-green-500/5' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/20 bg-slate-950'}`}
                    >
                      {videoPreviewUrl ? (
                        <div className="relative w-full h-full">
                          <video src={videoPreviewUrl} className="w-full h-full object-cover" muted loop autoPlay />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Trash2 className="w-8 h-8 text-white hover:text-red-500" onClick={(e) => { e.stopPropagation(); setSelectedVideoFile(null); setVideoPreviewUrl(''); }} />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-6 space-y-3">
                          <Upload className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="text-sm font-bold text-white">Select Video</p>
                          <p className="text-xs text-slate-500">MP4, WEBM up to 500MB</p>
                        </div>
                      )}
                      <input type="file" ref={videoInputRef} onChange={handleVideoFileChange} accept="video/*" className="hidden" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Custom Thumbnail</label>
                    <div 
                      onClick={() => thumbInputRef.current?.click()}
                      className={`relative h-28 rounded-2xl border-2 border-dashed transition-all flex items-center gap-4 px-6 cursor-pointer overflow-hidden ${selectedThumbnailFile ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/20 bg-slate-950'}`}
                    >
                      {thumbnailPreviewUrl ? (
                        <>
                          <img src={thumbnailPreviewUrl} className="w-20 h-full object-cover rounded-lg" />
                          <p className="text-sm text-slate-300 font-medium">Thumbnail Selected</p>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                          </div>
                          <p className="text-sm text-slate-500">Optional: Upload custom image</p>
                        </>
                      )}
                      <input type="file" ref={thumbInputRef} onChange={handleThumbFileChange} accept="image/*" className="hidden" />
                    </div>
                  </div>
                </div>

                {/* Right Side: Metadata */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Video Title</label>
                    <input
                      type="text"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      placeholder="Title your creation..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder:text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                    <textarea
                      value={manualDesc}
                      onChange={(e) => setManualDesc(e.target.value)}
                      placeholder="Tell the community what this is about..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white resize-none text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                      <select
                        value={manualCategory}
                        onChange={(e) => setManualCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-300"
                      >
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vibe</label>
                      <select
                        value={manualMood}
                        onChange={(e) => setManualMood(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-300"
                      >
                        {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={startManualUpload}
                disabled={!manualTitle || !selectedVideoFile}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-xl shadow-indigo-600/30 active:scale-[0.98]"
              >
                <Upload className="w-6 h-6" />
                Transmit to NovaTube
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
