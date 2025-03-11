import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Rocket, Palette, Gauge, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"


function App() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      {/* Theme Toggle Button - Add this near the top */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>

      <div className="max-w-4xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Vite + React + shadcn/ui
            <Badge variant="secondary" className="ml-2">Starter Kit</Badge>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Start your next project with the power of Vite, React, Tailwind CSS, and shadcn/ui
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="https://ui.shadcn.com/docs" target="_blank">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/b-rucel/shadcnui">
                Documentation
              </a>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 pt-8">
          <Card>
            <CardHeader>
              <Rocket className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Powered by Vite for instant server start and HMR
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Palette className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Beautiful UI</CardTitle>
              <CardDescription>
                Customizable components with shadcn/ui and Tailwind CSS
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Gauge className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Performance</CardTitle>
              <CardDescription>
                Optimized for production with best practices
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Code Example */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ready to Use</CardTitle>
            <CardDescription>
              Use this repo as a starting point
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-muted px-6 py-4 rounded-md font-mono text-sm">
            <pre>
              npx degit https://github.com/b-rucel/shadcnui new-project<br /><br />

              cd new-project<br />
              npm install<br />
              npm run dev
            </pre>
          </CardContent>
          <CardFooter className="text-muted-foreground text-sm mt-4">
            Simple installation process, extensive component library included
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default App
