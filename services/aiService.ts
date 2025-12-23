import { DashboardData } from "../types";

const apiKey = import.meta.env.VITE_SILICONFLOW_API_KEY;
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

export async function analyzeFeeData(data: DashboardData) {
  console.log('Using SiliconFlow API Key:', apiKey ? 'Present (starts with ' + apiKey.substring(0, 6) + ')' : 'Missing');
  
  if (!apiKey) {
    return "AI 功能未启用：请配置 SiliconFlow API Key。";
  }

  const summary = data.departments.map(d => {
    const deptStaff = data.staff.filter(s => s.deptId === d.id);
    const total = deptStaff.reduce((acc, s) => acc + s.collectedAmount, 0);
    return `${d.name}: 总额 ${total}元`;
  }).join(', ');

  const topStaff = [...data.staff].sort((a, b) => b.collectedAmount - a.collectedAmount)[0];

  const prompt = `
    作为物业财务专家，请分析以下今日收费数据并给出3条简短的运营建议（中文）：
    数据概览：${summary}
    表现最好的人员：${topStaff ? `${topStaff.name} (${topStaff.collectedAmount}元)` : '无'}
    
    请重点关注：
    1. 部门间的收费差异。
    2. 完成率较低的潜在风险。
    3. 激励措施建议。
    
    请直接给出建议列表，不要有多余的客套话。
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SiliconFlow API Error Response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error?.message || `请求失败 (${response.status})`);
      } catch (e) {
        throw new Error(`请求失败 (${response.status}): ${errorText.substring(0, 100)}`);
      }
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error: any) {
    console.error("SiliconFlow analysis failed", error);
    if (error?.message?.includes('429')) {
      return "AI 建议暂时不可用：已达到 API 额度上限。请稍后再试。";
    }
    return `暂时无法生成AI建议：${error.message}`;
  }
}
