import { Card, CardContent } from "@/components/ui/card"

interface PredictionResultsProps {
  results: {
    predictions: {
      dates: string[]
      prices: number[]
    }
    metrics: {
      mae: number
      mse: number
      rmse: number
    }
  } | null
}

export default function PredictionResults({ results }: PredictionResultsProps) {
  if (!results) return null

  const { predictions, metrics } = results

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Mean Absolute Error</div>
            <div className="text-2xl font-bold">${metrics.mae.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Mean Squared Error</div>
            <div className="text-2xl font-bold">${metrics.mse.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Root Mean Squared Error</div>
            <div className="text-2xl font-bold">${metrics.rmse.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Predicted Prices</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {predictions.prices.map((price, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="text-xs text-gray-500">{predictions.dates[index]}</div>
                <div className="text-lg font-bold">${price.toFixed(2)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
