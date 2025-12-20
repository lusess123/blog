# Serverless 数据库连接核心问题与解决方案

## 核心问题

**Serverless 的连接池无法跨实例复用**

```
传统应用：1 个进程 × 10 连接池 = 10 个数据库连接
Serverless：100 个实例 × 2 连接 = 200 个数据库连接 💥
```

## 解决方案对比

| 方案 | 成本 | 复杂度 | 推荐度 |
|------|------|--------|--------|
| **RDS 代理**（阿里云/AWS） | ¥300/月 | 低 | ⭐⭐⭐⭐⭐ |
| **PgBouncer**（自建） | ¥100/月 | 中 | ⭐⭐⭐⭐ |
| **Prisma Accelerate** | $100/月 | 低 | ⭐⭐⭐⭐ |
| **降低 connection_limit** | ¥0 | 低 | ⭐⭐（临时） |

## 推荐配置

### 阿里云 FC + RDS 代理

```typescript
// 环境变量
DATABASE_URL="postgresql://user:pass@proxy-xxx.pg.rds.aliyuncs.com:5432/db?connection_limit=5"

// FC 配置
{
  "MemorySize": 512,
  "InstanceConcurrency": 10,
  "MaxInstances": 100,
  "connection_limit": 5  // 使用代理可以增大
}

// 结果
总并发：100 × 10 = 1000
FC→代理：100 × 5 = 500 连接
代理→RDS：< 50 真实连接 ✅
```

### AWS Lambda + RDS Proxy

⚠️ **重要：Prisma + RDS Proxy 有兼容性问题**

**问题根源：**
- Prisma 默认使用 Prepared Statements
- 触发 RDS Proxy 的 Session Pinning
- 导致连接池失效

**解决方案：**
1. **换用 Drizzle ORM**（推荐）
2. **使用 Prisma Accelerate**（官方方案）
3. **自建 PgBouncer**（成本最低）

---

## Prisma 配置要点

### 直连 RDS（无代理）

```typescript
DATABASE_URL="postgresql://user:pass@rds-host:5432/db?connection_limit=2"
// connection_limit 必须很小（1-2）
```

### 通过 RDS 代理

```typescript
DATABASE_URL="postgresql://user:pass@proxy-host:5432/db?connection_limit=5"
// connection_limit 可以增大（5-10）
```

### 通过 PgBouncer

```typescript
DATABASE_URL="postgresql://user:pass@pgbouncer-host:6432/db?pgbouncer=true&connection_limit=5"
// 必须加 pgbouncer=true 参数
```

---

## 核心公式

```typescript
// 1. 总并发能力
总并发 = 实例数 × 实例并发度

// 2. 数据库连接数
总连接 = 实例数 × connection_limit

// 3. 约束条件
总连接 ≤ RDS max_connections × 0.8

// 4. 反推最大实例数
最大实例数 = (RDS连接数 × 0.8) ÷ connection_limit

// 5. 实例并发度推荐值
并发度 = 10-20（阿里云 FC）
并发度 = 1（AWS Lambda，无法设置）
```

---

## 监控告警

```sql
-- 实时监控连接数
SELECT
  count(*) as current,
  (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max
FROM pg_stat_activity
WHERE datname = current_database();

-- 告警阈值
当前连接数 > max_connections × 80% → 告警
```

---

最后更新：2025-12-19
