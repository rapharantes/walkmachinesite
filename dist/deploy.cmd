@echo off
cd /d "%~dp0"
vercel deploy --prod --yes
