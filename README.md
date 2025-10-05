# 💡 IntelliDash: AI-Powered E-commerce Analytics Platform

**IntelliDash is a full-stack web application that revolutionizes data analysis by providing a conversational interface to a complex e-commerce database. Instead of writing SQL, users can ask plain English questions and receive instant, visualized answers.**


---

## ✨ Key Features

- **Conversational AI Agent**: Ask complex questions like *"What were the top 5 selling products last month?"* or *"Show the monthly revenue trend for the last year."*
- **Automated SQL Generation**: Leverages Google's Gemini model via LangChain to understand user intent, inspect the database schema, and generate complex SQL queries on the fly.
- **Dynamic Data Visualization**: The frontend intelligently analyzes the AI's response and renders the most appropriate visualization—be it a bar chart, line chart, or a simple table.
- **Executive KPI Dashboard**: A pre-built dashboard provides an at-a-glance overview of key business metrics like Total Revenue, Average Order Value, and Sales by Category.
- **Modern, Robust Tech Stack**: Built with a professional-grade stack including React, FastAPI, PostgreSQL, and GraphQL, fully containerized with Docker.

## 🚀 The Problem Solved

In many organizations, business users are disconnected from the data they need. Accessing insights requires technical expertise, creating bottlenecks and slowing down decision-making. IntelliDash bridges this gap, democratizing data access and empowering anyone to become a data analyst through a simple, intuitive conversational UI.

## 🛠️ Technology Stack

This project was built using a modern, scalable, and professional technology stack.

| Area      | Technology                                                                                                                              |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) ![Apollo Client](https://img.shields.io/badge/-Apollo%20Client-311C87?logo=apollo-graphql&logoColor=white) ![Recharts](https://img.shields.io/badge/-Recharts-8884d8) |
| **Backend** | ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?logo=fastapi&logoColor=white) ![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?logo=graphql&logoColor=white) ![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-D71F00?logo=sqlalchemy&logoColor=white) |
| **AI Engine** | ![LangChain](https://img.shields.io/badge/-LangChain-8A2BE2) ![Google Gemini](https://img.shields.io/badge/-Google%20Gemini-4285F4?logo=google&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white) |
| **DevOps** | ![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white) ![Nginx](https://img.shields.io/badge/-Nginx-269539?logo=nginx&logoColor=white) |

## ⚙️ System Architecture

![System Architecture Diagram](https'://your-image-host.com/intellidash-architecture.png')
*A simple diagram showing the flow: React Client -> Nginx -> FastAPI/GraphQL Backend -> LangChain Agent -> PostgreSQL DB.*

## 🏁 Getting Started

You can run this entire application on your local machine using Docker.

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
- Git
- A [Google AI Studio API Key](https://aistudio.google.com/) for the Gemini model.

### Local Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/[YOUR-GITHUB-USERNAME]/IntelliDash.git
    cd IntelliDash
    ```

2.  **Create the environment file:**
    Create a `.env` file in the project root. This file is listed in `.gitignore` and will not be committed. Add your secret keys here:
    ```env
    # .env
    DATABASE_URL="postgresql://postgres:mysecretpassword@db:5432/intellidash"
    GOOGLE_API_KEY="your-google-api-key-goes-here"
    ```
    *Note: The `DATABASE_URL` is configured to work within the Docker Compose network.*

3.  **Build and run with Docker Compose:**
    This single command will build the frontend and backend images, and start all the services (database, backend, frontend).
    ```bash
    docker-compose up --build
    ```

4.  **Access the application:**
    - The IntelliDash dashboard will be available at [http://localhost:8080](http://localhost:8080).
    - The FastAPI backend's GraphQL playground will be available at [http://localhost:8000/graphql](http://localhost:8000/graphql).

5.  **Populate the database (First Run Only):**
    The first time you run the application, the database will be empty. To populate it with realistic mock data, run the data generation script in a separate terminal:
    ```bash
    # Make sure the containers are running first (docker-compose up)
    docker-compose exec backend python scripts/generate_data.py
    ```
    After the script finishes, refresh the dashboard to see the KPIs and charts populated with data.

## 📸 Screenshots

*Replace these with your actual screenshots.*

**Executive Dashboard:**
![Executive Dashboard Screenshot](https'://your-image-host.com/dashboard.png')

**AI Deep Dive with Chart Visualization:**
![AI Deep Dive Screenshot](https'://your-image-host.com/ai-deep-dive.png')

## ⏭️ Future Improvements

This project has a solid foundation, but there's always room to grow. Potential future features include:

- [ ] **User Authentication**: Implement JWT-based authentication so users can have private dashboards.
- [ ] **Caching**: Add a Redis cache for frequently requested KPIs to improve performance.
- [ ] **More Chart Types**: Add support for pie charts, geo maps, and more.
- [ ] **Export to CSV/PDF**: Allow users to export the results of their queries.

---
