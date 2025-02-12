#!/usr/bin/env node

import { execSync } from "child_process";
import { Command } from "commander";
import fs from "fs-extra";
import path from "path";

async function installComponentDependencies(componentPath: string) {
  try {
    const packageJsonPath = path.join(componentPath, "package.json");

    // Check if package.json exists for the component
    if (fs.existsSync(packageJsonPath)) {
      console.log("📦 Installing component dependencies...");
      execSync("pnpm install", { cwd: componentPath, stdio: "inherit" });
      console.log("✅ Component dependencies installed successfully");
    }
  } catch (error) {
    console.error("❌ Failed to install component dependencies:", error);
    throw error; // Propagate error to handle cleanup in addComponent
  }
}

// Helper function to download and save a file
async function downloadFile(url: string, destPath: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download: ${url}`);
  }
  const content = await res.text();
  fs.outputFileSync(destPath, content);
}

export async function addComponent(component: string) {
  const baseDestPath = path.join(process.cwd(), "workflows");
  const componentPath = path.join(baseDestPath, component);
  if (fs.existsSync(componentPath)) {
    console.log(`❌ Component ${component} already exists.`);
    return;
  }

  try {
    console.log(`🚀 Adding ${component} component...`);

    // Base URL for the template files
    // use curl -s https://api.github.com/repos/ai-ntellect/workflows/contents/templates/counter
    const res = await fetch(
      "https://api.github.com/repos/ai-ntellect/workflows/contents/templates/counter"
    );
    const data = await res.json();
    console.log(data);
    for (const file of data) {
      const baseUrl = `https://raw.githubusercontent.com/ai-ntellect/workflows/refs/heads/main/templates/${component}/${file.name}`;
      await downloadFile(baseUrl, path.join(componentPath, file.name));
    }

    // Download package.json if it exists
    try {
      // Install dependencies if package.json was downloaded
      await installComponentDependencies(componentPath);
    } catch (error) {
      // Ignore if package.json doesn't exist
    }

    console.log(`✅ ${component} component added successfully.`);
  } catch (error) {
    console.error(`❌ Failed to add ${component}:`, error);
    // Clean up if something went wrong
    if (fs.existsSync(componentPath)) {
      fs.removeSync(componentPath);
    }
  }
}

const program = new Command();

program
  .command("add <component>")
  .description("Add a component to your project")
  .action((component) => {
    addComponent(component);
  });

program.parse(process.argv);
