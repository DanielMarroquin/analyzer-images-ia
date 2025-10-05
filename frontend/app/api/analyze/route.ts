import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No se proporcionó ninguna imagen" }, { status: 400 })
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"

    // Envía el archivo al backend NestJS
    const backendFormData = new FormData()
    backendFormData.append("file", image)

    const response = await fetch(`${backendUrl}/api/v1/analyzer-ia/image`, {
      method: "POST",
      body: backendFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error del backend: ${errorText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al enviar imagen al backend:", error)
    return NextResponse.json(
      { error: "Error al procesar la imagen en el backend" },
      { status: 500 },
    )
  }
}
