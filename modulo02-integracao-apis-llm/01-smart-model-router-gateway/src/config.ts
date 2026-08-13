console.assert(
  process.env.OPENROUTER_API_KEY,
  "OPENROUTER_API_KEY is not defined in the environment variables. Please set it in your .env file.",
);

export type ModelConfig = {
  apiKey: string;
  httpRefer: string;
  xTitle: string;
  port: number;
  models: string[];
  temperature: number;
  maxTokens: number;
  systemPrompt: string;

  provider: {
    sort: {
      by: string;
      partition: string;
    };
  };
};

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY is required");
}

export const config = {
  apiKey,
  httpRefer: "http://pos-ia.com",
  xTitle: "Pos IA",
  port: 3000,
  models: ["liquid/lfm-2.5-2.6b:free", "nvidia/nemotron-3.5-lightning:free"],
  temperature: 0.2,
  maxTokens: 200,
  systemPrompt: "You are a helpful assistant.",

  provider: {
    sort: {
      by: "price",
      partition: "none",
    },
  },
};
