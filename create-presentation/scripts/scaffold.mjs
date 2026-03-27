#!/usr/bin/env node
// scaffold.mjs — Create a presentation project (cross-platform)
// Usage: node scaffold.mjs <slug> [base-dir]

import { cpSync, mkdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = resolve(__dirname, '..');

const slug = process.argv[2];
const base = process.argv[3] || process.cwd();

if (!slug) {
  console.error('Usage: node scaffold.mjs <slug> [base-dir]');
  process.exit(1);
}

// Timestamp: YYYYMMDD-HHMM
const now = new Date();
const ts = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
  '-',
  String(now.getHours()).padStart(2, '0'),
  String(now.getMinutes()).padStart(2, '0'),
].join('');

const dir = join(base, 'presentation', `${ts}-${slug}`);

// Copy templates
mkdirSync(join(dir, 'slides'), { recursive: true });
cpSync(join(SKILL_DIR, 'templates', 'index.html'), join(dir, 'index.html'));
cpSync(join(SKILL_DIR, 'templates', 'slides'), join(dir, 'slides'), { recursive: true });

console.log(`SCAFFOLD_DIR=${dir}`);
