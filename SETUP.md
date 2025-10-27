# Configuración del Proyecto HRM Backend

## Opción 1: Con Docker (Recomendado)

### Instalar Docker Desktop
1. Descargar desde: https://www.docker.com/products/docker-desktop/
2. Instalar y reiniciar

### Levantar PostgreSQL
```bash
# Docker moderno
docker compose up -d

# O si tienes docker-compose instalado
docker-compose up -d
```

## Opción 2: PostgreSQL local con Homebrew

### 1. Instalar PostgreSQL
```bash
brew install postgresql@15
brew services start postgresql@15
```

### 2. Crear base de datos
```bash
psql postgres
CREATE USER hrm_user WITH PASSWORD 'hrm_password';
CREATE DATABASE hrm_db OWNER hrm_user;
\q
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la base de datos
```bash
# Ejecutar migraciones y seeders
npm run db:setup
```

### 4. Iniciar el servidor
```bash
npm start
```

## Comandos útiles

- `docker-compose down` - Detener PostgreSQL
- `npm run db:migrate` - Solo ejecutar migraciones
- `npm run db:seed` - Solo ejecutar seeders
- `docker-compose logs postgres` - Ver logs de PostgreSQL

## Configuración

La configuración de la base de datos está en:
- `docker-compose.yml` - Configuración de PostgreSQL
- `.env` - Variables de entorno
- `config/config.js` - Configuración de Sequelize