import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { analyzeGlbBuffer, analyzeGlbFile } from "./glbBudget.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(scriptDir, "..");
const raceDir = path.join(clientDir, "src/pages/Race");
const budgetsPath = path.join(raceDir, "budgets.json");

/** Sum triangle count from an analyzed GLB stats object (tests / legacy API). */
export const countTriangles = ({ triangles }) => triangles;

export const loadBudgets = (configPath = budgetsPath) => {
  const raw = readFileSync(configPath, "utf8");
  return JSON.parse(raw);
};

/**
 * @returns {{ ok: boolean, warnings: string[], errors: string[], triangles: number | null }}
 */
export const checkCarBudget = async ({
  budgets = loadBudgets(),
  raceRoot = raceDir,
  analyze = analyzeGlbFile,
} = {}) => {
  const car = budgets.car;
  if (!car?.path) {
    return {
      ok: false,
      warnings: [],
      errors: ["budgets.json: missing car.path"],
      triangles: null,
    };
  }

  const assetPath = path.join(raceRoot, car.path);
  if (!existsSync(assetPath)) {
    return {
      ok: true,
      warnings: [
        `[race-budget] SKIP: ${car.path} not found — triangle budget applies once the GLB is committed.`,
      ],
      errors: [],
      triangles: null,
    };
  }

  const warnings = [];
  const errors = [];
  const fileBytes = statSync(assetPath).size;
  if (car.maxFileBytes && fileBytes > car.maxFileBytes) {
    errors.push(
      `File size ${fileBytes} exceeds max ${car.maxFileBytes} bytes (${car.path}).`,
    );
  }

  let triangles = null;
  let texMax = 0;
  try {
    const stats = analyze(assetPath);
    triangles = stats.triangles;
    texMax = stats.maxTextureDimension;
  } catch (error) {
    errors.push(`Failed to read ${car.path}: ${error.message}`);
    return { ok: false, warnings, errors, triangles: null };
  }

  if (car.warnTriangles && triangles > car.warnTriangles && triangles <= car.maxTriangles) {
    warnings.push(
      `Triangle count ${triangles} exceeds warn threshold ${car.warnTriangles} (max ${car.maxTriangles}).`,
    );
  }

  if (car.maxTriangles && triangles > car.maxTriangles) {
    errors.push(
      `Triangle count ${triangles} exceeds max ${car.maxTriangles} (${car.path}).`,
    );
  }

  if (car.maxTextureDimension && texMax > car.maxTextureDimension) {
    errors.push(
      `Texture dimension ${texMax}px exceeds max ${car.maxTextureDimension}px.`,
    );
  }

  return {
    ok: errors.length === 0,
    warnings,
    errors,
    triangles,
  };
};

export const runRaceBudgetCheck = async () => {
  const result = await checkCarBudget();

  result.warnings.forEach((message) => {
    console.warn(message);
  });

  if (result.triangles != null) {
    const car = loadBudgets().car;
    console.log(
      `[race-budget] ${car.path}: ${result.triangles} triangles (warn ${car.warnTriangles}, max ${car.maxTriangles})`,
    );
  }

  if (result.errors.length) {
    result.errors.forEach((message) => {
      console.error(`[race-budget] ${message}`);
    });
    return 1;
  }

  return 0;
};

export { analyzeGlbBuffer, analyzeGlbFile };
