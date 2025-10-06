# 🖼️ Analyzer Images

Aplicación web para análisis de imágenes con inteligencia artificial usando Google Vision API como parte de prueba técnica.

## 🚀 Características

- **Backend**: API REST con NestJS
- **Frontend**: Interfaz moderna con Next.js 15
- **IA**: Análisis de imágenes con Google Vision API
- **UX**: Diseño con animaciones y estados de carga

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o pnpm
- Cuenta de Google Cloud Platform
- Credenciales de Google Vision API

## ⚙️ Variables de Entorno

### Backend (.env)
```env
# Puerto del servidor
PORT=3000

# Google Vision API Credentials
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=tu-project-id
GOOGLE_PRIVATE_KEY_ID=tu-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-private-key\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=tu-service-account@tu-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/tu-service-account%40tu-project.iam.gserviceaccount.com
GOOGLE_UNIVERSE_DOMAIN=googleapis.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

## 🛠️ Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone <tu-repo-url>
cd analyzer-images-project
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env  # Configurar variables de entorno
npm run start:dev
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
cp .env.example .env.local  # Configurar variables de entorno
npm run dev
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Documentación API**: http://localhost:3000/doc

## 📡 API Endpoints

### POST `/api/v1/analyzer-ia/image`
Analiza una imagen y devuelve etiquetas con nivel de confianza.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/analyzer-ia/image \
  -F "file=@imagen.jpg"
```

**Response:**
```json
{
  "tags": [
    {
      "label": "Animal",
      "confidence": 0.95
    },
    {
      "label": "Dog",
      "confidence": 0.87
    }
  ]
}
```

## 🏗️ Estructura del Proyecto

```
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   └── analyzer-ia/ # Módulo principal
│   │   │       ├── controllers/
│   │   │       ├── services/
│   │   │       └── providers/
│   │   └── main.ts
│   └── package.json
├── frontend/               # App Next.js
│   ├── app/
│   ├── components/
│   └── package.json
└── README.md
```

## 🧪 Scripts Disponibles

### Backend
```bash
npm run start:dev    # Desarrollo
npm run build        # Build
npm run start:prod   # Producción
npm run test         # Tests
```

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Build
npm run start        # Producción
npm run lint         # Linting
```

## 🔧 Configuración de Google Vision API

1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar Vision API
3. Crear credenciales de Service Account
4. Descargar archivo JSON de credenciales
5. Configurar variables de entorno con los datos del JSON

## 📝 Notas

- **Tecnologías**: NestJS, Next.js 15, React 19, Google Vision API
- **Autor**: Daniel Marroquin

## 🐛 Troubleshooting

**Error de credenciales Google:**
- Verificar que todas las variables de entorno estén configuradas
- Asegurar que el Service Account tenga permisos de Vision API

**Error de conexión Frontend-Backend:**
- Verificar que `NEXT_PUBLIC_BACKEND_URL` apunte al puerto correcto
- Confirmar que el backend esté ejecutándose en el puerto 3000
