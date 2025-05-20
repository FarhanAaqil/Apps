import { type NextRequest, NextResponse } from "next/server"
import { addDays, format } from "date-fns"
import { StockPredictor } from "../model/stockPredictor"

export async function POST(request: NextRequest) {
  try {
    const { ticker, startDate, endDate, futureDays } = await request.json()

    if (!ticker || !startDate || !endDate || !futureDays) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Fetch historical stock data
    const stockData = await fetchStockData(ticker, startDate, endDate)

    if (!stockData || stockData.length === 0) {
      return NextResponse.json({ error: "No data found for the given ticker and date range" }, { status: 404 })
    }

    // Process the data for the frontend
    const historicalData = {
      dates: stockData.map((item) => item.date),
      prices: stockData.map((item) => item.close),
    }

    // Initialize and train the model
    const model = new StockPredictor()
    model.train(stockData, 20)

    // Make predictions
    const predictionPrices = model.predict(stockData, futureDays)

    // Generate prediction dates (excluding weekends)
    const lastDate = new Date(stockData[stockData.length - 1].date)
    const predictionDates = []

    let currentDate = lastDate
    let daysAdded = 0

    while (predictionDates.length < predictionPrices.length) {
      currentDate = addDays(currentDate, 1)
      daysAdded++

      // Skip weekends
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        predictionDates.push(format(currentDate, "yyyy-MM-dd"))
      }
    }

    // Get model evaluation metrics
    const metrics = model.evaluate(stockData)

    return NextResponse.json({
      historicalData,
      predictions: {
        dates: predictionDates,
        prices: predictionPrices,
      },
      metrics,
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to process prediction" }, { status: 500 })
  }
}

async function fetchStockData(ticker: string, startDate: string, endDate: string) {
  try {
    // In a real app, you would use a financial API like Alpha Vantage, Yahoo Finance, etc.
    // For this example, we'll generate mock data
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    // Generate mock stock data
    const stockData = []
    let currentPrice = 100 + Math.random() * 50 // Random starting price

    for (let i = 0; i <= days; i++) {
      const currentDate = addDays(start, i)

      // Skip weekends
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue
      }

      // Random daily change (-3% to +3%)
      const change = (Math.random() * 6 - 3) / 100
      currentPrice = currentPrice * (1 + change)

      stockData.push({
        date: format(currentDate, "yyyy-MM-dd"),
        open: currentPrice * (1 - Math.random() * 0.01),
        high: currentPrice * (1 + Math.random() * 0.02),
        low: currentPrice * (1 - Math.random() * 0.02),
        close: currentPrice,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
      })
    }

    return stockData
  } catch (error) {
    console.error("Error fetching stock data:", error)
    throw new Error("Failed to fetch stock data")
  }
}
