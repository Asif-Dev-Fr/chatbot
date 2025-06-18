export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export interface ConversationFile {
  filename: string;
  created_at: string;
}

export interface FormDataLogin {
  email: string;
  password: string;
}

export interface FormDataSignup {
  email: string;
  password: string;
  confirmPassword: string;
}
