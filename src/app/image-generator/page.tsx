"use client";

import { useState } from "react";
import Link from "next/link";

export default function ImageGenerator() {
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('yunwuai_api_key') || '';
    }
    return '';
  });
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [model, setModel] = useState("gpt-image-2-all");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const ratios = ["1:1", "16:9", "3:2", "9:16", "2:3", "4:3"];
  const models = [
    { id: "gpt-image-2-all", name: "gpt-image-2-all", tag: "特惠通道" },
    { id: "gpt-image-2-1k", name: "gpt-image-2-1k", tag: "热门" },
    { id: "gpt-image-2-2k", name: "gpt-image-2-2k", tag: "" },
    { id: "gpt-image-2-4k", name: "gpt-image-2-4k", tag: "" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === files.length) {
              setUploadedImages(newImages);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const getSizeFromRatio = (ratio: string): string => {
    const sizeMap: Record<string, string> = {
      '1:1': '1024x1024',
      '16:9': '1536x1024',
      '3:2': '1024x768',
      '9:16': '1024x1536',
      '2:3': '768x1024',
      '4:3': '1024x768',
    };
    return sizeMap[ratio] || '1024x1024';
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!apiKey.trim()) {
      alert('请先输入 API Key');
      return;
    }
    
    if (mode === 'image' && uploadedImages.length === 0) {
      alert('请先上传图片');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const bodyData: Record<string, any> = {
        apiKey,
        prompt,
        model,
        size: getSizeFromRatio(ratio),
        n: 1,
      };

      if (mode === 'image' && uploadedImages.length > 0) {
        bodyData.image = uploadedImages;
      }

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const images = data.data.map((item: any) => item.url || item.b64_json);
        setGeneratedImages(images);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert(error instanceof Error ? error.message : '生成图片失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('yunwuai_api_key', apiKey);
  };

  const handleCopyPrompt = (index: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="flex gap-4 mb-4">
            <Link href="/">
              <button className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-all duration-200 border border-gray-600/50 flex items-center gap-2">
                ✨ 明亮排版工具
              </button>
            </Link>
            <Link href="/image-generator">
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all duration-200 flex items-center gap-2">
                🎨 明亮生图工具
              </button>
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              🎨 明亮生图工具
            </h1>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
              高性价比
            </span>
          </div>
          <p className="text-gray-400 text-sm">微信联系：zhengnianxin123</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700/50">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setMode('text')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === 'text'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700'
                  }`}
                >
                  文生图
                </button>
                <button
                  onClick={() => setMode('image')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === 'image'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700'
                  }`}
                >
                  图生图
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                    API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    onBlur={handleSaveApiKey}
                    placeholder="请输入你的云雾 AI API Key"
                    className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    API Key 会保存在本地浏览器中
                  </p>
                </div>

                {mode === 'image' && (
                  <div>
                    <label className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                      上传图片
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm cursor-pointer"
                    />
                    {uploadedImages.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uploadedImages.map((img, index) => (
                          <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-600">
                            <img src={img} alt={`上传 ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeUploadedImage(index)}
                              className="absolute top-0 right-0 w-5 h-5 bg-red-500/80 flex items-center justify-center text-white text-xs hover:bg-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                    提示词
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="根据主题描述生成内容，描述生成的场景，主题，一键成片"
                    className="w-full h-32 p-4 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none transition-all text-sm"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-xs">
                        🔄 播放复制
                      </button>
                      <button className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-xs">
                        AI 润色
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">0/5000</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                    模型选择
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {models.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setModel(m.id)}
                        className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          model === m.id
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                            : "bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700"
                        }`}
                      >
                        {m.name}
                        {m.tag && (
                          <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                            {m.tag}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                    生图比例
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ratios.map((r) => (
                      <button
                        key={r}
                        onClick={() => setRatio(r)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          ratio === r
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                            : "bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>
                      🎨 生成生图
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-300 font-medium">生成记录</h3>
                <span className="text-gray-500 text-sm">共 {generatedImages.length || 17} 条</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-gray-300 text-xs rounded-lg bg-gray-700/50">全部</button>
                  <button className="px-3 py-1 text-gray-500 text-xs rounded-lg">生成中</button>
                  <button className="px-3 py-1 text-gray-500 text-xs rounded-lg">成功</button>
                  <button className="px-3 py-1 text-gray-500 text-xs rounded-lg">失败</button>
                </div>
              </div>

              {generatedImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {generatedImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative group bg-gray-900/80 rounded-xl overflow-hidden border border-gray-700/50"
                    >
                      <img
                        src={img}
                        alt={`生成图片 ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-xs truncate">{prompt.substring(0, 30)}...</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-cyan-400 text-xs">吉卜力2D卡通动画风格...</span>
                          <button
                            onClick={() => handleCopyPrompt(index)}
                            className="text-gray-400 hover:text-white text-xs"
                          >
                            {copiedIndex === index ? "✓ 已复制" : "📋"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-900/80 rounded-xl border border-gray-700/50 aspect-square flex items-center justify-center">
                      <span className="text-gray-600 text-sm">点击生成图片</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="预览" className="max-w-[90vw] max-h-[90vh] rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
