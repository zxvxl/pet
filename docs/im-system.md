# 2.2 沟通体系设计

## 1️⃣ 聊天系统技术选型建议

- **自研 WebSocket**：直接基于 NestJS 的 `@nestjs/websockets` 实现。部署简单，可完全控制数据和客服服务逻辑，成本最低。缺点是需要自行处理消息可靠、离线推送等问题。
- **第三方 IM**：如环信、融云或腾讯云 IM，提供完善的消息可靠、离线推送和多端同步能力，但授权费用较高，并需要额外的 SDK 集成和云端配置。
- **MVP 阶段建议**：先使用自研 WebSocket 结合 Redis PubSub 实现，保证消息基本实时和存储可控，后续根据量级再考虑引入第三方 IM。
- 支持客服接入时，可通过群聊（喂养员 + 用户 + 客服）或双人会话模式，推荐使用服务单 `orderId` 作为房间号进行隔离。

## 2️⃣ 消息类型定义

```typescript
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VOICE = 'voice',
  LOCATION = 'location',
  SYSTEM = 'system',
}

export interface ChatMessage {
  id: number
  type: MessageType
  senderId: number
  receiverId: number
  orderId?: number
  timestamp: number
  payload: any
}
```

**payload 示例**

```json5
{ "text": "你好" }
{ "url": "https://oss.example.com/xxx.jpg" }
{ "voice": "https://oss.example.com/xxx.amr" }
{ "lat": 30.1, "lng": 120.1 }
```

## 3️⃣ 聊天记录存储策略

- 使用 `messages` 表存储聊天记录，`id` 自增、`timestamp` 作索引便于分页。
- 客户端生成临时 `id`，后端返回最终 `id`，可避免重复发送。
- 历史记录通过 `orderId` 分页查询，支持 `before` 参数向上滚动。
- 图片/语音等文件类消息仅保存 OSS URL，不在数据库存储实体文件。

## 4️⃣ 紧急联系按钮流程

- 入口：聊天页和订单详情页均提供「紧急联系」按钮。
- 点击后调用后端 `/im/emergency` 记录，并调用 `uni.makePhoneCall` 拨打平台客服或喂养员电话。
- 后台客服可在管理端查看 `emergency_calls` 表记录，必要时介入会话。

## 5️⃣ 消息推送机制

- 新消息到达时，若对方离线则通过微信客服消息推送简要提示。
- 服务端限制同一用户 1 分钟内仅推送一次模板消息，避免刷屏。
- 系统公告（如天气影响）通过服务端广播 `SYSTEM` 类型消息，所有在线房间均可收到。

## 6️⃣ 用户隐私与封禁机制

- 数据中仅保存脱敏手机号，如 `138****0000` 显示。
- `chat_blacklist` 表记录黑名单，用户或喂养员可拉黑对方，服务端在发送消息时检查并拒绝。
- `reports` 表记录举报信息和处理状态，管理后台可进一步封禁账号并强制断开 WebSocket 连接。

## 7️⃣ 接口与数据结构

### 发送消息
`POST /api/im/send`
```json5
{
  "type": "text",
  "receiverId": 2,
  "orderId": 100,
  "payload": { "text": "hello" }
}
```
返回 `ChatMessage` 结构。

### 获取历史记录
`GET /api/im/history?orderId=100&before=1700000000000`

### 紧急联系
`POST /api/im/emergency`
```json5
{ "orderId": 100 }
```

### WebSocket 消息
```json5
{
  "ack": 1,
  "data": { ...ChatMessage }
}
```
客户端收到消息后回复 `{ "ack": msg.id }` 确认。

## 🔧 部署优化

1. **离线消息**：消息先写入数据库，再通过 Redis PubSub 分发；若对方不在线则记录未读并配合微信客服消息推送。
2. **消息延迟控制**：WebSocket 连接处理后将消息发布到 Redis/NATS，网关订阅后立即投递，减少单节点压力。
3. **封禁与隔离**：在 JWT 校验阶段检查账号状态，被封禁用户直接拒绝建立 WebSocket 连接并返回错误。
