'use client';

import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';

const CorrectiveRAGFlow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current,
      width: 1600,
      height: 1600,
      background: {
        color: 'transparent',
      },
      grid: false,
      panning: true,
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
      interacting: {
        nodeMovable: false,
      },
    });

    // 定义节点样式
    const nodeStyles = {
      memory: {
        fill: '#4a5568',
        stroke: '#2d3748',
        strokeWidth: 2,
      },
      process: {
        fill: '#2d3748',
        stroke: '#1a202c',
        strokeWidth: 2,
      },
      decision: {
        fill: '#d69e2e',
        stroke: '#975a16',
        strokeWidth: 2,
      },
      sufficient: {
        fill: '#38a169',
        stroke: '#276749',
        strokeWidth: 2,
      },
      correction: {
        fill: '#e53e3e',
        stroke: '#9b2c2c',
        strokeWidth: 2,
      },
      external: {
        fill: '#3182ce',
        stroke: '#2c5282',
        strokeWidth: 2,
      },
      response: {
        fill: '#805ad5',
        stroke: '#553c9a',
        strokeWidth: 2,
      },
    };

    // 创建节点
    const nodes = [
      // 阶段1：记忆加载与查询处理 - 主流程垂直居中
      { id: 'start', x: 700, y: 50, width: 200, height: 60, label: '查询输入\nQuery Input', style: nodeStyles.memory, shape: 'rect', rx: 30, ry: 30 },
      { id: 'load-memory', x: 660, y: 140, width: 280, height: 60, label: '加载历史记忆\nLoad Previous Memory', style: nodeStyles.memory },
      { id: 'inject-memory', x: 660, y: 240, width: 280, height: 60, label: '记忆注入\nMemory Injection', style: nodeStyles.memory },
      { id: 'embed-query', x: 660, y: 340, width: 280, height: 60, label: '查询嵌入\nEmbed Query', style: nodeStyles.process },

      // 阶段2：检索与评估
      { id: 'similarity', x: 660, y: 460, width: 280, height: 60, label: '相似度搜索\nSimilarity Search', style: nodeStyles.process },
      { id: 'retrieve', x: 660, y: 580, width: 280, height: 60, label: '检索Top-k文档\nRetrieve top-k Documents', style: nodeStyles.process },
      { id: 'evaluate', x: 640, y: 700, width: 320, height: 70, label: '评估检索文档与查询的相关性\nEvaluate Retrieved Documents', style: nodeStyles.process },

      // 决策门 - 稍微偏右以便分支
      { id: 'decision', x: 750, y: 840, width: 100, height: 100, label: '决策门\nDecision\nGate', style: nodeStyles.decision, shape: 'polygon', points: '50,0 100,50 50,100 0,50' },

      // 路径A：充足路径（左侧）
      { id: 'use-local', x: 100, y: 1000, width: 320, height: 70, label: '使用本地上下文\nUse Local Context', style: nodeStyles.sufficient },

      // 路径C：外部搜索（中间）
      { id: 'external-search', x: 660, y: 1000, width: 280, height: 70, label: '外部搜索 | OpenAI Web Search\nExternal Search', style: nodeStyles.external },

      // 路径B：纠正路径（右侧）
      { id: 'trigger-correct', x: 1200, y: 1000, width: 320, height: 70, label: '触发纠正 | 本地知识不足\nTrigger Correction', style: nodeStyles.correction },
      { id: 'reformulate', x: 1200, y: 1120, width: 320, height: 70, label: '重新生成查询 | 结合记忆上下文\nReformulate Query', style: nodeStyles.correction },
      { id: 'retry-check', x: 1250, y: 1260, width: 120, height: 100, label: '重试检查\nRetry\nCheck', style: nodeStyles.decision, shape: 'polygon', points: '60,0 120,50 60,100 0,50' },

      // 公共最终路径（中间）
      { id: 'generate', x: 660, y: 1380, width: 280, height: 60, label: '生成响应\nGenerate Response', style: nodeStyles.response },
      { id: 'update-memory', x: 660, y: 1500, width: 280, height: 60, label: '更新对话记忆\nUpdate Conversation Memory', style: nodeStyles.memory },
      { id: 'return', x: 700, y: 1620, width: 200, height: 60, label: '返回结果\nReturn Result', style: nodeStyles.memory, shape: 'rect', rx: 30, ry: 30 },
    ];

    nodes.forEach((node) => {
      if (node.shape === 'polygon') {
        graph.addNode({
          id: node.id,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          shape: 'polygon',
          attrs: {
            body: {
              refPoints: node.points,
              ...node.style,
            },
            label: {
              text: node.label,
              fill: '#ffffff',
              fontSize: 12,
              fontWeight: 'bold',
              textWrap: {
                width: -20,
                height: -10,
              },
            },
          },
        });
      } else {
        graph.addNode({
          id: node.id,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          attrs: {
            body: {
              ...node.style,
              rx: node.rx || 8,
              ry: node.ry || 8,
            },
            label: {
              text: node.label,
              fill: '#ffffff',
              fontSize: 13,
              fontWeight: 'bold',
              textWrap: {
                width: -20,
                height: -10,
              },
            },
          },
        });
      }
    });

    // 创建边
    const edges = [
      // 主流程
      { source: 'start', target: 'load-memory' },
      { source: 'load-memory', target: 'inject-memory' },
      { source: 'inject-memory', target: 'embed-query' },
      { source: 'embed-query', target: 'similarity' },
      { source: 'similarity', target: 'retrieve' },
      { source: 'retrieve', target: 'evaluate' },
      { source: 'evaluate', target: 'decision' },

      // 路径A：充足（左侧）
      { source: 'decision', target: 'use-local', label: '充足 Sufficient\n相关性 ≥ 阈值', labelStyle: { fill: '#38a169' }, router: { name: 'manhattan' } },
      { source: 'use-local', target: 'generate', router: { name: 'manhattan' } },

      // 路径C：外部搜索（中间）
      { source: 'decision', target: 'external-search', label: '不相关 Irrelevant\n无相关文档', labelStyle: { fill: '#3182ce' } },
      { source: 'external-search', target: 'generate' },

      // 路径B：纠正（右侧）
      { source: 'decision', target: 'trigger-correct', label: '不足 Insufficient\n相关性 < 阈值', labelStyle: { fill: '#e53e3e' }, router: { name: 'manhattan' } },
      { source: 'trigger-correct', target: 'reformulate' },
      { source: 'reformulate', target: 'retry-check' },
      // 回环到查询嵌入
      { source: 'retry-check', target: 'embed-query', label: '是 Yes', labelStyle: { fill: '#d69e2e' }, router: { name: 'manhattan' }, vertices: [{ x: 1450, y: 1310 }, { x: 1450, y: 370 }] },
      // 重试失败，转向外部搜索
      { source: 'retry-check', target: 'external-search', label: '否 No', labelStyle: { fill: '#d69e2e' }, router: { name: 'manhattan' } },

      // 公共最终路径
      { source: 'generate', target: 'update-memory' },
      { source: 'update-memory', target: 'return' },
    ];

    edges.forEach((edge) => {
      graph.addEdge({
        source: edge.source,
        target: edge.target,
        attrs: {
          line: {
            stroke: '#64748b',
            strokeWidth: 2,
            targetMarker: {
              name: 'classic',
              size: 8,
            },
          },
        },
        labels: edge.label ? [{
          attrs: {
            label: {
              text: edge.label,
              fill: '#ffffff',
              fontSize: 11,
            },
            body: {
              fill: edge.labelStyle?.fill || '#1f2937',
              stroke: '#4a5568',
              strokeWidth: 1,
              rx: 4,
              ry: 4,
            },
          },
        }] : [],
        router: edge.router,
        vertices: edge.vertices,
      });
    });

    return () => {
      graph.dispose();
    };
  }, []);

  return (
    <div className="w-full overflow-x-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-xl">
      <div ref={containerRef} className="mx-auto" />
    </div>
  );
};

export default CorrectiveRAGFlow;
