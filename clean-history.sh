#!/bin/bash

echo "🚨 WARNING: This script will permanently remove API keys from git history!"
echo "This is necessary if you accidentally committed sensitive information."
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Cleaning git history..."
    
    # Remove the file with API keys from all commits
    git filter-branch --force --index-filter \
        "git rm --cached --ignore-unmatch index.js" \
        --prune-empty --tag-name-filter cat -- --all
    
    # Force push to clean history
    echo "📤 Force pushing to clean remote history..."
    git push origin --force --all
    
    echo "✅ Git history cleaned successfully!"
    echo "⚠️  IMPORTANT: Make sure to set up GitHub Secrets before pushing again!"
else
    echo "❌ Operation cancelled."
fi 