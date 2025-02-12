#!/usr/bin/env node

import { execSync } from "child_process";
import { Command } from "commander";
import fs from "fs-extra";
import path from "path";

// Helper function to install dependencies
async function installDependencies(directory: string) {
  try {
    console.log("📦 Installing dependencies...");
    execSync("npm install", { cwd: directory, stdio: "inherit" });
    console.log("✅ Dependencies installed successfully");
  } catch (error) {
    console.error("❌ Failed to install dependencies:", error);
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

    // Create base directory
    fs.mkdirSync(componentPath, { recursive: true });

    // Base URL for the template files
    const baseUrl = `https://raw.githubusercontent.com/ai-ntellect/workflows/refs/heads/main/templates/${component}`;

    // Download main component file
    await downloadFile(
      `${baseUrl}/index.ts`,
      path.join(componentPath, "index.ts")
    );

    // Download package.json if it exists
    try {
      await downloadFile(
        `${baseUrl}/package.json`,
        path.join(componentPath, "package.json")
      );

      // Install dependencies if package.json was downloaded
      await installDependencies(componentPath);
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
