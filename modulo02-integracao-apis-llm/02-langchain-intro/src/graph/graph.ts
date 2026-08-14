import { END, MessagesZodMeta, START, StateGraph } from "@langchain/langgraph";
import { withLangGraph } from "@langchain/langgraph/zod";
import { BaseMessage } from "@langchain/core/messages";
import { z } from "zod/v3";
import { identifyIntent } from "./nodes/identifyItentNode.ts";
import { chatResponseNode } from "./nodes/chatResponseNode.ts";
import { upperCaseNode } from "./nodes/upperCaseNode.ts";
import { lowerCaseNode } from "./nodes/lowerCaseNode.ts";

const GraphState = z.object({
  messages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),
  output: z.string(),
  command: z.enum(["uppercase", "lowercase", "unknown"]),
});

export type GraphState = z.infer<typeof GraphState>;

export function buildGraph() {
  const workflow = new StateGraph({
    stateSchema: GraphState,
  })
    .addNode("identifyIntent", identifyIntent)
    .addNode("chatResponse", chatResponseNode)
    .addNode("uppercase", upperCaseNode)
    .addNode("lowercase", lowerCaseNode)
    /* .addNode("identifyIntent", (state: GraphState) => {
      return {
        ...state,
        output: "test",
      };
    }) */

    .addEdge(START, "identifyIntent")
    .addConditionalEdges(
      "identifyIntent",
      (state: GraphState) => {
        switch (state.command) {
          case "uppercase":
            return "uppercase";
          case "lowercase":
            return "lowercase";
          default:
            return "chatResponse";
        }
      },
      {
        uppercase: "uppercase",
        lowercase: "lowercase",
      },
    )
    .addEdge("uppercase", "chatResponse")
    .addEdge("lowercase", "chatResponse")

    .addEdge("chatResponse", END);

  return workflow.compile();
}
