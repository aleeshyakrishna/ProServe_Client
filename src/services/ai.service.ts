import api from "@/lib/axios";
import { mapService, type RawService } from "@/lib/service-mappers";
import { AIChatResponseData } from "@/types/ai";

/** The chat response as the backend sends it (services are raw rows). */
type RawAIChatResponse = Omit<AIChatResponseData, "services"> & {
  services?: RawService[];
};

export const aiService = {
  /**
   * Send user prompt to backend AI endpoint
   */
  async sendMessage(message: string): Promise<AIChatResponseData> {
    const response = await api.post("/api/ai/chat", { message });
    const data: RawAIChatResponse = response.data.data;
    return {
      ...data,
      services: Array.isArray(data.services) ? data.services.map(mapService) : [],
    };
  },
};
