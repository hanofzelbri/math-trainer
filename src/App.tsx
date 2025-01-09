import { TrainingSession } from './components/TrainingSession'
import logo from './assets/logo.jpeg'

function App() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Math Trainer Logo" className="h-24 w-auto" />
        </div>
        <TrainingSession />
      </div>
    </main>
  )
}

export default App
