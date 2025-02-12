#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs-extra";
import path from "path";

export async function addComponent(component: string) {
  const destPath = path.join(process.cwd(), "workflows", component + ".ts");

  if (fs.existsSync(destPath)) {
    console.log(`❌ Le composant ${component} existe déjà.`);
    return;
  }

  // check if the component exists in the templates folder
  const url = `https://raw.githubusercontent.com/ai-ntellect/workflows/refs/heads/main/templates/${component}.ts`;

  const res = await fetch(url);
  const content = await res.text();
  fs.outputFileSync(destPath, content);

  console.log(`✅ ${component} ajouté avec succès.`);
}

const program = new Command();

program
  .command("add <component>")
  .description("Ajoute un composant à ton projet")
  .action((component) => {
    addComponent(component);
  });

program.parse(process.argv);
