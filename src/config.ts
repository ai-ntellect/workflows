import fs from "fs/promises";
import path from "path";

export type WorkflowConfig = {
  workflowsDir: string;
};

export async function getWorkflowConfig(): Promise<WorkflowConfig> {
  const configPath = path.join(process.cwd(), "workflow.config.json");

  try {
    const configFile = await fs.readFile(configPath, "utf-8");
    return JSON.parse(configFile);
  } catch {
    return {
      workflowsDir: "workflows",
    };
  }
}
