"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import StockChart from "./stock-chart"
import PredictionResults from "./prediction-results"
import LoadingSpinner from "./loading-spinner"

export default function StockPredictionApp() {
  const [ticker, setTicker] = useState("AAPL")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2020, 0, 1))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [futureDays, setFutureDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [stockData, setStockData] = useState<any>(null)

  const handlePredict = async () => {
    if (!ticker || !startDate || !endDate || futureDays <= 0) {
      setError("Please fill in all fields correctly")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
          futureDays,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch prediction")
      }

      const data = await response.json()
      setResults(data)
      setStockData(data.historicalData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Stock Market Prediction with GRU</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Prediction Parameters</CardTitle>
            <CardDescription>Enter stock details to predict future prices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ticker">Stock Ticker (e.g., AAPL)</Label>
              <Input
                id="ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="future-days">Number of Days to Predict</Label>
              <Input
                id="future-days"
                type="number"
                value={futureDays}
                onChange={(e) => setFutureDays(Number.parseInt(e.target.value))}
                min={1}
                max={30}
              />
            </div>

            <Button className="w-full mt-4" onClick={handlePredict} disabled={loading}>
              {loading ? <LoadingSpinner /> : "Predict"}
            </Button>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Stock Data & Predictions</CardTitle>
            <CardDescription>Historical data and future price predictions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="large" />
              </div>
            ) : stockData ? (
              <div className="space-y-6">
                <StockChart historicalData={stockData} predictions={results?.predictions} />
                <PredictionResults results={results} />
              </div>
            ) : (
              <div className="text-center text-gray-500 h-64 flex items-center justify-center">
                Enter parameters and click Predict to see results
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
