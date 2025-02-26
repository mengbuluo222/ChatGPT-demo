const axios = require('axios');
const API_KEY = 'JA5xwhtdXpVjlUAWBASjclqF';
const SECRET_KEY = 'XPYUb5dWV9nffmP04PptReOenU8Mbxu7';
const API_URL = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro';
const API_URL_TOKEN = 'https://aip.baidubce.com/oauth/2.0/token';

// 获取访问令牌
async function getAccessToken() {
  const postData = {
    client_id: API_KEY,
    client_secret: SECRET_KEY,
    grant_type: 'client_credentials'
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded' // 注意这里的 Content-Type
    }
  };

  try {
    const response = await axios.post(API_URL_TOKEN, new URLSearchParams(postData).toString(), config);
    return response.data.access_token;
  } catch (error) {
    console.error('请求百度引擎API出错:', error);
    return null;
  }
}

// 调用文心一言 API 进行问答
async function askWenxinQuestion(question) {
  if (typeof question !== 'string') {
    console.error('Question must be a string:', question);
    return null;
  }

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const postData = {
    "messages": [
      {
        "role": "user",
        "content": question
      },
    ],
    "temperature": 0.95,
    "top_p": 0.8,
    "penalty_score": 1,
    "enable_system_memory": false,
    "disable_search": false,
    "enable_citation": false
  };

  try {
    const response = await axios.post(API_URL + '?access_token=' + await getAccessToken(), postData, config);
    console.log(response.data, 'response.data');
    return response.data;
  } catch (error) {
    console.error('请求百度引擎API出错:', error);
    return null;
  }
}

module.exports = { getAccessToken, askWenxinQuestion };