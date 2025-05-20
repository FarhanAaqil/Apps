"use client"

import { useEffect, useRef } from "react"
import { format } from "date-fns"

interface StockChartProps {
  historicalData: {
    dates: string[]
    prices: number[]
  }
  predictions?: {
    dates: string[]
    prices: number[]
  }
}

export default function StockChart({ historicalData, predictions }: StockChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!chartRef.current || !historicalData) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Clear previous chart
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height)

    const width = chartRef.current.width
    const height = chartRef.current.height
    const padding = 40

    // Calculate min and max values for scaling
    const allPrices = [...historicalData.prices]
    if (predictions?.prices) {
      allPrices.push(...predictions.prices)
    }

    const minPrice = Math.min(...allPrices) * 0.95
    const maxPrice = Math.max(...allPrices) * 1.05
    const priceRange = maxPrice - minPrice

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#ccc"
    ctx.stroke()

    // Draw historical data
    const totalPoints = historicalData.dates.length
    const pointSpacing = (width - 2 * padding) / (totalPoints + (predictions?.dates.length || 0) - 1)

    // Draw historical line
    ctx.beginPath()
    historicalData.prices.forEach((price, i) => {
      const x = padding + i * pointSpacing
      const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw prediction line if available
    if (predictions?.prices && predictions.prices.length > 0) {
      ctx.beginPath()

      // Start from the last historical point
      const lastHistoricalX = padding + (historicalData.prices.length - 1) * pointSpacing
      const lastHistoricalY =
        height -
        padding -
        ((historicalData.prices[historicalData.prices.length - 1] - minPrice) / priceRange) * (height - 2 * padding)

      ctx.moveTo(lastHistoricalX, lastHistoricalY)

      // Draw prediction points
      predictions.prices.forEach((price, i) => {
        const x = padding + (historicalData.prices.length - 1 + i) * pointSpacing
        const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding)
        ctx.lineTo(x, y)
      })

      ctx.strokeStyle = "#ef4444"
      ctx.setLineDash([5, 3])
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Add labels
    ctx.fillStyle = "#666"
    ctx.font = "10px Arial"

    // Y-axis labels (prices)
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (i / 5) * priceRange
      const y = height - padding - (i / 5) * (height - 2 * padding)
      ctx.fillText(`$${price.toFixed(2)}`, 5, y + 3)
    }

    // X-axis labels (dates) - show only a few for readability
    const dateStep = Math.max(1, Math.floor(totalPoints / 5))
    for (let i = 0; i < totalPoints; i += dateStep) {
      const x = padding + i * pointSpacing
      ctx.fillText(format(new Date(historicalData.dates[i]), "MM/dd"), x - 15, height - 15)
    }

    // Add legend
    ctx.fillStyle = "#3b82f6"
    ctx.fillRect(width - 100, 15, 15, 10)
    ctx.fillStyle = "#666"
    ctx.fillText("Historical", width - 80, 23)

    if (predictions) {
      ctx.strokeStyle = "#ef4444"
      ctx.setLineDash([5, 3])
      ctx.beginPath()
      ctx.moveTo(width - 100, 35)
      ctx.lineTo(width - 85, 35)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = "#666"
      ctx.fillText("Predicted", width - 80, 38)
    }
  }, [historicalData, predictions])

  return (
    <div className="w-full h-64 relative">
      <canvas ref={chartRef} width={800} height={400} className="w-full h-full"></canvas>
    </div>
  )
}
