# FC/Lambda 配置速查表

## 阿里云 FC 配置

### 内存与 CPU 关系

```
内存 → CPU（自动分配，无法单独设置）
128 MB  → 0.05 核
512 MB  → 0.2 核
1024 MB → 0.5 核
2048 MB → 1 核
```

### 实例并发度

```yaml
InstanceConcurrency: 10  # 单实例处理 10 个并发请求

# 原理：Node.js 异步 I/O，等待数据库时释放 CPU
# 推荐值：
# - I/O 密集（数据库查询）：10-20
# - CPU 密集（计算）：5-10
# - 混合场景：10

# ❌ 不要设置过大（如 10000）：
# - 内存溢出
# - 数据库连接排队
# - CPU 阻塞
```

### 标准配置模板

```yaml
# 轻量 API
MemorySize: 512
InstanceConcurrency: 10
MaxInstances: 50
connection_limit: 2

# 高性能应用
MemorySize: 1024
InstanceConcurrency: 20
MaxInstances: 100
connection_limit: 3
```

---

## AWS Lambda 配置

### 关键差异

```typescript
// ❌ AWS Lambda 无法设置实例并发度
// 默认：单实例单并发

// 1000 并发请求 = 1000 个 Lambda 实例
// 对比阿里云：1000 并发 = 100 实例 × 10 并发度
```

### 冷启动优化

```yaml
# 预配置并发（保持热启动）
provisionedConcurrency: 5

# 预留并发（保证容量）
reservedConcurrency: 100
```

### 标准配置

```yaml
functions:
  api:
    memorySize: 512
    timeout: 60
    reservedConcurrency: 100
    provisionedConcurrency: 5

    vpc:
      securityGroupIds: [sg-xxx]
      subnetIds: [subnet-xxx]
```

---

## 性能优化要点

### FC 实例生命周期

```
冷启动（第一次）：
1. 启动容器（50-200ms）
2. 加载代码
3. 初始化全局变量（Prisma 实例创建）
4. 执行 handler

热启动（后续）：
1. 直接执行 handler
2. 复用全局变量（Prisma 实例）✅
3. 复用数据库连接池 ✅

实例回收：
- 空闲 5-15 分钟后回收
```

### 全局单例模式（关键）

```typescript
// ✅ 正确：全局单例
let prisma: PrismaClient | null = null

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

// ❌ 错误：每次创建
export function handler() {
  const prisma = new PrismaClient()  // 💥 不复用
  // ...
}
```

---

## 成本对比

| 配置 | 阿里云 FC | AWS Lambda |
|------|----------|-----------|
| 512MB, 100ms, 100万次/月 | ¥50 | $40 |
| 1024MB, 100ms, 100万次/月 | ¥100 | $80 |
| RDS 代理 | ¥300/月 | $10/月 |

---

最后更新：2025-12-19
