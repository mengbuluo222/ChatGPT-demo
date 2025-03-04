const express = require('express');
const cors = require('cors');
const { create } = require('ipfs-http-client');
const multer = require('multer'); // 用于处理文件上传
const app = express();
const port = 3001;
const { signMessage } = require('./utils/sign');

const { askWenxinQuestion } = require('./utils/openai');

app.use(cors());

const client = create({ host: 'localhost', port: 5001, protocol: 'http' });

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = fs.readFileSync(req.file.path);
        const added = await client.add(file);
        res.json({ cid: added.cid.toString() });
    } catch (err) {
        res.status(500).send('Error uploading file');
    }
});

// 定义 API 接口
app.get('/api/chat/0', async (req, res) => {
    // console.log(req, 111);
    const question = req.query.question;

    if (!question) {
        return res.status(400).json({ error: '请提供问题' });
    }

    try {
        const answer = await askWenxinQuestion(question);
        
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
    console.log(res, 2);
    // signMessage(req)
    const receivedData = {
        id: Date.now(),
        text: `已批准访问`,
        sender: 'bot'
    };
    res.status(200).json({ receivedData });
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