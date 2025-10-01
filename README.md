# Posts Aggregator

Proyecto full-stack con backend en Node.js + Express y frontend en React 18 (Vite) con Tailwind CSS. El backend consume la API externa de MockAPI, agrupa los posts por nombre y expone un endpoint `/posts` que el frontend usa para renderizar una tabla con filtro en vivo. Toda la solución se puede ejecutar localmente o mediante Docker Compose e incluye una propuesta de pipeline CI/CD sobre AWS.

## Estructura
```
.
├── backend/             # API Express con endpoint /posts y pruebas Jest/Supertest
├── frontend/            # SPA en React + Tailwind con tabla y filtrado
├── docker-compose.yml   # Orquestación de backend + frontend
├── .prettierrc
├── .dockerignore
└── README.md
```

## Requisitos previos
- Node.js >= 20 y npm >= 10 (para ejecución local sin contenedores)
- Docker y Docker Compose (opcional, para ejecución containerizada)

## Variables de entorno
- `backend/.env.example`
  ```bash
  PORT=3000
  # POSTS_API_URL=https://687eade4efe65e5200875629.mockapi.io/api/v1/posts
  ```
- `frontend/.env.example`
  ```bash
  VITE_API_BASE_URL=http://localhost:3000
  ```

Copia cada archivo como `.env` en su carpeta y ajusta si necesitas apuntar a otro origen.

## Backend (Node.js + Express)
1. Instalar dependencias y ejecutar:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. Endpoint disponible en `http://localhost:3000/posts`.
3. Pruebas y formato:
   ```bash
   npm test
   npm run format
   npm run format:fix
   ```

### Endpoint `/posts`
- **Método:** `GET`
- **Descripción:** Consume la API externa, agrupa los posts por nombre (insensible a mayúsculas/minúsculas) y devuelve `{ name, postCount }` ordenados alfabéticamente.
- **Parámetro opcional:** `name` para filtrar coincidencias (p.ej. `/posts?name=Pedro`).
- **Respuesta 200 (ejemplo):**
  ```json
  [
    { "name": "Ana", "postCount": 4 },
    { "name": "Pedro", "postCount": 2 }
  ]
  ```
- **Error 500:** `{ "message": "Unable to fetch posts at this time." }` cuando la API externa falla.

## Frontend (React + Tailwind)
1. Ejecutar localmente:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   La app estará en `http://localhost:5173` utilizando la variable `VITE_API_BASE_URL`.
2. Calidad:
   ```bash
   npm run test:run
   npm run lint
   npm run format
   npm run format:fix
   ```

La interfaz muestra:
- Tabla con columnas **Usuario** y **Cantidad de Posts**
- Input para filtrar por nombre en vivo
- Estados de carga, error y vacíos

## Docker Compose
```bash
docker compose build
docker compose up
```
- Backend expuesto en `http://localhost:3000/posts`
- Frontend servido desde Nginx en `http://localhost:5173`
- Para apuntar el frontend a otro backend durante el build:
  ```bash
  docker compose build --build-arg VITE_API_BASE_URL=http://mi-backend:3000 frontend
  ```
- Ejecutar pruebas dentro de contenedores:
  ```bash
  docker compose run --rm backend npm test
  docker compose run --rm frontend npm run test:run
  ```

## CI/CD en AWS (propuesta)
1. **CodePipeline** detecta pushes en la rama principal (GitHub/CodeCommit).
2. **CodeBuild** ejecuta:
   - `npm test` en `backend`
   - `npm run test:run` y `npm run lint` en `frontend`
   - Construcción de imágenes Docker para backend y frontend, subiendo a ECR con tags `latest` y `git-sha`.
3. **Despliegue backend:** ECS Fargate actualiza la tarea con la nueva imagen; parámetros sensibles se gestionan vía Parameter Store/Secrets Manager; auto scaling basado en CPU o latencia.
4. **Despliegue frontend:** artefacto estático generado por Vite se sube a S3 y se actualiza CloudFront (invalidación de caché).
5. **Buenas prácticas:** entorno de staging con aprobación manual, escaneo de seguridad (Trivy) en build, logs centralizados en CloudWatch y alertas SNS.
