# Travel ChatBot Application

## Overview

This project consists of a **Travel ChatBot Application** designed to provide users with travel-related assistance through a conversational interface. The application is built with a **React Native frontend** and a **Flask backend** that utilizes **LLM (Mistral)** for prompt engineering to generate intelligent and accurate responses about travel-related queries. The backend also integrates with a **MySQL database** to manage user conversations.

---

## Project Structure

The repository contains two main folders:

1. **Frontend**  
   A React Native application that serves as the user interface for the chatbot, enabling users to chat and receive travel assistance.

2. **Backend**  
   A Flask-based API that handles conversation logic, integrates with the Mistral LLM for generating chatbot responses, and manages user data with a MySQL database.

---

### Frontend

The frontend application is built with **React Native** and contains the following key directories:

- **`assets`**: Contains images and other static assets.  
- **`components`**: Reusable UI components for the application.  
- **`constants`**: Stores application-wide constants, such as theme colors and configuration variables.  
- **`navigations`**: Defines the navigation logic for the app.  
- **`screens`**: Contains the main screens of the app, including the chat interface.  
- **`themes`**: Manages theming and styles for the app.  
- **`utils`**: Utility functions and helper files.  

### Backend

The backend application is built with **Flask** and consists of:

- **`app.py`**: The main entry point for the Flask API, which defines the routes and logic for handling user interactions.  
- **`models.py`**: Contains database models for managing users and conversations in a MySQL database.  
- **`requirements.txt`**: Lists all Python dependencies required to run the backend.  
- **`cmd`**: A configuration script or helper file for backend operations.  

The backend integrates with the **Mistral LLM API** to generate contextually accurate and helpful responses for travel-related queries using advanced **prompt engineering techniques**.

---

## Features

### Frontend
- **Modern UI/UX**: Intuitive and responsive design for seamless interaction.  
- **Real-time Chat**: Engage with the chatbot for personalized travel recommendations.  
- **Dynamic Themes**: Supports dark and light themes.  

### Backend
- **LLM Integration**: Uses Mistral LLM for intelligent travel-focused responses.  
- **Prompt Engineering**: Tailored prompts to ensure precise and helpful outputs.  
- **Database Integration**: MySQL database for storing user conversations and metadata.  
- **REST API**: Exposes endpoints for handling user interactions.

---

## Installation and Setup

### Prerequisites
- **Frontend**:  
  - Node.js and npm/yarn installed.  
  - Expo CLI installed globally (`npm install -g expo-cli`).  

- **Backend**:  
  - Python 3.x installed.  
  - MySQL installed and running.  

### Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

4. **Database Setup**
   - Create a MySQL database for the application.  
   - Update the database credentials in the backend configuration (e.g., `app.py` or environment variables).  

5. **Run the Application**
   - Start the backend Flask server.  
   - Start the frontend React Native app using Expo.  

---

## Usage

- Open the application on your device or emulator.  
- Start a conversation with the chatbot to receive travel-related assistance and recommendations.  

---

## Technology Stack

### Frontend
- **React Native**  
- **Expo**  
- **React Navigation**  

### Backend
- **Flask**  
- **MySQL**  
- **Mistral LLM API**  

---

## Future Enhancements

- Add multilingual support for international users.  
- Implement push notifications for travel updates.  
- Enhance the AI with additional travel datasets for more accurate recommendations.  
