import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { 
  ScanFace, ArrowRight, Upload, AlertTriangle, 
  CheckCircle, Activity, Cpu, Zap, Search, ChevronDown
} from 'lucide-react';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedModel, setSelectedModel] = useState("Xception");

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_type', selectedModel);

    try {
      const response = await axios.post('https://hunterrrk-deepcheck-backend.hf.space/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setTimeout(() => {
        setResult(response.data);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("API Error: Ensure Backend is running");
    }
  }, [selectedModel]);

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith('image')) {
          const file = item.getAsFile();
          onDrop([file]);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []} });

  const scrollToDetector = () => {
    document.getElementById('detector').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] font-sans selection:bg-[#005461] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#005461] rounded-lg flex items-center justify-center text-white shadow-sm">
              <ScanFace className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">DeepCheck.</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               SYSTEM ONLINE
             </div>
             <button onClick={scrollToDetector} className="text-sm font-semibold text-gray-600 hover:text-[#005461] transition-colors">
               Scan Image
             </button>
          </div>
        </div>
      </nav>

      <header className="pt-32 pb-24 px-6 bg-[#005461] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00404a] border border-[#006d7d] text-emerald-400 text-xs font-mono mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>V2.0 LIVE</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1]">
            Detect AI-Generated <br />
            <span className="text-[#00B7B5]">Images.</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            A free tool to verify if an image is real or created by Artificial Intelligence. Simple, fast, and accurate.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={scrollToDetector} className="px-8 py-4 bg-white text-[#005461] font-bold rounded-xl hover:bg-gray-100 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 flex items-center gap-2">
              Check Image Now <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 bg-transparent border border-[#00B7B5]/30 text-[#00B7B5] font-semibold rounded-xl hover:bg-[#00B7B5]/10 transition-all flex items-center gap-2">
              See Examples
            </button>
          </div>
        </div>
      </header>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-[#005461] mb-4">How it works</h2>
            <p className="text-gray-500">We check your image in four simple steps.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 relative">
            
            <div className="hidden md:block absolute top-7 left-0 w-full h-0.5 bg-gray-100 -z-10 translate-y-0"></div>

            <div className="flex flex-col items-center text-center bg-white relative">
               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border-4 border-white shadow-sm z-10">
                 <ScanFace className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Step 1</span>
               <h3 className="font-bold text-lg text-gray-900 mb-3">Finds the Face</h3>
               <p className="text-gray-500 text-sm leading-relaxed px-4">
                 The tool automatically finds the person in your photo and ignores the background.
               </p>
            </div>

            <div className="flex flex-col items-center text-center bg-white relative">
               <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 border-4 border-white shadow-sm z-10">
                 <Search className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">Step 2</span>
               <h3 className="font-bold text-lg text-gray-900 mb-3">Scans Details</h3>
               <p className="text-gray-500 text-sm leading-relaxed px-4">
                 It looks closely at tiny pixel details like eyes and skin texture that human eyes might miss.
               </p>
            </div>

            <div className="flex flex-col items-center text-center bg-white relative">
               <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 border-4 border-white shadow-sm z-10">
                 <Cpu className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">Step 3</span>
               <h3 className="font-bold text-lg text-gray-900 mb-3">AI Comparison</h3>
               <p className="text-gray-500 text-sm leading-relaxed px-4">
                 Our smart engine compares your image against thousands of known real and fake photos.
               </p>
            </div>

            <div className="flex flex-col items-center text-center bg-white relative">
               <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 border-4 border-white shadow-sm z-10">
                 <CheckCircle className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Step 4</span>
               <h3 className="font-bold text-lg text-gray-900 mb-3">Instant Result</h3>
               <p className="text-gray-500 text-sm leading-relaxed px-4">
                 You get a clear answer instantly: is the image Real or AI Generated?
               </p>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FAFAFA] border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#005461] mb-4">The Reality of Synthetic Media</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Generative AI is reshaping the digital landscape. Here are the critical risks our engine is designed to detect.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-full h-52 bg-gray-100 rounded-xl mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                <img 
                  src="public\images\Screenshot 2025-12-15 011350.png" 
                  alt="Disinformation" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Disinformation Campaigns</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                AI imagery is rapidly becoming a tool for mass manipulation, capable of fabricating political events or social unrest that never occurred to sway public opinion.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-full h-52 bg-gray-100 rounded-xl mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                <img 
                  src="public\images\190418095933-20190418-facial-recognition-dataset-2-gfx.jpg" 
                  alt="Media Integrity" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Journalistic Integrity</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                In a world where seeing is no longer believing, verifying the authenticity of visual sources is now a critical step for newsrooms, researchers, and archivists.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
               <div className="w-full h-52 bg-gray-100 rounded-xl mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                <img 
                  src="public\images\deep-fake-bias-neurosicence.jpg" 
                  alt="Identity Fraud" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Synthetic Identity Fraud</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Criminals utilize hyper-realistic AI faces to bypass KYC (Know Your Customer) verification, create undetectable bot networks, and execute social engineering attacks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
               <div className="w-full h-52 bg-gray-100 rounded-xl mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                <img 
                  src="public\images\Screenshot 2025-12-15 011900.png" 
                  alt="Commercial Fraud" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">E-Commerce Deception</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                From non-existent luxury rentals to fake product listings, generative AI allows scammers to create convincing visual "proof" for fraudulent sales at scale.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section id="detector" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
             <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#005461]/5 text-[#005461] text-xs font-bold tracking-wider mb-4">
                  <Activity className="w-4 h-4" /> LIVE DEMO
                </div>
                <h2 className="text-3xl font-black text-gray-900">Image Scanner</h2>
             </div>
             
             <div className="relative min-w-[200px]">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Scan Mode</label>
                <div className="relative">
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#005461] focus:border-[#005461] block w-full p-2.5 pr-8 font-mono font-medium cursor-pointer"
                  >
                    <option value="Xception">Xception (SOTA)</option>
                    <option value="MobileNet">MobileNetV2 (Fast)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              
              <div className="p-8 md:p-12">
                <div 
                  {...getRootProps()} 
                  className={`
                    relative h-[400px] rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden bg-gray-50/50
                    ${isDragActive ? 'border-[#005461] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                    ${loading ? 'cursor-wait' : 'cursor-pointer'}
                  `}
                >
                  <input {...getInputProps()} />

                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-8 z-0 opacity-100" />
                      {loading && (
                        <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center font-mono">
                          <div className="w-8 h-8 border-4 border-[#005461] border-t-transparent rounded-full animate-spin mb-4"></div>
                          <div className="text-gray-900 font-bold tracking-widest text-sm">SCANNING</div>
                          <div className="text-xs text-gray-400 mt-2">Checking image...</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="z-10 flex flex-col items-center p-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
                        <Upload className="w-6 h-6 text-[#005461]" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Image</h3>
                      <p className="text-gray-400 text-sm max-w-[200px] leading-relaxed">
                        Drag & drop a file here, or click to browse.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 md:p-12 bg-gray-50/30 flex flex-col justify-center">
                {!result ? (
                  <div className="text-center opacity-40">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">Ready to Scan</p>
                  </div>
                ) : (
                  <div className="animate-fade-in space-y-8">
                    
                    <div>
                       <div className="flex items-center gap-2 mb-3">
                         {result.is_fake ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <CheckCircle className="w-5 h-5 text-emerald-500" />}
                         <span className="font-mono text-xs font-bold text-gray-400 uppercase tracking-wider">Result</span>
                       </div>
                       <div className={`text-5xl font-black tracking-tight ${result.is_fake ? 'text-red-600' : 'text-emerald-600'}`}>
                         {result.is_fake ? 'AI GENERATED' : 'REAL IMAGE'}
                       </div>
                    </div>

                    <div className="h-px bg-gray-200 w-full"></div>

                    <div>
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider">Confidence</span>
                        <span className="text-2xl font-bold text-gray-900">{(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${result.is_fake ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${result.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mode</div>
                        <div className="text-sm font-semibold text-gray-900">{selectedModel === 'Xception' ? 'Detailed' : 'Fast'}</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Time</div>
                        <div className="text-sm font-semibold text-gray-900">{selectedModel === 'Xception' ? '~120ms' : '~42ms'}</div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-12 text-center">
        <p className="text-gray-400 text-sm font-medium">© 2025 DeepCheck.</p>
      </footer>
    </div>
  );
}