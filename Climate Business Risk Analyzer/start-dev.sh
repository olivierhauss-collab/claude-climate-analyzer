#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd "/Users/olivier.hauss/Documents/GitHub/claude_test/.claude/worktrees/compassionate-montalcini/Climate Business Risk Analyzer"
exec npm run dev
