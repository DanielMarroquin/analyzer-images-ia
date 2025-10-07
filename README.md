# 🖼️ Analyzer Images

Aplicación web para análisis de imágenes con inteligencia artificial usando Google Vision API — proyecto de prueba técnica.

> **Demo pública**: Si no lo pueden ejecutar localmente, pueden usar la demo hospedada en:
> **[https://analyzer-images.netlify.app/](https://analyzer-images.netlify.app/)**

## 🚀 Resumen

* **Backend**: API REST con NestJS
* **Frontend**: Next.js 15 (app router)
* **IA**: Google Vision API
* **UX**: Animaciones y estados de carga

---

## 📋 Requisitos Previos

* Node.js **18.x** (recomendado LTS). Usa `nvm use 18` si tienes `nvm`.
* npm o pnpm (si usas pnpm, ajusta los comandos).
* Cuenta de Google Cloud con Vision API habilitada.
* Archivo JSON de credenciales del Service Account (no subir al repo).

---

## Repositorio

* Rama `master` (GitHub): [https://github.com/DanielMarroquin/analyzer-images-ia.git](https://github.com/DanielMarroquin/analyzer-images-ia.git)



## ⚙️ Variables de Entorno

### Opción recomendada (archivo JSON)

Guarda tu JSON de credenciales en el servidor/local como `./service-account.json` y exporta:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"
```

Esta forma evita problemas con saltos de línea en `GOOGLE_PRIVATE_KEY`.

### Alternativa (variables individuales)

Si prefieres usar `.env`, coloca **exactamente** las variables (nota: el manejo de `GOOGLE_PRIVATE_KEY` con saltos de línea puede necesitar `\\n` escapados).

#### Backend (`backend/.env`)

```env
PORT=3000
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=tu-project-id
GOOGLE_PRIVATE_KEY_ID=tu-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...tu clave...\\n-----END PRIVATE KEY-----\\n"
GOOGLE_CLIENT_EMAIL=tu-service-account@tu-project.iam.gserviceaccount.com
```

#### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

> **Seguridad**: Nunca commitees credenciales. Añade los archivos JSON y `.env` a `.gitignore`.

**Enlaces seguros con .env (one-time secret):**

* Enlace con `.env.local` del front: [https://eu.onetimesecret.com/secret/3t35l1k458gvddxetwg2clkbatmtjee](https://eu.onetimesecret.com/secret/3t35l1k458gvddxetwg2clkbatmtjee)
* Enlace con `.env` del back: [https://eu.onetimesecret.com/secret/hyx15lbkiazmoa7480ulv4av7kd7u9s](https://eu.onetimesecret.com/secret/hyx15lbkiazmoa7480ulv4av7kd7u9s)

---

## 🛠️ Instalación y Ejecución (local)

### 1. Clonar

```bash
git clone https://github.com/DanielMarroquin/analyzer-images-ia.git
cd analyzer-images-project
```

### 2. Backend

```bash
cd backend
npm install
# copiar ejemplo y editar .env si usas esa opción
cp .env.example .env
# Si usas JSON:
# cp path/to/creds.json ./service-account.json
# export GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"

npm run start:dev   # desarrollo (hot reload)
# Para producción:
npm run build
npm run start:prod  # espera dist/ listo (explica cómo start:prod ejecuta node dist/main.js)
```

**Dónde mirar**: build de NestJS en `backend/dist/`, logs en consola.

### 3. Frontend

```bash
cd ../frontend
npm install
cp .env.example .env.local
npm run dev          # abre en http://localhost:3001 por defecto
# Para producción
npm run build
npm run start        # correr build optimizada
```

**Nota de puertos**: Por defecto el frontend se sirve en `http://localhost:3001`. Asegúrate que `NEXT_PUBLIC_BACKEND_URL` apunte al puerto correcto del backend (`http://localhost:3000`).

---

## 🔗 Endpoints principales

### POST `/api/v1/analyzer-ia/image`

Analiza una imagen y devuelve etiquetas con confianza.

**Ejemplo curl**

```bash
curl -X POST "${NEXT_PUBLIC_BACKEND_URL:-http://localhost:3000}/api/v1/analyzer-ia/image" \
  -F "file=@imagen.jpg"
```

**Ejemplo respuesta**

```json
{
  "tags": [
    { "label": "Animal", "confidence": 0.95 },
    { "label": "Dog", "confidence": 0.87 }
  ]
}
```

**Docs**: API docs disponibles en `http://localhost:3000/doc` (Swagger/OpenAPI) — verificar ruta en caso de configuraciones.

---

## 🏗️ Estructura del proyecto

```
├── backend/                 # API NestJS (src/, dist/)
│   ├── src/
│   │   ├── modules/
│   │   │   └── analyzer-ia/
│   │   └── main.ts
│   └── package.json
├── frontend/                # Next.js (app/, components/, .next/)
│   └── package.json
└── README.md
```

---

## 🧪 Scripts disponibles (resumen)

**Backend**

```bash
npm run start:dev    # dev
npm run build        # build -> dist/
npm run start:prod   # start prod (ej. node dist/main.js)
npm run test         # tests unitarios
```

**Frontend**

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## 🔧 Configuración Google Vision (resumen rápido)

1. Crear proyecto en Google Cloud Console.
2. Habilitar Vision API.
3. Crear Service Account con rol `Vision API User` (o similar).
4. Descargar JSON de credenciales.
5. Usar `GOOGLE_APPLICATION_CREDENTIALS` o mapear valores en `.env`.

---

## 🐛 Troubleshooting (rápido)

* **Credenciales Google**: Si recibes `invalid_client` o errores 401, revisa que `GOOGLE_APPLICATION_CREDENTIALS` apunte al JSON y que el Service Account tenga permisos.
* **CORS**: Si el navegador bloquea llamadas al backend, revisa `CORS` en `main.ts` de NestJS y añade `http://localhost:3001`.
* **Frontend no encuentra backend**: revisa `NEXT_PUBLIC_BACKEND_URL` y que backend esté levantado en el puerto indicado.
* **Problemas con `GOOGLE_PRIVATE_KEY`**: usa la variable `GOOGLE_APPLICATION_CREDENTIALS` para evitar problemas con `\\n`.

---

## ✅ Checklist para reviewers (qué se espera)

* [ ] Instrucciones para levantar backend y frontend reproducibles.
* [ ] `.env.example` y método recomendado (JSON) para credenciales.
* [ ] Build de producción ejecutable (`npm run build` → `npm run start:prod`).
* [ ] Tests unitarios disponibles y ejecutables.
* [ ] Documentación de la API (Swagger/OpenAPI).
* [ ] Demo pública: **[https://analyzer-images.netlify.app/](https://analyzer-images.netlify.app/)**

---
---

## Autor

Daniel Marroquín
