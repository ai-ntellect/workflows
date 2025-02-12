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
  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    component + ".ts"
  );

  if (!fs.existsSync(templatePath)) {
    console.log(`❌ Le composant ${component} n'existe pas.`);
    return;
  }

  const content = fs.readFileSync(templatePath, "utf-8");
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
