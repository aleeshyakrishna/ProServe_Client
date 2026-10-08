import { Service } from "@/types";

export interface AIQueryInterpretation {
  intent: "SEARCH_SERVICES" | "BOOK_SERVICE" | "GENERAL_QUERY";
  category?: string | null;
  maxPrice?: number | null;
  searchQuery?: string | null;
  summary?: string;
}

export interface AIChatResponseData {
  interpretation: AIQueryInterpretation;
  reply: string;
  services: Service[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  services?: Service[];
  timestamp: string;
}
