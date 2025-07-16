#!/bin/bash
# Sobe backend e frontend em paralelo
cd ../backend && source venv/bin/activate && uvicorn app.main:app --reload &
cd ../ && npm start &
wait 