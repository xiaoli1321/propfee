
import { GoogleGenAI } from "@google/genai";
import { DashboardData } from "../types";

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Gemini API Key is missing. AI features will be disabled.");
}

const ai = apiKey ? new GoogleGenAI(apiKey) : null;

export async function analyzeFeeData(data: DashboardData) {
  if (!ai) {
    return "AI 功能未启用：请配置 API Key。";
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
    表现最好的人员：${topStaff.name} (${topStaff.collectedAmount}元)
    
    请重点关注：
    1. 部门间的收费差异。
    2. 完成率较低的潜在风险。
    3. 激励措施建议。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini analysis failed", error);
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
      return "AI 建议暂时不可用：已达到免费额度上限（Quota Exceeded）。请稍后再试，或检查您的 Google AI Studio 账单设置。";
    }
    return "暂时无法生成AI建议，请检查网络或配置。";
  }
}
