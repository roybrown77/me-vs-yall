const { spawn } = require('child_process');

const child = spawn('npm', ['start'], {
  cwd: 'src/client',
  stdio: 'inherit',
});

const shutdown = (signal) => {
  if (child.exitCode !== null || child.signalCode !== null) {
    process.exit(0);
    return;
  }

  child.kill(signal);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

child.on('exit', (code, signal) => {
  if (signal) {
    process.exit(1);
    return;
  }

  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('[CLIENT] Failed to start client process:', error);
  process.exit(1);
});
