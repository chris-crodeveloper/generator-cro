import Generator from "yeoman-generator";
import fs from "fs";
import spinners from "cli-spinners";
import chalk from "chalk";

// Local imports
import prompts from "./lib/prompts";
import {
  fetchOptimizelyExperiment,
  createOptimizelyExperiment,
  optimizelyPayload,
} from "./lib/optimizely";
import opticonfig from "~/genopti.config.js";

export default class extends Generator {
  async initializing() {
    // Save generator config in root
    this.config.save();

    // Check if opticonfig config file exists
    if (!opticonfig) return;

    // Check for any custom templates
  }

  // Prompt answers
  async prompting() {
    this.answers = await this.prompt(prompts);
  }

  writing() {
    this.log(this.answers);
  }
}
