#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs/promises";
import ora from "ora";
import path from "path";
import { getWorkflowConfig } from "./config";

const program = new Command();

async function installWorkflow(name: string) {
  const spinner = ora("Checking registry...").start();

  try {
    const config = await getWorkflowConfig();

    spinner.succeed("Registry checked");
    spinner.start("Installing workflow...");

    // Create workflows directory if it doesn't exist
    const targetDir = path.join(process.cwd(), config.workflowsDir);
    await fs.mkdir(targetDir, { recursive: true });

    // Get workflow template from npm package
    const templatePath = path.join(__dirname, "..", "templates", `${name}.ts`);
    const workflowContent = await fs.readFile(templatePath, "utf-8");

    // Write workflow file
    const targetPath = path.join(targetDir, `${name}.ts`);
    await fs.writeFile(targetPath, workflowContent);

    spinner.succeed("Installation complete");
    console.log(chalk.green("\n✔ Created 1 file:"));
    console.log(chalk.dim(`  - ${config.workflowsDir}/${name}.ts`));
  } catch (error) {
    spinner.fail("Installation failed");
    console.error(chalk.red(error));
    process.exit(1);
  }
}

program
  .name("@ai.ntellect/workflows")
  .description("CLI to add pre-built workflows")
  .version("1.0.0");

program
  .command("add <workflow>")
  .description("Add a pre-built workflow")
  .action(installWorkflow);

program.parse();
