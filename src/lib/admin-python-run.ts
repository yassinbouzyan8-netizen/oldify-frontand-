import { spawn } from "node:child_process";
import path from "node:path";

export type PythonRunResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  code: number | null;
};

function spawnPythonOnce(
  command: string,
  scriptPath: string,
  stdinBody: string,
): Promise<PythonRunResult> {
  const args =
    command === "py" ? ["-3", "-u", scriptPath] : ["-u", scriptPath];
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (d) => {
      stdout += d.toString();
    });
    child.stderr?.on("data", (d) => {
      stderr += d.toString();
    });
    child.on("close", (code) => {
      resolve({ ok: code === 0, stdout, stderr, code });
    });
    child.on("error", (err) => {
      resolve({
        ok: false,
        stdout,
        stderr: err instanceof Error ? err.message : String(err),
        code: null,
      });
    });
    if (child.stdin) {
      child.stdin.write(stdinBody, "utf8");
      child.stdin.end();
    }
  });
}

/** Exécute un script sous `process.cwd()` (ex. `python/admin_hello.py`). */
export async function runPythonScriptFromRepo(
  relativePath: string,
  stdinBody: string,
): Promise<PythonRunResult> {
  const script = path.join(process.cwd(), ...relativePath.split("/"));
  const commands =
    process.platform === "win32" ? ["python", "py"] : ["python3", "python"];

  let last: PythonRunResult | null = null;
  for (const cmd of commands) {
    const result = await spawnPythonOnce(cmd, script, stdinBody);
    last = result;
    if (result.ok) break;
    const err = result.stderr.toLowerCase();
    const cmdMissing =
      err.includes("enoent") ||
      err.includes("not found") ||
      err.includes("n'est pas reconnu") ||
      err.includes("cannot find the file");
    if (!cmdMissing) break;
  }
  return last ?? { ok: false, stdout: "", stderr: "", code: null };
}

export function parsePythonJsonStdout(stdout: string): unknown {
  const line =
    stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? "";
  return JSON.parse(line) as unknown;
}
