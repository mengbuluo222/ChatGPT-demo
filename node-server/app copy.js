const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3001;
const { ethers } = require('ethers');
const { askWenxinQuestion } = require('./utils/openai');

app.use(cors());

app.get('/api/data', async (req, res) => {
    const data = {
        message: 'Hello from the server!',
    }
    res.json(data);
});

// 定义 API 接口
app.get('/api/chat/0', async (req, res) => {
    // console.log(req, 111);
    const question = req.query.question;

    if (!question) {
        return res.status(400).json({ error: '请提供问题' });
    }

    try {
        console.log(question, 'answer-appjs');
        const answer = await askWenxinQuestion(question);
        console.log(answer, 'answer');
        
        res.json(answer);
    } catch (error) {
        res.status(500).json({ error: '内部服务器错误' });
    }
});

// 解析 JSON 格式的请求体
app.use(express.json());
// 解析 URL 编码格式的请求体
app.use(express.urlencoded({ extended: true }));

// 定义 POST 请求路由
app.post('/memory/approve-access', async (req, res) => {
    console.log(req, 2);
    
    const { message, signature, domain, types, chainId } = req.body;
    if (!message || !signature) {
        return res.status(400).json({ error: 'Please provide message and signature' });
    }

    try {
        const signerAddress = ethers.utils.verifyTypedData(
            domain,
            types,
            message,
            signature
        );

        if (!signerAddress) {
            return res.status(400).json({ error: '无效的签名' });
        }

        // 处理批准逻辑
        const receivedData = {
            id: Date.now(),
            text: `已批准访问: ${message.message}`,
            sender: 'bot'
        };

        res.status(200).json({ receivedData });
    } catch (error) {
        res.status(500).json({ error: '验证签名失败' });
    }
});

// 处理 Reject 请求
app.post('/memory/reject-access', async (req, res) => {
    // 获取请求体中的数据
    const requestData = req.body;

    // 打印接收到的数据
    const newMessage = {
        id: Date.now(),
        text: `已拒绝请求`,
        sender: 'bot'
    };

    // 返回响应
    res.status(200).json({
        message: '已拒绝请求',
        receivedData: newMessage
    });
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});