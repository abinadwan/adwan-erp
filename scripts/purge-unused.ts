import { promises as fs } from 'fs';
import path from 'path';

import fg from 'fast-glob';

const cwd = process.cwd();
const deleteFlag = process.argv.includes('--delete');
const exts = ['.ts', '.tsx', '.js', '.jsx'];
const entryGlobs = [
  'app/**/*.{ts,tsx,js,jsx}',
  'components/**/*.{ts,tsx,js,jsx}',
];
const allGlobs = ['{app,components,lib,supabase}/**/*.{ts,tsx,js,jsx}'];
const ignore = ['locales/**', 'public/**', 'styles/**'];

const resolveImport = async (
  from: string,
  imp: string,
): Promise<string | null> => {
  let rel = imp;
  if (imp.startsWith('@')) {
    rel = imp.slice(1); // treat alias @ as project root
  } else if (!imp.startsWith('.')) {
    return null; // ignore external modules
  }
  const base = path.resolve(path.dirname(from), rel);
  for (const ext of exts) {
    const file = base + ext;
    try {
      await fs.access(file);
      return path.relative(cwd, file);
    } catch {}
  }
  for (const ext of exts) {
    const file = path.join(base, 'index' + ext);
    try {
      await fs.access(file);
      return path.relative(cwd, file);
    } catch {}
  }
  return null;
};

const collectImports = async (file: string): Promise<string[]> => {
  const content = await fs.readFile(path.join(cwd, file), 'utf8');
  const regex = /import[^'"`]+['"`]([^'"`]+)['"`]/g;
  const imports: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(content))) {
    imports.push(m[1]!);
  }
  return imports;
};

const buildGraph = async (entries: string[]): Promise<Set<string>> => {
  const visited = new Set<string>();
  const stack = [...entries];
  while (stack.length) {
    const file = stack.pop()!;
    if (visited.has(file)) continue;
    visited.add(file);
    const imports = await collectImports(file);
    for (const imp of imports) {
      const resolved = await resolveImport(file, imp);
      if (resolved && !visited.has(resolved)) {
        stack.push(resolved);
      }
    }
  }
  return visited;
};

(async () => {
  const entries = await fg(entryGlobs, { cwd, ignore });
  const used = await buildGraph(entries);
  const all = await fg(allGlobs, { cwd, ignore });
  const orphans = all.filter((f) => !used.has(f));

  if (orphans.length === 0) {
    console.log('No unused files found.');
    return;
  }
  console.log(`${orphans.length} unused file(s):`);
  for (const f of orphans) {
    console.log(f);
    if (deleteFlag) {
      await fs.rm(path.join(cwd, f));
    }
  }
  if (deleteFlag) {
    console.log('Deleted above files.');
  }
})();
