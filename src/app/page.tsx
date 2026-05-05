"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    const result = inputText.replace(/\s+/g, "");
    setOutputText(result);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const handleCopy = async () => {
    if (outputText) {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-6">

          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-2" style={{textShadow: '0 0 30px rgba(34, 211, 238, 0.5)'}}>
            ✨ 明亮排版工具2.0 ✨
          </h1>
          <p className="text-gray-400 text-sm">微信联系：zhengnianxin123</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-6 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <label className="text-cyan-400 font-medium text-sm">原始文案 (AI生成)</label>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="请在此输入需要排版的文案...&#10;&#10;示例：&#10;狗狗一定要有一个全名，有名有姓的那种，最好是随主人姓的。&#10;&#10;不是迷信，这是一种很深的情感寄托。"
            className="w-full h-48 p-4 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none transition-all font-sans text-base leading-relaxed"
          />
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleClear}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-all duration-200 border border-gray-600/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              一键清空
            </button>
            <button
              onClick={handleFormat}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              开始排版去空
            </button>
          </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
            <label className="text-cyan-400 font-medium text-sm">排版结果</label>
            <span className="ml-auto text-xs text-gray-500">
              {outputText.length} 字符
            </span>
          </div>
          <div className="w-full h-64 p-4 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-200 overflow-auto font-sans text-base leading-relaxed">
            {outputText || (
              <span className="text-gray-600">排版后的文案将显示在这里...</span>
            )}
          </div>
          
          <button
            onClick={handleCopy}
            disabled={!outputText}
            className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {copied ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              )}
            </svg>
            {copied ? "已复制！" : "一键复制结果"}
          </button>
        </div>
      </div>
    </div>
  );
}
