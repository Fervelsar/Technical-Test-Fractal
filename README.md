# Technical Test 

## Funcionalidades 
- Listado de órdenes 
- Crear y editar órdenes 
- Agregar productos a una orden 
- Cálculo automático de totales 
- Cambio de estado de la orden (Pendiente, En Progreso, Completado) 
- Validación para no editar órdenes en estado Completado 

## Base de datos (MySQL)
sql

CREATE DATABASE fractal_test;
USE fractal_test;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL
);

CREATE TABLE ordenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_orden VARCHAR(50) NOT NULL,
    fecha VARCHAR(20) NOT NULL,
    cantidad_productos INT NOT NULL,
    precio_final DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente'
);

CREATE TABLE detalle_orden (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

INSERT INTO productos (nombre, precio_unitario) VALUES
('Producto A', 10.00),
('Producto B', 25.50),
('Producto C', 7.99);

## Cómo ejecutar el proyecto

### Backend

cd backend
npm install
npm run dev

### Frontend

cd frontend
npm install
npm run dev

DEMO: https://drive.google.com/file/d/1D4CoOaXGeB-GUtVCIsgGc467BlZ6GxS0/view?usp=sharing