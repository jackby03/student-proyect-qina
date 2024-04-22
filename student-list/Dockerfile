# Usar una imagen base de Node
FROM node:14

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias e instalarlas
COPY package.json yarn.lock ./
RUN yarn install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto que usa React
EXPOSE 3000

# Comando para arrancar la aplicación
CMD ["yarn", "start"]
