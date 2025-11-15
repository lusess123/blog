# Corrective RAG with Memory

整合了记忆机制和纠正机制的 RAG 系统架构。

## 系统架构流程图

```mermaid
flowchart TD
    Start([查询输入<br/>Query Input]) --> LoadMem[加载历史记忆<br/>Load Previous Memory]
    LoadMem --> MemInject[记忆注入<br/>Memory Injection]
    MemInject --> EmbedQuery[查询嵌入<br/>Embed Query]
    EmbedQuery --> SimSearch[相似度搜索<br/>Similarity Search]
    SimSearch --> Retrieve[检索Top-k文档<br/>Retrieve top-k Documents]
    Retrieve --> Evaluate[评估检索文档<br/>与查询的相关性<br/>Evaluate Retrieved Documents<br/>for Query Relevance]
    Evaluate --> Decision{决策门<br/>相关性检查<br/>Decision Gate<br/>Relevance Check}

    %% Path A: Sufficient
    Decision -->|充足<br/>Sufficient<br/>相关性 ≥ 阈值<br/>Relevance ≥ Threshold| UseLocal[使用本地上下文<br/>检索到的本地文档<br/>Use Local Context<br/>Retrieved Local Document]
    UseLocal --> GenResp[生成响应<br/>Generate Response]

    %% Path B: Insufficient - Correction
    Decision -->|不足<br/>Insufficient<br/>相关性 < 阈值<br/>Relevance < Threshold| TriggerCorrect[触发纠正<br/>本地知识不足<br/>Trigger Correction<br/>Insufficient Local Knowledge]
    TriggerCorrect --> Reformulate[重新生成查询<br/>结合记忆上下文<br/>Reformulate Query<br/>with Memory Context]
    Reformulate --> CheckRetry{重试次数检查<br/>Retry Count<br/>< Max?}
    CheckRetry -->|是 Yes| EmbedQuery
    CheckRetry -->|否 No| ExternalSearch

    %% Path C: Irrelevant - External Search
    Decision -->|不相关<br/>Irrelevant<br/>无相关文档<br/>No Relevant Documents| ExternalSearch[外部搜索<br/>使用OpenAI网络搜索<br/>External Search<br/>Web Search using OpenAI]
    ExternalSearch --> GenResp

    %% Common final path
    GenResp --> UpdateMem[更新对话记忆<br/>Update Conversation Memory]
    UpdateMem --> Return([返回结果<br/>Return Result])

    %% Styling
    classDef memoryClass fill:#4a5568,stroke:#2d3748,color:#fff
    classDef decisionClass fill:#d69e2e,stroke:#975a16,color:#fff
    classDef processClass fill:#2d3748,stroke:#1a202c,color:#fff
    classDef sufficientClass fill:#38a169,stroke:#276749,color:#fff
    classDef correctionClass fill:#e53e3e,stroke:#9b2c2c,color:#fff
    classDef externalClass fill:#3182ce,stroke:#2c5282,color:#fff
    classDef responseClass fill:#805ad5,stroke:#553c9a,color:#fff

    class LoadMem,MemInject,UpdateMem memoryClass
    class Decision,CheckRetry decisionClass
    class EmbedQuery,SimSearch,Retrieve,Evaluate processClass
    class UseLocal sufficientClass
    class TriggerCorrect,Reformulate correctionClass
    class ExternalSearch externalClass
    class GenResp responseClass
```

## 系统说明

### 核心特性

1. **记忆机制**（深灰色节点）
   - 流程开始时加载历史对话记忆
   - 所有路径结束时更新对话记忆
   - 为多轮对话提供上下文连贯性

2. **纠正机制**（决策门 + 多路径）
   - 评估检索文档的相关性
   - 根据阈值智能分流到不同处理路径

### 三条处理路径

#### 路径 A - 充足路径（绿色）
- **触发条件**：Relevance ≥ Threshold
- **处理流程**：
  - 使用检索到的本地文档
  - 直接生成响应
  - 更新记忆并返回结果

#### 路径 B - 纠正路径（红色）
- **触发条件**：Relevance < Threshold
- **处理流程**：
  - 触发纠正机制
  - 结合记忆上下文重新生成查询
  - 检查重试次数
    - 未超限：重新执行检索流程
    - 超限：转向外部搜索
- **防护机制**：最大重试次数限制，避免无限循环

#### 路径 C - 外部搜索路径（蓝色）
- **触发条件**：
  - 完全不相关的文档
  - 或纠正路径重试超限
- **处理流程**：
  - 使用外部搜索（OpenAI Web Search）
  - 生成响应
  - 更新记忆并返回结果

### 关键整合点

- **记忆 + 查询处理**：Memory Injection 增强查询理解
- **记忆 + 纠正机制**：Reformulate Query 时结合记忆上下文
- **统一记忆更新**：所有路径最终都更新对话记忆
- **智能降级**：纠正失败时自动降级到外部搜索

## 优势

1. 提高检索准确性（纠正机制）
2. 增强多轮对话能力（记忆机制）
3. 智能错误处理（重试 + 降级）
4. 完整的上下文管理（全流程记忆追踪）
