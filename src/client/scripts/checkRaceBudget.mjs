import { runRaceBudgetCheck } from "./raceBudget.mjs";

const code = await runRaceBudgetCheck();
process.exit(code);
