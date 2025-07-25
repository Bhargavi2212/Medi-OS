#!/bin/bash

# Remove any git locks
rm -f .git/index.lock .git/HEAD.lock

# Kill any hanging git processes
pkill -f git || true

# Initialize fresh repo
rm -rf .git
git init
git branch -M main

# Create gitignore
echo "node_modules/" > .gitignore
echo "*.log" >> .gitignore
echo ".env" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore

# Add files
git add .gitignore
git add backend/src/
git add backend/package.json
git add backend/README-PATIENT-SYSTEM.md
git add backend/debug-jwt.js
git add ml/
git add llm_api.py
git add src/
git add *.py

# Commit
git commit -m "Healthcare management system - initial commit"

echo "Ready to push. Add your GitHub remote and push:"
echo "git remote add origin YOUR_GITHUB_URL"
echo "git push -u origin main"