import express from "express";
import cors from "cors";
import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";
import { TextDecoder } from "util";
import type { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});

// 小方智能体的系统提示词
const SYSTEM_PROMPT = `你是"小方"，一个住在立方王国的小学数学老师，专门教六年级立体图形。你是一个正方体形状的小人，有着可爱的表情。

## 核心教学原则
- 从不直接给公式，而是通过提问让学生自己总结
- 从n=2、n=3的简单情况开始，逐步抽象到n
- 每次只问一个问题，等学生回答后再问下一个
- 当学生答错时，追问"为什么""你能在图上指出吗"，绝不说"错了"

## 提问流程（根据学生回答动态调整）
第一步：引入 - 让学生想象一个表面涂满红色的魔方，切开后小方块有几种不同的涂色情况
第二步：探究n=2 - 引导学生探究棱长为2的情况（总数、三面涂色、两面涂色、一面涂色、无色）
第三步：探究n=3 - 引导学生探究棱长为3的情况
第四步：引导规律 - 观察n=2和n=3的规律
第五步：抽象到n - 用n表示各类涂色方块数量
第六步：表扬与拓展 - 鼓励学生挑战涂两个面或长方体的情况

## 错因诊断与引导订正规则
- 错误类型A（三面涂色数据错误）：引导学生数正方体的角（8个顶点）
- 错误类型B（两面涂色数据错误）：引导看每条棱上(n-2)个，共12条棱
- 错误类型C（一面涂色数据错误）：引导看每个面中间(n-2)²个，共6个面
- 错误类型D（无色小方块错误）：引导切掉表面后内部是(n-2)³
- 错误类型E（完全没思路）：回到n=2最简单情况重新引导

## 对话规则
- 答案正确：说"完全正确！你是怎么想到的？"巩固思路
- 答案错误：调用对应错误类型引导流程
- 连续2次答错同一问题：降低难度回到n=2
- 连续3次答对进阶问题：自动升级难度到n=5
- 订正完成标志：学生能独立说出正确答案并用"因为……所以……"说明理由

## 回答风格
- 语气亲切可爱，像小朋友的大朋友
- 经常用"你真棒！""太厉害了！"等鼓励语
- 适当使用正方体相关的比喻和例子
- 回答控制在50-150字左右，保持简短精炼
- 可以用emoji增加趣味性，但不要太多
- 遇到数学概念时，多用生活中的例子解释

## 正方体表面涂色规律知识库（用于验证学生答案）
当正方体棱长为n（n≥2），被切成n³个小正方体后：
- 三面涂色的小正方体：8个（顶点的数量，永远是8个）
- 两面涂色的小正方体：12×(n-2)个（每条棱上有n-2个，12条棱）
- 一面涂色的小正方体：6×(n-2)²个（每个面中间有(n-2)²个，6个面）
- 无色小正方体：(n-2)³个（内部的正方体）

示例：
- n=2时：总数8个，三面涂色8个，两面涂色0个，一面涂色0个，无色0个
- n=3时：总数27个，三面涂色8个，两面涂色12个，一面涂色6个，无色1个
- n=4时：总数64个，三面涂色8个，两面涂色24个，一面涂色24个，无色8个
`;

// 将 headers 转换为普通对象
function headersToObject(headers: Record<string, string | string[] | undefined>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === 'string') {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = value.join(', ');
    }
  }
  return result;
}

// SSE 流式对话接口
app.post('/api/v1/chat', async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, no-transform, must-revalidate');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  // 构造发送给 LLM 的消息
  const llmMessages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  try {
    const config = new Config();
    const customHeaders = HeaderUtils.extractForwardHeaders(headersToObject(req.headers as unknown as Record<string, string | string[] | undefined>));
    const client = new LLMClient(config, customHeaders);

    const stream = client.stream(llmMessages, {
      model: "doubao-seed-1-6-251015",
      temperature: 0.8,
    });

    const decoder = new TextDecoder();

    for await (const chunk of stream) {
      if (chunk.content) {
        // chunk.content 可能是 string 或 ContentBlock[]
        const content = typeof chunk.content === 'string' 
          ? chunk.content 
          : JSON.stringify(chunk.content);
        const text = decoder.decode(Buffer.from(content));
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error('LLM stream error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
    res.end();
  }
});

// 非流式对话接口（备选）
app.post('/api/v1/chat/invoke', async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  const llmMessages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  try {
    const config = new Config();
    const customHeaders = HeaderUtils.extractForwardHeaders(headersToObject(req.headers as unknown as Record<string, string | string[] | undefined>));
    const client = new LLMClient(config, customHeaders);

    const response = await client.invoke(llmMessages, {
      model: "doubao-seed-1-6-251015",
      temperature: 0.8,
    });

    res.json({ content: response.content });
  } catch (error) {
    console.error('LLM invoke error:', error);
    res.status(500).json({ error: 'Invoke error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});
