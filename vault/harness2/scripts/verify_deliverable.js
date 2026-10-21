#!/usr/bin/env node
// Deterministic Deliverable Checker (c7: scripts)
const fs = require("fs");
const targets = process.argv.slice(2);
const results = targets.map(t => ({ path: t, exists: fs.existsSync(t), bytes: fs.existsSync(t) ? fs.statSync(t).size : 0 }));
console.log(JSON.stringify({ ok: results.every(r => r.exists && r.bytes > 0), results }, null, 2));