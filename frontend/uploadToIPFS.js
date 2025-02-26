import { create } from 'ipfs-http-client';
import fs from 'fs';
import path from 'path';
// const fs = require('fs');
// const path = require('path');

// 创建 IPFS 客户端
const client = create({ host: 'localhost', port: 5001, protocol: 'http' });

async function uploadToIPFS() {
    try {
        // 读取打包后的静态文件目录（假设是 React 的 build 文件夹）
        const buildDir = path.join(__dirname, 'build');
        const files = await client.addFromFs(buildDir, { recursive: true });

        console.log('Files uploaded to IPFS:');
        files.forEach(file => {
            console.log(`${file.path} -> ${file.cid.toString()}`);
        });

        console.log(`Frontend deployed to IPFS: /ipfs/${files[0].cid.toString()}`);
    } catch (err) {
        console.error('Error uploading to IPFS:', err);
    }
}

uploadToIPFS();
