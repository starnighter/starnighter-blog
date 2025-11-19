---
title: "接口文档"
description: "这是一个测试文件"
pubDate: 2025-11-20
tags: ["spring", "redis", "vue", "react"]
---

# Stellar 即时通讯系统接口文档

## 一、文档概述

Stellar 即时通讯系统接口用于支撑客户端（基于 Electron + Vue3 技术栈）与服务端（基于 SpringBoot + Netty 技术栈）的通信，涵盖**用户管理、好友关系、实时聊天、群组管理、文件传输、动态（朋友圈）** 等核心功能。采用 **HTTP（非实时操作）+ Netty 长连接（实时消息）** 结合的通信方式。

```javascript
const t = 'hello'
for (i = 0; i < 5; i++) {
    if (i > 3) {
        console.log("happy today!")
    }
}
console.log("happy everyday!")
```

## 二、通用说明

### 1. 通信协议

* **HTTP 协议**：用于用户注册、登录、好友请求、群组管理等**非实时操作**，采用 Restful 风格，请求 / 响应格式为 JSON。

* **Netty 长连接**：用于**实时消息收发、在线状态同步**等场景，基于自定义 JSON 协议传输。

### 2. 统一响应格式（HTTP 接口）

```json
{
  "code": 200,   // 错误码，200 表示成功
  "message": "操作成功", // 提示信息
  "data": {}     // 响应数据（按需返回）
}
```

### 3. 错误码说明

| 错误码 | 含义       |
| --- | -------- |
| 200 | 操作成功     |
| 400 | 请求参数错误   |
| 401 | 未授权（需登录） |
| 403 | 权限不足     |
| 404 | 资源不存在    |
| 500 | 服务端内部错误  |

## 三、用户模块接口
### 1. 生成验证码

- **接口路径**：`/api/account/captcha`

- **请求方法**：`POST`

- **响应示例**：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "captchaId": "123",
    "image": "456"
  }
}
```

### 2. 用户注册

* **接口路径**：`/api/account/register`

* **请求方法**：`POST`

* **请求参数**：

| 参数名         | 类型     | 是否必填 | 说明              |
| ----------- | ------ | ---- | --------------- |
| username    | String | 是    | 用户名             |
| password    | String | 是    | 密码（建议前端加密后传输）   |
| phone       | String | 否    | 手机号（可选）         |
| email       | String | 否    | 邮箱（可选）          |
| avatar      | String | 否    | 头像 URL（可选，默认提供） |
| captchaId   | String | 是    | 验证码ID           |
| captchaCode | String | 是    | 用户输入的验证码内容      |

* **响应示例**：

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "user_123",
    "username": "stellar_user"
  }
}
```

### 3. 用户登录

* **接口路径**：`/api/account/login`

* **请求方法**：`POST`

* **请求参数**：

| 参数名      | 类型     | 是否必填 | 说明             |
| -------- | ------ | ---- | -------------- |
| account  | String | 是    | 用户名 / 手机号 / 邮箱 |
| password | String | 是    | 密码（加密后）        |

* **响应示例**：

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "userId": "user_123",
    "username": "stellar_user",
    "accessToken": "xxx.xxx.xxx", 
    "refreshToken": "xxx.xxx.xxx",
    "avatar": "http://xxx.com/avatar.jpg",
    "nettyServer": "ws://netty-server:8080", // Netty 长连接地址
    "expireTime": "2025-10-12 12:00:00" // token 过期时间
  }
}
```

### 4. 获取用户信息

* **接口路径**：`/api/user/info/{userId}`

* **请求方法**：`GET`

* **请求头**：`Authorization: Bearer {token}`（登录后携带）

* **路径参数**：

| 参数名    | 类型     | 是否必填 | 说明    |
| ------ | ------ | ---- | ----- |
| userId | String | 是    | 用户 ID |

* **响应示例**：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "userId": "user_123",
    "username": "stellar_user",
    "avatar": "http://xxx.com/avatar.jpg",
    "signature": "享受即时通讯的乐趣",
    "onlineStatus": true, // 在线状态
    "createTime": "2025-10-10 10:00:00"
  }
}
```

### 5. 修改用户基本信息

* **接口路径**：`/api/user/update`

* **请求方法**：`PUT`

* **请求头**：`Authorization: Bearer {token}`

* **请求参数**：

| 参数名       | 类型     | 是否必填 | 说明      |
| --------- | ------ | ---- | ------- |
| username  | String | 否    | 新用户名    |
| avatar    | String | 否    | 新头像 URL |
| signature | String | 否    | 个性签名    |
| email     | String | 否    | 邮箱      |
| phone     | String | 否    | 手机号     |

* **响应示例**：

```json
{
  "code": 200,
  "message": "更新个人信息成功",
  "data": {
	  "userUpdateInfo":{
		    "username":"user_star",
		    "avatar":"0932",
		    "signature":"我仍感叹于世界之大",
		    "email":"123@qq.com",
		    "phone":"10987654321"
		}
		"accessToken":xxx.xxx.xxx,
		"refreshToken":xxx.xxx.xxx
	}
}
```

### 6. 修改密码

- **接口路径**：`/api/user/change-pwd`

- **请求方法**：`PUT`

* **请求头**：`Authorization: Bearer {token}`

- **请求参数**：

| 参数名             | 类型     | 是否必填 | 说明        |
| --------------- | ------ | ---- | --------- |
| currentPassword | String | 是    | 当前密码（旧密码） |
| newPassword     | String | 是    | 新密码       |
| confirmPassword | String | 是    | 确认密码      |

- **响应示例：

```json
{
  "code": 200,
  "message": "密码修改成功，请重新登录",
  "data": null
}
```

### 7. 刷新token

- **接口路径**：`/api/account/update`

- **请求方法**：`PUT`

- **请求参数**：

| 参数名          | 类型     | 是否必填 | 说明       |
| ------------ | ------ | ---- | -------- |
| refreshToken | String | 是    | 原刷新token |

- **响应示例：

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "userId": "user_123",
    "username": "stellar_user",
    "accessToken": "Bearer xxx.xxx.xxx", 
    "refreshToken": "xxx.xxx.xxx",
    "avatar": "http://xxx.com/avatar.jpg",
    "nettyServer": "ws://netty-server:8080", // Netty 长连接地址
    "expireTime": "2025-10-12 12:00:00" // token 过期时间
  }
}
```

## 四、好友模块接口

### 1. 搜索用户（用于添加好友）

* **接口路径**：`/api/friend/search`

* **请求方法**：`GET`

* **请求头**：`Authorization: Bearer {token}`

* **查询参数**：

| 参数名     | 类型     | 是否必填 | 说明           |
| ------- | ------ | ---- | ------------ |
| keyword | String | 是    | 用户名 / 手机号关键词 |

* **响应示例**：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "userId": "user_456",
      "username": "friend_user",
      "avatar": "http://xxx.com/friend_avatar.jpg",
      "signature": "世界之大",
      "onlineStatus": false,
      "createTime": "2025-10-10 10:00:00"
    }
    // 更多符合查询要求的用户
  ]
}
```

### 2. 发送好友请求

* **接口路径**：`/api/friend/request`

* **请求方法**：`POST`

* **请求头**：`Authorization: Bearer {token}`

* **请求参数**：

| 参数名        | 类型     | 是否必填 | 说明         |
| ---------- | ------ | ---- | ---------- |
| senderId   | Long   | 是    | 发送方用户ID    |
| receiverId | Long   | 是    | 接收方用户 ID   |
| remark     | String | 否    | 发送方给接收方的备注 |
| verInfo    | String | 否    | 验证信息       |

* **响应示例**：

```json
{
  "code": 200,
  "message": "请求发送成功",
  "data": null
}
```

### 3. 处理好友请求

* **接口路径**：`/api/friend/handle`

* **请求方法**：`POST`

* **请求头**：`Authorization: Bearer {token}`

* **请求参数**：

| 参数名       | 类型      | 是否必填 | 说明               |
| --------- | ------- | ---- | ---------------- |
| requestId | String  | 是    | 好友请求 ID          |
| agree     | Boolean | 是    | 是否同意（true/false） |

* **响应示例**：

```json
{
  "code": 200,
  "message": "处理成功",
  "data": {
    "relationId": "fs_789", // 好友关系 ID
    "friendId": "114514",
    "remark": "张三",
    "friendGroup": "默认分组"
  }
}
```

### 4. 获取好友列表

* **接口路径**：`/api/friend/list`

* **请求方法**：`GET`

* **请求头**：`Authorization: Bearer {token}`

* **响应示例**：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "friendId": "user_456",
      "username": "friend_user",
      "avatar": "http://xxx.com/friend_avatar.jpg",
      "remark": "我的好友", // 备注名
      "onlineStatus": true
    }
    // 更多好友...
  ]
}
```

## 五、聊天模块接口

### 1. HTTP 接口：获取单聊历史消息

* **接口路径**：`/api/chat/single/history`

* **请求方法**：`GET`

* **请求头**：`Authorization: Bearer {token}`

* **查询参数**：

| 参数名      | 类型      | 是否必填 | 说明         |
| -------- | ------- | ---- | ---------- |
| friendId | String  | 是    | 好友 ID      |
| pageNum  | Integer | 是    | 页码（从 1 开始） |
| pageSize | Integer | 是    | 每页条数       |

* **响应示例**：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 100,
    "list": [
      {
        "messageId": "msg_1001",
        "senderId": "user_123",
        "receiverId": "user_456",
        "content": "你好呀～",
        "msgType": "TEXT", // 消息类型：TEXT/IMAGE/FILE 等
        "sendTime": "2025-10-11 14:20:00",
        "status": "SENT" // 状态：SENT/DELIVERED/READ
      }
      // 更多消息...
    ]
  }
}
```

### 2. Netty 长连接：实时消息格式（自定义协议）

客户端与服务端通过 Netty 长连接传输**实时消息**，消息体 JSON 示例（单聊）：

```json
{
  "type": "CHAT_SINGLE", // 消息类型：CHAT_SINGLE（单聊）、CHAT_GROUP（群聊）等
  "senderId": "user_123",
  "receiverId": "user_456",
  "content": "实时消息内容",
  "msgType": "TEXT",
  "timestamp": 1740092400000 // 时间戳（毫秒）
}
```

服务端收到后，会立即推送至接收方客户端的 Netty 连接。

### 3. 群组创建

* **接口路径**：`/api/group/create`

* **请求方法**：`POST`

* **请求头**：`Authorization: Bearer {token}`

* **请求参数**：

| 参数名          | 类型     | 是否必填 | 说明              |
| ------------ | ------ | ---- | --------------- |
| groupName    | String | 是    | 群名称             |
| avatar       | String | 否    | 群头像 URL         |
| members      | Array  | 是    | 初始成员 ID 列表（含自己） |
| introduction | String | 否    | 群介绍             |

* **响应示例**：

```json
{
  "code": 200,
  "message": "群组创建成功",
  "data": {
    "groupId": "group_101",
    "groupName": "我的好友群"
  }
}
```

### 4. HTTP 接口：获取群聊历史消息

* **接口路径**：`/api/chat/group/history`

* **请求方法**：`GET`

* **请求头**：`Authorization: Bearer {token}`

* **查询参数**：

| 参数名      | 类型      | 是否必填 | 说明   |
| -------- | ------- | ---- | ---- |
| groupId  | String  | 是    | 群 ID |
| pageNum  | Integer | 是    | 页码   |
| pageSize | Integer | 是    | 每页条数 |

* **响应示例**：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 200,
    "list": [
      {
        "messageId": "g_msg_2001",
        "senderId": "user_123",
        "groupId": "group_101",
        "content": "群里好热闹～",
        "msgType": "TEXT",
        "sendTime": "2025-10-11 16:00:00",
        "status": "SENT"
      }
      // 更多群消息...
    ]
  }
}
```

## 六、文件传输模块接口

### 1. 上传文件（预处理：获取上传凭证）

* **接口路径**：`/api/file/upload/token`

* **请求方法**：`POST`

* **请求头**：`Authorization: Bearer {token}`

* **请求参数**：

| 参数名      | 类型     | 是否必填 | 说明                                      |
| -------- | ------ | ---- | --------------------------------------- |
| filename | String | 是    | 文件名                                     |
| fileSize | Long   | 是    | 文件大小（字节）                                |
| fileType | String | 是    | 文件类型（如 `image/png`）                     |
| scope    | String | 是    | 作用域：`SINGLE_CHAT`（单聊）/ `GROUP_CHAT`（群聊） |
| targetId | String | 是    | 目标 ID（好友 ID 或群 ID）                      |

* **响应示例**：

```json
{
  "code": 200,
  "message": "获取凭证成功",
  "data": {
    "uploadUrl": "http://file-server/upload", // 文件上传地址
    "accessToken": "file_token_xxx", // 上传凭证
    "fileId": "file_3001", // 文件 ID（后续消息关联用）
    "expireTime": "2025-10-11 18:00:00" // 凭证过期时间
  }
}
```

### 2. 发送文件消息（关联文件与聊天）

* **接口路径**：`/api/message/file/send`

* **请求方法**：`POST`

* **请求头**：`Authorization: Bearer {token}`

* **请求参数**：

| 参数名         | 类型     | 是否必填 | 说明                    |
| ----------- | ------ | ---- | --------------------- |
| fileId      | String | 是    | 上传后返回的文件 ID           |
| targetId    | String | 是    | 目标 ID（好友 / 群 ID）      |
| chatType    | String | 是    | 聊天类型：`SINGLE`/`GROUP` |
| filename    | String | 是    | 文件名                   |
| fileSize    | Long   | 是    | 文件大小（字节）              |
| downloadUrl | String | 是    | 文件下载地址（上传后生成）         |

* **响应示例**：

```json
{
  "code": 200,
  "message": "文件消息发送成功",
  "data": {
    "messageId": "msg_3001",
    "sendTime": "2025-10-11 17:00:00"
  }
}
```

### 3. 下载文件

* **接口路径**：`/api/file/download`

* **请求方法**：`GET`

* **查询参数**：

| 参数名    | 类型     | 是否必填 | 说明           |
| ------ | ------ | ---- | ------------ |
| fileId | String | 是    | 文件 ID        |
| token  | String | 是    | 下载凭证（从消息中获取） |

* **响应**：返回文件流（根据文件类型自动设置 `Content-Type`）。

## 七、动态（朋友圈）模块接口

### 1. 发布动态

* **接口路径**：`/api/moment/publish`

* **请求方法**：`POST`

* **请求头**：`Authorization: Bearer {token}`

* **请求参数**：

| 参数名        | 类型     | 是否必填 | 说明                                            |
| ---------- | ------ | ---- | --------------------------------------------- |
| content    | String | 是    | 动态内容                                          |
| images     | Array  | 否    | 图片 URL 列表                                     |
| visible    | String | 否    | 可见范围：`ALL`（全部好友）/ `PART`（部分好友）/ `PRIVATE`（私密） |
| visibleIds | Array  | 否    | `visible=PART` 时，可见好友 ID 列表                   |

* **响应示例**：

```json
{
  "code": 200,
  "message": "动态发布成功",
  "data": {
    "momentId": "moment_5001",
    "publishTime": "2025-10-11 19:00:00"
  }
}
```

### 2. 获取好友动态列表

* **接口路径**：`/api/moment/friend/list`

* **请求方法**：`GET`

* **请求头**：`Authorization: Bearer {token}`

* **查询参数**：

| 参数名      | 类型      | 是否必填 | 说明   |
| -------- | ------- | ---- | ---- |
| pageNum  | Integer | 是    | 页码   |
| pageSize | Integer | 是    | 每页条数 |

* **响应示例**：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 50,
    "list": [
      {
        "momentId": "moment_5001",
        "userId": "user_456",
        "username": "friend_user",
        "avatar": "http://xxx.com/friend_avatar.jpg",
        "content": "今天很开心～",
        "images": ["http://xxx.com/img1.jpg"],
        "publishTime": "2025-10-11 19:00:00",
        "likes": 10, // 点赞数
        "comments": 3 // 评论数
      }
      // 更多动态...
    ]
  }
}
```

### 3. 动态点赞

* **接口路径**：`/api/moment/like`

* **请求方法**：`POST`

* **请求头**：`Authorization: Bearer {token}`

* **请求参数**：

| 参数名      | 类型      | 是否必填 | 说明                           |
| -------- | ------- | ---- | ---------------------------- |
| momentId | String  | 是    | 动态 ID                        |
| isLike   | Boolean | 是    | 是否点赞（`true`：点赞，`false`：取消点赞） |

* **响应示例**：


```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "currentLikes": 11 // 当前点赞数
  }
}
```

## 八、群组管理模块接口

### 1. 邀请成员入群

* **接口路径**：`/api/group/invite`

* **请求方法**：`POST`

* **请求头**：`Authorization: Bearer {token}`（需为群主 / 管理员）

* **请求参数**：

| 参数名       | 类型     | 是否必填 | 说明          |
| --------- | ------ | ---- | ----------- |
| groupId   | String | 是    | 群 ID        |
| memberIds | Array  | 是    | 邀请的成员 ID 列表 |

* **响应示例**：

```json
{
  "code": 200,
  "message": "邀请发送成功",
  "data": null
}
```

### 2. 退出群组

* **接口路径**：`/api/group/quit`

* **请求方法**：`POST`

* **请求头**：`Authorization: Bearer {token}`

* **请求参数**：

| 参数名     | 类型     | 是否必填 | 说明   |
| ------- | ------ | ---- | ---- |
| groupId | String | 是    | 群 ID |

* **响应示例**：

```json
{
  "code": 200,
  "message": "退出群组成功",
  "data": null
}
```

### 3. 获取群成员列表

* **接口路径**：`/api/group/members`

* **请求方法**：`GET`

* **请求头**：`Authorization: Bearer {token}`

* **查询参数**：

| 参数名     | 类型     | 是否必填 | 说明   |
| ------- | ------ | ---- | ---- |
| groupId | String | 是    | 群 ID |

* **响应示例**：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "userId": "user_123",
      "username": "stellar_user",
      "avatar": "http://xxx.com/avatar.jpg",
      "role": "OWNER" // 角色：OWNER（群主）/ ADMIN（管理员）/ MEMBER（成员）
    },
    {
      "userId": "user_456",
      "username": "friend_user",
      "avatar": "http://xxx.com/friend_avatar.jpg",
      "role": "MEMBER"
    }
    // 更多成员...
  ]
}
```

## 九、Netty 长连接补充说明

Netty 用于**实时通信**（如消息推送、在线状态同步），需关注以下机制：

### 1. 连接建立与鉴权

客户端通过 WebSocket 连接到 `ws://netty-server:8080`，连接建立后发送**鉴权消息**：

```json
{
  "type": "AUTH",
  "userId": "user_123",
  "token": "xxx.xxx.xxx" // 与 HTTP 登录返回的 token 一致
}
```

服务端响应：

```json
{
  "type": "AUTH_RESULT",
  "success": true,
  "message": "鉴权成功"
}
```

### 2. 实时消息接收

服务端推送**单聊消息**给客户端的格式示例：

```json
{
  "type": "CHAT_SINGLE",
  "senderId": "user_456",
  "receiverId": "user_123",
  "content": "收到你的消息啦～",
  "msgType": "TEXT",
  "sendTime": 1740093600000, // 时间戳（毫秒）
  "messageId": "msg_1002"
}
```

### 3. 在线状态同步

服务端推送**好友在线状态变化**的格式示例：

```json
{
  "type": "ONLINE_STATUS",
  "userId": "user_456",
  "online": true,
  "device": "PC" // 设备类型：PC/MOBILE 等
}
```

## 总结

以上接口覆盖了 Stellar 即时通讯的核心功能（用户、好友、聊天、文件、动态、群组）。实际开发中，可根据需求扩展**音视频通话、红包、小程序**等功能，并完善接口的**异常处理、参数校验、性能优化**等细节。同时，Netty 需保障长连接的**稳定性、心跳检测、断线重连**等机制，确保实时通信可靠。