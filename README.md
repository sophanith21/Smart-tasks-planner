# Smart Tasks Planner

## Overview

This web application was developed as the final project for our Backend Development course. It targets university students and helps them manage their tasks efficiently using an AI-assisted planner.

## Features

* User account creation and persistent storage in MySQL
* Add, edit, and delete tasks and weekly schedules
* Set task priorities and deadlines
* Sort tasks by deadline or importance
* Get time suggestions for when to start the tasks based on deadlines and weekly availability

## Technologies Used

* **React + Vite** for front-end development
* **Express.js + Sequelize** for backend development
* **MySQL** for data storage
* **Ollama + LLaMA 3** AI model running alongside the backend server

## Installation

### 1. Requirements

* Ensure MySQL is installed and running
* Create a database named `plannerdb`:

  ```sql
  CREATE DATABASE plannerdb;
  ```
* Ensure you have ollama installed
* Install llama3 AI model:
  
  ```sh
  ollama pull llama3
  ```

* Start ollama server (needed for AI suggestions):

  ```sh
  ollama serve
  ```

### 2. Clone the repository:

```sh
git clone https://github.com/sophanith21/Smart-tasks-planner.git
```

### 3. Navigate to the project directory:

```sh
cd Smart-tasks-planner
```

### 4. Install dependencies:

```sh
cd Client
npm install
cd ../Backend
npm install
```

### 5. Start the development server:

On one terminal:
```sh
cd Backedn
node src/server.js  # Backend
```

On another terminal:
```sh
cd Client
npm run dev         # Frontend
```

> ⚠️ Make sure to set up your environment variables (e.g., MySQL credentials) in a `.env` file (See `.env.example` for reference)

## Usage

### Tasks Page

* Create, edit, and delete tasks
* Right-click a task to delete it or set its priority
* Click the **deadline**, located on the **right-most side** of each task, to edit it
* Below the deadline is the suggested start time — you can edit this or let the AI suggest it
* Click "Get time suggestion" to use the AI's recommendation

### Weekly Schedule Page

* Click "Create a new weekly schedule" (one schedule per account)
* Click "Add new row" to add entries to your schedule
* Right-click any cell to choose between "Delete row" or "Delete schedule"

### History Page

* View saved suggestions (when you clicked "Save for later" in the Tasks page)
* Right-click a saved suggestion to delete it

## Notes

* All data is stored locally in your MySQL database

## License

This project is for educational purposes only.

---

*Developed as part of the Backend Development course, Year 2, Term 3.*
