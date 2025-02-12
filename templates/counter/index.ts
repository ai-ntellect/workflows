import { GraphFlow } from "@ai.ntellect/core";
import { z } from "zod";

const CounterSchema = z.object({
  count: z.number(),
  message: z.string(),
});

export const counterWorkflow = new GraphFlow<typeof CounterSchema>(
  "CounterWorkflow",
  {
    name: "CounterWorkflow",
    schema: CounterSchema,
    context: { count: 0, message: "" },
    nodes: [
      {
        name: "increment",
        execute: async (context) => {
          context.count++;
        },
        next: ["checkThreshold"],
      },
      {
        name: "checkThreshold",
        condition: (context) => context.count < 10,
        execute: async (context) => {
          if (context.count >= 10) {
            context.message = "Threshold reached!";
          }
        },
        next: ["increment"],
      },
    ],
  }
);
