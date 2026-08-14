import { AIMessage } from "@langchain/core/messages";
import { type GraphState } from "../graph.ts";

export function fallbackNode(state: GraphState): GraphState {
  const message =
    "Desculpe, não entendi o que você quis dizer. Consigo apenas transformar mensagens em UPPERCASE ou lowercase.";
  const fallbackMessage = new AIMessage(message).content.toLocaleString();

  return {
    ...state,
    output: message,
    messages: [...state.messages],
  };
}
