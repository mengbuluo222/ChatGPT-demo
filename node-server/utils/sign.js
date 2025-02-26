const { ethers } = require('ethers');

function signMessage(req) {
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
}

module.exports = {
  signMessage
};