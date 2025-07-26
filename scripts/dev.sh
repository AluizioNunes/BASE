#!/bin/bash
# Sobe backend e frontend em paralelo
cd ../Backend && source venv/bin/activate && uvicorn app.main:app --reload &
cd ../ && npm run dev &
wait 