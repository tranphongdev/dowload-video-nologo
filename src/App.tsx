/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Video, 
  Music, 
  Image as ImageIcon,
  CheckCircle2, 
  AlertCircle, 
  Zap,
  Shield,
  Smartphone,
  ChevronDown,
  Github,
  Twitter
} from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  cover: string;
  play_url: string;
  hd_play_url: string;
  music_url: string;
  images?: string[];
  author: {
    nickname: string;
    avatar: string;
    unique_id: string;
  };
}

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const triggerDownload = async (proxyUrl: string, filename: string, id: string) => {
    setDownloading(id);
    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Tải xuống thất bại');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error(err);
      setError('Lỗi khi tải tệp: ' + err.message);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownload = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setVideoData(null);
    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể lấy thông tin video. Vui lòng kiểm tra lại link.');
      setVideoData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-white antialiased">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-cyan-500/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-fuchsia-600/20 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/5 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 rotate-3">
              <Download className="text-white w-6 h-6 -rotate-3" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 uppercase italic">VortexDL</span>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-white transition-colors duration-300">Tính năng</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Hướng dẫn</a>
            <a href="#" className="hover:text-white transition-colors duration-300">API</a>
          </nav>
          <div className="flex items-center gap-4">
             <button className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold tracking-wider transition-all active:scale-95">
                Đăng nhập
             </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-40">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            Smarter Video Downloader
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tightest mb-8 leading-[0.9]"
          >
            TẢI VIDEO <span className="text-cyan-400 italic">KHÔNG LOGO</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium"
          >
            Hỗ trợ TikTok, Douyin với chất lượng gốc 4K/HD. Hoàn toàn miễn phí, tốc độ ánh sáng.
          </motion.p>
        </div>

        {/* Input area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="relative group p-1.5 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 focus-within:border-cyan-500/50 transition-all duration-500 shadow-2xl shadow-black/40">
            <div className="rounded-[2.2rem] flex flex-col md:flex-row items-center gap-2 p-2">
              <div className="flex-1 relative flex items-center w-full">
                <input 
                  type="text" 
                  placeholder="Dán link TikTok hoặc Douyin vào đây..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 w-full bg-transparent border-none outline-none px-6 py-4 pr-12 text-lg placeholder:text-slate-500 font-medium focus:ring-0"
                />
                <AnimatePresence>
                  {url && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => {
                        setUrl('');
                        setError(null);
                      }}
                      className="absolute right-4 p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-colors"
                    >
                      <AlertCircle className="w-5 h-5 rotate-45" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <button 
                onClick={handleDownload}
                disabled={loading}
                className="w-full md:w-auto bg-white hover:bg-cyan-50 disabled:bg-slate-700 text-slate-950 font-black uppercase tracking-wider py-4 px-10 rounded-[1.8rem] transition-all flex items-center justify-center gap-2 group/btn shadow-lg active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    Tải ngay
                    <Zap className="w-5 h-5 fill-slate-950" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 max-w-3xl mx-auto flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl backdrop-blur-md"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quality Options grid (Static visualization for Frosted Glass theme) */}
        {!videoData && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto mt-20">
            <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl group cursor-pointer hover:bg-white/10 transition-all">
              <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2">Premium</div>
              <div className="text-xl font-bold italic">Ultra HD 4K</div>
              <div className="text-sm text-slate-400 mt-1 italic">Không Watermark</div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl border-cyan-500/50 relative">
              <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Standard</div>
              <div className="text-xl font-bold italic">Full HD 1080p</div>
              <div className="text-sm text-slate-400 mt-1 italic">Khuyên dùng</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl group cursor-pointer hover:bg-white/10 transition-all">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Audio Only</div>
              <div className="text-xl font-bold italic">MP3 320kbps</div>
              <div className="text-sm text-slate-400 mt-1 italic">Chất lượng cao</div>
            </div>
          </div>
        )}

        {/* Results area */}
        <AnimatePresence mode="wait">
          {videoData && (
            <motion.div 
              key={videoData.id}
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="mt-20 overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-3xl shadow-4xl max-w-4xl mx-auto"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Preview Container */}
                <div className="w-full lg:w-2/5 aspect-[4/5] lg:aspect-auto lg:h-[600px] relative overflow-hidden group/preview">
                  <img 
                    src={videoData.cover} 
                    alt="Video preview" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                     <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        <Video className="w-8 h-8" />
                     </div>
                  </div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex items-center gap-4">
                      <img 
                        src={videoData.author.avatar} 
                        alt="Author" 
                        className="w-12 h-12 rounded-2xl border-2 border-white/20 shadow-xl"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-black text-lg leading-tight">{videoData.author.nickname}</p>
                        <p className="text-sm text-slate-400 font-bold tracking-tight">@{videoData.author.unique_id}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info & Download Panel */}
                <div className="flex-1 p-10 lg:p-14 flex flex-col justify-between">
                  <div className="mb-12">
                    <div className="flex gap-3 mb-8">
                      <span className="bg-cyan-500/20 text-cyan-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">
                        {videoData.images ? `${videoData.images.length} Ảnh` : 'HD Quality'}
                      </span>
                      <span className="bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                        No Watermark
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black mb-6 leading-tight tracking-tighter italic">
                      {videoData.title || (videoData.images ? "Bộ sưu tập ảnh" : "Video này không được tác giả đặt tiêu đề.")}
                    </h2>
                  </div>

                  <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {videoData.images && videoData.images.length > 0 ? (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-black uppercase text-cyan-400">Danh sách ảnh ({videoData.images.length})</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {videoData.images.map((img, idx) => {
                            const downloadId = `img-${idx}`;
                            return (
                              <div key={idx} className="relative group/img rounded-2xl overflow-hidden aspect-[3/4] border border-white/10 bg-white/5">
                                <img 
                                  src={img} 
                                  alt={`Slide ${idx + 1}`} 
                                  className="w-full h-full object-cover transition-transform group-hover/img:scale-110"
                                  referrerPolicy="no-referrer"
                                />
                                <div className={`absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center ${downloading === downloadId ? 'opacity-100' : 'opacity-0 group-hover/img:opacity-100'}`}>
                                  <button 
                                    onClick={() => triggerDownload(`/api/proxy?url=${encodeURIComponent(img)}&filename=image_${videoData.id}_${idx + 1}.jpg`, `image_${videoData.id}_${idx + 1}.jpg`, downloadId)}
                                    disabled={downloading !== null}
                                    className="bg-white text-black p-3 rounded-full hover:bg-cyan-400 transition-colors shadow-lg disabled:opacity-50"
                                  >
                                    {downloading === downloadId ? (
                                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                      <Download className="w-5 h-5" />
                                    )}
                                  </button>
                                </div>
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-black italic border border-white/10">
                                  #{idx + 1}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => triggerDownload(`/api/proxy?url=${encodeURIComponent(videoData.hd_play_url || videoData.play_url)}&filename=video_${videoData.id}.mp4`, `video_${videoData.id}.mp4`, 'hd-video')}
                          disabled={downloading !== null}
                          className="group/dl h-20 bg-white text-slate-950 font-black uppercase tracking-widest rounded-3xl flex items-center justify-center gap-3 hover:bg-cyan-50 transition-all active:scale-98 shadow-xl disabled:opacity-50"
                        >
                          {downloading === 'hd-video' ? (
                            <div className="w-6 h-6 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                          ) : (
                            <>
                              <Download className="w-6 h-6 group-hover/dl:animate-bounce" />
                              Tải ngay (HD)
                            </>
                          )}
                        </button>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => triggerDownload(`/api/proxy?url=${encodeURIComponent(videoData.play_url)}&filename=video_sd_${videoData.id}.mp4`, `video_sd_${videoData.id}.mp4`, 'sd-video')}
                            disabled={downloading !== null}
                            className="h-16 bg-white/5 border border-white/10 hover:bg-white/10 font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                          >
                             {downloading === 'sd-video' ? (
                               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                             ) : (
                               <>
                                 <Video className="w-4 h-4 opacity-40" />
                                 Video SD
                               </>
                             )}
                          </button>
                          <button 
                            onClick={() => triggerDownload(`/api/proxy?url=${encodeURIComponent(videoData.music_url)}&filename=music_${videoData.id}.mp3`, `music_${videoData.id}.mp3`, 'audio')}
                            disabled={downloading !== null}
                            className="h-16 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                          >
                            {downloading === 'audio' ? (
                              <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                            ) : (
                              <>
                                <Music className="w-4 h-4" />
                                Audio Only
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-10 flex flex-col items-center gap-4">
                    <button 
                      onClick={() => {
                        setVideoData(null);
                        setUrl('');
                      }}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/60 hover:text-cyan-400 transition-colors py-2 px-4 rounded-full border border-cyan-400/10 hover:border-cyan-400/30"
                    >
                      Tải video khác
                    </button>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] text-center">
                      An toàn • Nhanh chóng • Miễn phí
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Highlights */}
        <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureItem 
            icon={<Zap className="w-8 h-8 text-cyan-400" />}
            title="LIGHTNING FAST"
            desc="Quy trình xử lý hiện đại, lấy link trực tiếp trong nháy mắt."
          />
          <FeatureItem 
            icon={<Shield className="w-8 h-8 text-indigo-400" />}
            title="SECURE BY DEFAULT"
            desc="Không yêu cầu đăng nhập, không theo dõi, bảo mật tuyệt đối."
          />
          <FeatureItem 
            icon={<CheckCircle2 className="w-8 h-8 text-emerald-400" />}
            title="PURE QUALITY"
            desc="Giữ nguyên độ phân giải gốc từ TikTok, không nén, không mờ."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-24 mt-20 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 text-center md:text-left">
           <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Download className="text-white w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl tracking-tighter uppercase italic">VortexDL</span>
              </div>
              <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed text-sm">
                VortexDL là công cụ hàng đầu hỗ trợ người sáng tạo nội dung tải xuống các tài nguyên video chất lượng cao mà không bị dính logo phiền phức.
              </p>
              <div className="flex gap-6">
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Github className="w-4 h-4" /></a>
              </div>
           </div>
           
           <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-8">Navigation</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Trang chủ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cách sử dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bảo mật</a></li>
              </ul>
           </div>

           <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-8">Language</h4>
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 justify-center md:justify-start">
                Tiếng Việt (VN)
                <ChevronDown className="w-4 h-4" />
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 text-center">© 2024 VortexDL Video Network. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Privacy Policy</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
  return (
    <div className="group">
      <div className="mb-8 p-6 inline-block rounded-[2rem] bg-white/5 border border-white/10 group-hover:bg-orange-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
        <div className="group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-black mb-4 tracking-tighter uppercase italic">{title}</h3>
      <p className="text-white/30 font-medium leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
