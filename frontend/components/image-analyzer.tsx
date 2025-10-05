"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2, ImageIcon, Sparkles, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AnalysisResult {
  tags: { label: string; confidence: number }[]
  imageUrl: string
}

export function ImageAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setResult(null)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al analizar la imagen")
      }

      const data = await response.json()
      setResult({
        tags: data.tags,
        imageUrl: previewUrl!,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-white/10 bg-card shadow-lg shadow-white/5 overflow-hidden relative">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-transparent rounded-bl-full" />

        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <div className="p-2 rounded-xl bg-white/10">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                Subir Imagen
              </CardTitle>
              <CardDescription className="text-base text-white/70">
                Selecciona una imagen para comenzar el análisis
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="space-y-5">
            <div className="flex items-center justify-center">
              <label
                htmlFor="file-upload"
                className="group flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-3 border-dashed border-white/20 bg-white/5 transition-all hover:bg-white/10 hover:border-secondary hover:shadow-lg hover:shadow-secondary/10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                {previewUrl ? (
                  <div className="relative h-full w-full p-6">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-contain rounded-xl shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-white/60 relative z-10">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:scale-110 transition-transform">
                      <ImageIcon className="h-12 w-12 text-white" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-base font-semibold text-white">Click para seleccionar una imagen</p>
                      <p className="text-sm text-white/50">PNG, JPG, WEBP hasta 10MB</p>
                    </div>
                  </div>
                )}
                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
              </label>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <ImageIcon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">{selectedFile.name}</span>
                    <span className="text-xs text-white/50">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="hover:bg-destructive/10 hover:text-destructive text-white/70"
                >
                  Cambiar
                </Button>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className="group relative w-full h-16 text-lg font-bold overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:hover:scale-100 disabled:opacity-50 border-0"
              size="lg"
            >
              {/* Purple gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 transition-all duration-300" />

              {/* Animated shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 -z-10" />

              {/* Pulsing ring on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/50 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />

              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center gap-3 text-white drop-shadow-lg">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="font-extrabold tracking-wide">Analizando con IA</span>
                    <div className="flex gap-1">
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
                        .
                      </span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
                        .
                      </span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
                        .
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-extrabold tracking-wide">Analizar Imagen</span>
                  </>
                )}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-2 border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Sparkles className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-2 border-white/10 bg-card shadow-xl shadow-white/5 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-accent/20 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/20 to-transparent rounded-tl-full" />

          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 shadow-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">Análisis Completado</CardTitle>
                <CardDescription className="text-base text-white/70">
                  La IA ha identificado {result.tags.length} elementos
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative">
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl opacity-20 blur-sm" />
                <div className="relative overflow-hidden rounded-xl border-2 border-white/10 bg-white/5">
                  <img
                    src={result.imageUrl || "/placeholder.svg"}
                    alt="Analyzed"
                    className="h-72 w-full object-contain bg-gradient-to-br from-white/5 to-white/10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    Etiquetas Detectadas
                  </h3>
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold bg-secondary text-white">
                    {result.tags.length} tags
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {result.tags.map((tag, index) => {
                    const colorStyles = [
                      "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30",
                      "bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30",
                      "bg-accent/20 text-accent border-accent/30 hover:bg-accent/30",
                    ]
                    const style = colorStyles[index % colorStyles.length]

                    return (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`px-4 py-2 text-sm font-medium border-2 transition-all hover:scale-105 hover:shadow-md ${style}`}
                      >
                        {tag.label} ({(tag.confidence * 100).toFixed(1)}%) 
                      </Badge>
                    )
                  })}
                </div>
              </div>

              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full h-12 text-base font-semibold border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all hover:scale-[1.02] bg-transparent text-white"
              >
                <Upload className="mr-2 h-5 w-5" />
                Analizar otra imagen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
