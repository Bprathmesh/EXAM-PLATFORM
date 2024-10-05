# EXAM-PLATFORM

This project is a full-screen exam platform built with React using Create React App. It provides a secure environment for conducting online exams with various anti-cheating measures.

## Features

- Full-screen exam mode with violation tracking
  - Automatically switches to full-screen mode when the exam starts
  - Tracks and restricts full-screen exits (maximum 2 exits allowed)
  - Terminates the exam after exceeding the full-screen exit limit
- Window switch detection
  - Tracks when the user switches away from the exam window
  - Allows a maximum of 2 window switches before terminating the exam
- Reverse countdown timer
  - Displays a timer counting down from a specified duration
  - Auto-submits the exam when the timer runs out
- Customizable exam duration
  - Allows setting the exam duration before starting
- Weighted scoring for questions
  - Supports assigning different weights to questions for scoring
- Basic report generation
  - Provides a summary of the exam attempt, including score and violations
- Ability to reset and restart the exam

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/EXAM-PLATFORM.git
   ```

2. Navigate to the project directory:
   ```
   cd EXAM-PLATFORM
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Running the Application

1. Start the development server:
   ```
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. Set the desired exam duration on the welcome screen.
2. Click "Start Exam" to begin in full-screen mode.
3. Answer the questions presented.
4. Submit the exam or wait for the timer to expire.
5. View the exam report, including score and any violations.
6. Optionally restart the exam.

## Building for Production

To create a production build, run:

```
npm run build
```

The built files will be in the `build` directory.

## Technologies Used

- React
- Create React App
- react-full-screen

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
