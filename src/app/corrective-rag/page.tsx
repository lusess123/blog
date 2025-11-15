import React from 'react';
import CorrectiveRAGFlow from '@/components/CorrectiveRAGFlow';

export default function CorrectiveRAGPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Corrective RAG with Memory
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            纠正式检索增强生成系统（带记忆机制）
          </p>
          <p className="text-sm text-gray-500 max-w-3xl mx-auto">
            整合了记忆机制和纠正机制的智能检索增强生成系统，通过动态评估检索质量并结合对话历史上下文，提供更准确、更连贯的响应。
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="mb-12">
          <CorrectiveRAGFlow />
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300">
            <div className="text-cyan-400 text-2xl mb-3">🧠</div>
            <h3 className="text-lg font-semibold text-white mb-2">记忆机制</h3>
            <p className="text-sm text-gray-400">
              加载和更新对话历史记忆，为多轮对话提供上下文连贯性
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300">
            <div className="text-green-400 text-2xl mb-3">✅</div>
            <h3 className="text-lg font-semibold text-white mb-2">智能评估</h3>
            <p className="text-sm text-gray-400">
              评估检索文档的相关性，根据阈值智能分流到不同处理路径
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300">
            <div className="text-red-400 text-2xl mb-3">🔄</div>
            <h3 className="text-lg font-semibold text-white mb-2">纠正机制</h3>
            <p className="text-sm text-gray-400">
              检索不准确时触发查询重构，结合记忆上下文重新检索
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300">
            <div className="text-blue-400 text-2xl mb-3">🌐</div>
            <h3 className="text-lg font-semibold text-white mb-2">外部搜索</h3>
            <p className="text-sm text-gray-400">
              本地知识不足时，自动降级到外部搜索获取最新信息
            </p>
          </div>
        </div>

        {/* System Details */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Path A */}
          <div className="bg-gradient-to-br from-green-900/30 to-gray-900 p-6 rounded-xl border border-green-700/50">
            <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center">
              <span className="mr-2">🟢</span> 路径 A - 充足路径
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <span className="font-semibold text-white">触发条件：</span>
                <br />相关性 ≥ 阈值 (Relevance ≥ Threshold)
              </div>
              <div>
                <span className="font-semibold text-white">处理流程：</span>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-400">
                  <li>使用检索到的本地文档</li>
                  <li>直接生成响应</li>
                  <li>更新记忆并返回结果</li>
                </ol>
              </div>
              <div className="pt-2 border-t border-green-700/30">
                <span className="font-semibold text-green-400">优势：</span> 快速响应，低延迟
              </div>
            </div>
          </div>

          {/* Path B */}
          <div className="bg-gradient-to-br from-red-900/30 to-gray-900 p-6 rounded-xl border border-red-700/50">
            <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
              <span className="mr-2">🔴</span> 路径 B - 纠正路径
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <span className="font-semibold text-white">触发条件：</span>
                <br />相关性 &lt; 阈值 (Relevance &lt; Threshold)
              </div>
              <div>
                <span className="font-semibold text-white">处理流程：</span>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-400">
                  <li>触发纠正机制</li>
                  <li>结合记忆上下文重新生成查询</li>
                  <li>检查重试次数（防止无限循环）</li>
                  <li>重新检索或转向外部搜索</li>
                </ol>
              </div>
              <div className="pt-2 border-t border-red-700/30">
                <span className="font-semibold text-red-400">优势：</span> 提高检索准确性
              </div>
            </div>
          </div>

          {/* Path C */}
          <div className="bg-gradient-to-br from-blue-900/30 to-gray-900 p-6 rounded-xl border border-blue-700/50">
            <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
              <span className="mr-2">🔵</span> 路径 C - 外部搜索
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <span className="font-semibold text-white">触发条件：</span>
                <br />完全不相关文档或重试超限
              </div>
              <div>
                <span className="font-semibold text-white">处理流程：</span>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-400">
                  <li>使用外部搜索（OpenAI Web Search）</li>
                  <li>生成响应</li>
                  <li>更新记忆并返回结果</li>
                </ol>
              </div>
              <div className="pt-2 border-t border-blue-700/30">
                <span className="font-semibold text-blue-400">优势：</span> 获取最新信息
              </div>
            </div>
          </div>
        </div>

        {/* System Advantages */}
        <div className="mt-12 bg-gradient-to-br from-purple-900/30 to-gray-900 p-8 rounded-xl border border-purple-700/50">
          <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">系统优势</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div className="flex items-start">
              <div className="text-purple-400 text-xl mr-3 mt-1">▸</div>
              <div>
                <h4 className="font-semibold text-white mb-1">提高检索准确性</h4>
                <p className="text-sm text-gray-400">通过纠正机制动态调整查询，确保检索到最相关的文档</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-purple-400 text-xl mr-3 mt-1">▸</div>
              <div>
                <h4 className="font-semibold text-white mb-1">增强多轮对话能力</h4>
                <p className="text-sm text-gray-400">记忆机制保持上下文连贯性，理解对话历史</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-purple-400 text-xl mr-3 mt-1">▸</div>
              <div>
                <h4 className="font-semibold text-white mb-1">智能错误处理</h4>
                <p className="text-sm text-gray-400">重试机制 + 自动降级，确保系统稳定性</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-purple-400 text-xl mr-3 mt-1">▸</div>
              <div>
                <h4 className="font-semibold text-white mb-1">完整的上下文管理</h4>
                <p className="text-sm text-gray-400">全流程记忆追踪，所有路径统一更新对话状态</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Built with Next.js 14 + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
