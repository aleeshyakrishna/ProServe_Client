import api from "@/lib/axios";
import { AIChatResponseData } from "@/types/ai";

export const aiService = {
  /**
   * Send user prompt to backend AI endpoint
   */
  async sendMessage(message: string): Promise<AIChatResponseData> {
    const response = await api.post("/api/ai/chat", { message });
    return response.data.data;
  },
};
