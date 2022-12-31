<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Teslo API

## Installation
1. Clonar el proyecto (git clone)
2. Instalar dependencias

```bash
$ npm install
$ yarn install
```
3. Clonar el archivo ```.env.template``` y renombrarlo a ``` .env ```
4. Cambiar las variables de entorno

5. Levantar la base de datos - Docker Desktop

```
docker-compose up -d
```
6. Ejecutar SEED de la base de datos
```bash 
http://localhost:3000/api/seed
```

## Running the app

```bash
# development
$ npm run start
$ yarn start

# watch mode
$ npm run start:dev
$ yarn start:dev

# production mode
$ npm run start:prod
$ yarn start:prod
```
