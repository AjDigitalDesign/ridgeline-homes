export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatWidgetConfig {
  primaryColor?: string;
  welcomeMessage?: string;
  placeholderText?: string;
  headerTitle?: string;
  headerSubtitle?: string;
}

export interface ChatWidgetProps {
  tenantId: string;
  onLeadCaptured?: (inquiryId: string) => void;
}

export interface UseChatOptions {
  tenantId: string;
  onLeadCaptured?: (inquiryId: string) => void;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  config: ChatWidgetConfig;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
}
