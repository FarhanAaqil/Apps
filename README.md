# Stock Market Prediction Web Application

This is a full-stack web application for stock market prediction using GRU (Gated Recurrent Unit) neural networks. The application allows users to input a stock ticker symbol, select a date range, and predict future stock prices.

## Features

- Interactive UI for inputting stock prediction parameters
- Historical stock data visualization
- Future price predictions using GRU neural networks
- Model accuracy metrics (MAE, MSE, RMSE)
- Responsive design for all device sizes

## Tech Stack

- **Frontend**: React.js with Next.js App Router
- **Backend**: Next.js API Routes
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Machine Learning**: TensorFlow.js (simulated in this demo)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/stock-market-prediction.git
cd stock-market-prediction
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Start the development server
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a stock ticker symbol (e.g., AAPL, MSFT, GOOGL)
2. Select a date range for historical data
3. Enter the number of days to predict
4. Click the "Predict" button
5. View the historical data chart and future predictions
6. Check the model accuracy metrics

## Implementation Details

### Frontend

The frontend is built with React and Next.js, providing a responsive and interactive user interface. It includes:

- Form components for user input
- Interactive chart for data visualization
- Cards for displaying prediction results and metrics

### Backend

The backend is implemented using Next.js API Routes, providing endpoints for:

- Fetching historical stock data
- Processing data for the GRU model
- Training the model and making predictions
- Calculating accuracy metrics

### Machine Learning Model

The application uses a GRU (Gated Recurrent Unit) neural network for time series prediction. The model:

- Takes historical stock prices as input
- Processes sequences of data to learn patterns
- Predicts future stock prices based on learned patterns

## License

This project is licensed under the MIT License - see the LICENSE file for details.
