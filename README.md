# CreditX

This repository contains the CreditX loan approval prediction service. It's built with Node.js and Express, serving as an interface to a Flask-based machine learning backend.

## Table of Contents

- [CreditX Frontend](#creditx-frontend)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
  - [Usage](#usage)
  - [Project Structure](#project-structure)
  - [System Architecture](#system-architecture)
  - [Prediction Process Flow](#prediction-process-flow)
  - [Contributing](#contributing)
  - [License](#license)

## Description

The CreditX frontend provides a user-friendly web interface for submitting loan application details and receiving credit prediction results (approval status and confidence score) from a backend machine learning service. It handles form data, communicates with the Flask backend, and renders the results using EJS templates.

## Features

-   **Express.js Server**: A robust web server for handling requests.
-   **EJS Templating**: Dynamic rendering of web pages.
-   **Backend Integration**: Seamlessly communicates with a Flask ML service for predictions.
-   **Form Handling**: Processes user input from a web form.
-   **Error Handling**: Provides user-friendly messages for backend service unavailability.
-   **ML Service Warm-up**: Attempts to wake up the Flask backend on application start.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/en/) (LTS version recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
-   A running Flask backend for the credit prediction service (e.g., on `http://localhost:5000`).

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd creditX/frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

## Configuration

The application can be configured using environment variables:

-   `FLASK_URL`: The URL of your Flask backend service. Defaults to `http://localhost:5000`.
    Example: `FLASK_URL=http://your-flask-backend.com:5000`
-   `PORT`: The port on which the Express frontend server will run. Defaults to `3000`.
    Example: `PORT=8080`

## Running the Application

To start the frontend server:

```bash
npm start
# or
node app.js
```

The application will typically be accessible at `http://localhost:3000` (or the port you configured).

## Usage

1.  Ensure your Flask backend service is running and accessible at the configured `FLASK_URL`.
2.  Start the frontend application as described above.
3.  Open your web browser and navigate to `http://localhost:3000`.
4.  Fill out the loan application form with the required details.
5.  Submit the form to get a credit prediction (approved/not approved) and a confidence score.

 



## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is open-sourced under the MIT License.
```
