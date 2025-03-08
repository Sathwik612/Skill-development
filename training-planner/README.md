Player-Coach Database with Chatbot

📌 Project Overview

This project is a personalized training planner integrated with a chatbot (GameSensei AI) to assist coaches in managing their teams and improving player performance. The website stores and analyzes player data, including:

Height, weight, and diet history

Training plans and performance reviews

AI-generated activity plans based on past data

Coach dashboard to manage teams

The project consists of two parts:

Frontend - Built with React.js and stored in the master branch.

Backend - Built with Python (Flask/Django) and stored in the main branch.

🛠️ Tech Stack

Frontend:

React.js

CSS

Bootstrap/Tailwind (optional)

Backend:

Python (Flask/Django)

Database (MySQL/PostgreSQL/SQLite)

REST API

🚀 Project Setup

Cloning the Repository

# Clone the repository
git clone https://github.com/Sathwik612/Player-Coach-Database-with-chatbot.git
cd Player-Coach-Database-with-chatbot

Frontend Setup (React.js)

# Switch to frontend branch
git checkout master
cd frontend

# Install dependencies
npm install

# Start frontend
yarn start  # OR npm start

Backend Setup (Flask/Django)

# Switch to backend branch
git checkout main
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run backend
python app.py  # Flask
python manage.py runserver  # Django

🔄 Pushing Code to GitHub

Push Frontend (master branch)

git checkout master  # Switch to frontend branch
git add .
git commit -m "Updated frontend"
git push origin master

Push Backend (main branch)

git checkout main  # Switch to backend branch
git add .
git commit -m "Updated backend"
git push origin main

🏆 Features

Coach Dashboard: View player stats and training plans.

Player Profile: Stores health and training history.

GameSensei AI: AI assistant generates training plans.

Database Integration: Stores all player data securely.

Scalable Architecture: Supports multiple teams.

📩 Contact

For any queries, reach out via GitHub Issues or sathiwknh@gmail.com

Happy Coding! 🚀