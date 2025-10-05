import { ImageAnalyzer } from "@/components/image-analyzer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 space-y-6">
            <div className="inline-block">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                <div className="h-3 w-3 rounded-full bg-secondary animate-pulse delay-100" />
                <div className="h-3 w-3 rounded-full bg-accent animate-pulse delay-200" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
              <span className="text-foreground">Descubre qué ve</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                la inteligencia artificial
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl text-pretty leading-relaxed">
              Sube cualquier imagen y obtén un análisis instantáneo con etiquetas descriptivas generadas por IA
            </p>
          </div>

          <ImageAnalyzer />

          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-mono">v1.0</span>
                <span>•</span>
                <span>Prueba técnica Daniel Marroquin</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <span>Análisis de imágenes en tiempo real</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
