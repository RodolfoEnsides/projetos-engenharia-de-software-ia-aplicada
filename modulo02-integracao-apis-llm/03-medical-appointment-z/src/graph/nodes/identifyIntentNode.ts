import {
  getSystemPrompt,
  getUserPromptTemplate,
  IntentSchema,
} from "../../prompts/v1/identifyIntent.ts";
import { professionals } from "../../services/appointmentService.ts";
import { OpenRouterService } from "../../services/oppenRouterService.ts";
import type { GraphState } from "../graph.ts";

export function createIdentifyIntentNode(llmCLient: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    const input = state.messages.at(-1)!.text;

    try {
      const systemPrompt = getSystemPrompt(professionals);
      const userPrompt = getUserPromptTemplate(input);
      const result = await llmCLient.generateStructured(
        systemPrompt,
        userPrompt,
        IntentSchema,
      );
      if (!result.success) {
        console.error(`Intent identification failed ${result.error}`);
        return {
          intent: "unknown",
          error: result.error,
        };
      }
      const intentData = result.data!;
      console.log(`Intent Identified: ${intentData}`);
      return {
        ...intentData,
      };
    } catch (error) {
      console.error("❌ Error in identifyIntent node:", error);
      return {
        ...state,
        intent: "unknown",
        error:
          error instanceof Error
            ? error.message
            : "Intent identification failed",
      };
    }
  };
}
