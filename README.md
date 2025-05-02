# Dev-Space

Dev-Space is a web application consisting of two modules:

* **server/** (backend)
* **dev-fe/** (frontend)

## Project Setup

To run the project in development mode, you need to create two `.env` files.

### Environment Configuration

#### `server/.env`

```ini
DB_LOCATION=
SECRET_ACCESS_KEY=
```

#### `dev-fe/.env`

```ini
VITE_SERVER_DOMAIN=http://localhost:3000

# For image uploading
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_URL=
```

> **Note:** In theory, only `VITE_SERVER_DOMAIN` is required, but this hasn’t been tested. 😃

## Running the Project

### Backend

Navigate to the `server/` folder and run:

```sh
npm install
npm run dev
```

### Frontend

Navigate to the `dev-fe/` folder and run:

```sh
npm install
npm run dev
```
