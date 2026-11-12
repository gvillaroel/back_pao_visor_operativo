# Casos de uso — nodeAvailability

## 1. Propósito

Describir cómo el frontend consulta la disponibilidad de inventario mostrada en la pantalla de consulta de producto y qué datos obtiene de `nodeAvailability`.

Este documento distingue el flujo funcional esperado por la pantalla del contrato que el microservicio implementa actualmente. La pantalla **“Reporte de Inventario Compras”** no forma parte del alcance de este microservicio.

## 2. Alcance y actores

### Actores

- **Usuario operativo:** captura los criterios de búsqueda y consulta el inventario.
- **Frontend del visor:** valida los datos, resuelve el centro (`centroid`) a partir del código postal y presenta el resultado.
- **Microservicio nodeAvailability:** recibe un centro y uno o más SKU, consulta Inventory Visibility y devuelve la disponibilidad.
- **Inventory Visibility:** fuente de los datos de disponibilidad.

### Dentro del alcance

- Consulta de disponibilidad por centro y SKU.
- Presentación de cantidades disponibles en la ficha del producto.
- Comparación de la disponibilidad reportada con la cantidad solicitada en pantalla, como comportamiento del frontend.
- Manejo de validaciones y errores de consulta.


## 3. Caso de uso UC-01: Consultar disponibilidad de un producto

**Actor principal:** Usuario operativo  
**Disparador:** El usuario captura los criterios de búsqueda y selecciona **Buscar**.  
**Resultado esperado:** El frontend muestra la disponibilidad del SKU para el centro correspondiente al código postal y permite evaluar si alcanza la cantidad solicitada.

### Precondiciones

1. El frontend puede resolver el código postal ingresado a un `centroid`.
2. Se cuenta con al menos un SKU válido.
3. nodeAvailability y Inventory Visibility están disponibles.

### Flujo principal

1. El usuario captura el SKU y el código postal; puede indicar la cantidad deseada y seleccionar una empresa en la pantalla.
2. El frontend valida los campos y resuelve el código postal a un `centroid`.
3. El frontend envía a nodeAvailability el `centroid` y el SKU.
4. nodeAvailability valida el centro y la lista de SKU.
5. nodeAvailability consulta Inventory Visibility y normaliza la respuesta.
6. El frontend asocia el resultado al producto y muestra los datos de disponibilidad recibidos.
7. El frontend compara la cantidad solicitada con la disponibilidad aplicable y presenta si esta es suficiente.

### Flujos alternos y excepciones

- **A1 — Falta el SKU:** el frontend debe solicitar un SKU antes de invocar este endpoint. El microservicio rechaza una lista vacía o ausente.
- **A2 — No se resuelve el código postal:** el frontend no puede formar el `centroid`; debe informar que no es posible consultar para esa ubicación. La respuesta para un código postal no reconocido depende del mecanismo de resolución externo al microservicio.
- **A3 — SKU o centro inválido para la consulta:** Inventory Visibility puede devolver un error; nodeAvailability propaga el código de estado recibido cuando está disponible y devuelve `data: []`.
- **A4 — Inventory Visibility no puede autenticarse:** el middleware devuelve HTTP 502 y un mensaje indicando que no fue posible obtener el token.
- **A5 — Error de conexión o respuesta inesperada de Inventory Visibility:** el endpoint devuelve el estado de Inventory Visibility, si existe, o HTTP 500, con `data: []`.
- **A6 — La disponibilidad no alcanza la cantidad solicitada:** el frontend informa que no hay cantidad suficiente. La cantidad solicitada no se envía al endpoint actual.
- **A7 — Más de 10 SKU:** el microservicio devuelve HTTP 400; el frontend debe dividir la búsqueda o limitar la captura a 10 SKU.
- **A8 — Consulta exitosa sin registros:** el frontend debe presentar un estado sin resultados. La forma exacta de indicar “sin inventario” debe basarse en la respuesta recibida, no en asumir que un campo ausente equivale a cero.

## 4. Correspondencia entre pantalla y contrato

| Elemento de la pantalla | Uso en el flujo | Tratamiento en nodeAvailability |
|---|---|---|
| SKU | Identifica el producto a consultar | Se envía como elemento de `skus`; es obligatorio para este endpoint |
| Código postal | Determina la ubicación de consulta | El frontend lo resuelve a `centroid`; el código postal no se envía al microservicio |
| Cantidad | Umbral que el usuario desea satisfacer | Se compara en el frontend; el endpoint no recibe este valor |
| Empresa | Criterio seleccionado en pantalla | No aparece en la petición; no se asume que nodeAvailability la filtre |
| Buscar | Inicia la consulta | Invoca `POST /oms/api/nodeAvailability` |
| Descripción e imagen del producto | Contexto visual del producto | No son devueltas por este endpoint |
| Condición, frecuencia y fecha de entrega | Información adicional de la ficha | No son devueltas por este endpoint |
| Cantidades por categorías de inventario | Detalle de inventario en la sección Información | No son devueltas por este endpoint |
| “Ver detalles” | Navega o expande información adicional | El contrato actual no define una consulta de detalle para esas categorías |

## 5. Contrato de integración actual

### Petición

`POST /oms/api/nodeAvailability`

```json
{
  "centroid": "0002",
  "skus": ["1031250222"]
}
```

Reglas documentadas e implementadas:

- `centroid` es obligatorio y no puede estar vacío.
- `skus` debe ser un arreglo no vacío.
- Se aceptan como máximo 10 SKU por petición.
- La cantidad solicitada, el código postal y la empresa no forman parte del cuerpo de la petición.

### Respuesta exitosa

HTTP `200`

```json
{
  "success": true,
  "code": 200,
  "message": "Disponibilidad de inventario consultada exitosamente",
  "data": [
    {
      "key": 1,
      "centroid": "0002",
      "skuId": "000000001031250222",
      "quantity": "1996",
      "onHandTienda": "1350"
    }
  ]
}
```

Los valores de `quantity` y `onHandTienda` se muestran como cadenas en el ejemplo del contrato. El frontend debe interpretar y comparar los valores de manera segura, contemplando datos ausentes o no numéricos.

### Respuestas de error relevantes

| Situación | HTTP esperado | Tratamiento del frontend |
|---|---:|---|
| `centroid` vacío o ausente | 400 | Corregir los datos de ubicación |
| `skus` vacío, ausente o no es arreglo | 400 | Capturar al menos un SKU |
| Más de 10 SKU | 400 | Limitar o dividir la consulta |
| Inventory Visibility no está disponible o el circuito está abierto | 200 con inventario local | Mostrar la información persistida para el centro y SKU; si no hay registros, la lista viene vacía |
| Error de Inventory Visibility que no es de disponibilidad | Estado de Inventory Visibility o 500 | Mostrar error de consulta |

## 6. Caso de uso UC-02: Consultar estado del servicio

**Actor principal:** Monitor de plataforma  
**Disparador:** Verificación periódica de salud del servicio.  
**Flujo:** El monitor realiza `GET /oms/api/health`; el servicio responde `200 OK` con el estado de la caché de autenticación.  
**Uso desde la pantalla:** No es una acción directa del usuario y no entrega datos de inventario.

## 7. Pantalla “Reporte de Inventario Compras”

Esta pantalla presenta filtros distintos (sección, proveedor, descripción, modelo, estado y condición). No se documenta como una consulta de nodeAvailability porque esos criterios no están en su endpoint actual. Debe asociarse al backend que implementa ese reporte, si corresponde.

## 8. Supuestos y brechas a considerar

1. El frontend resuelve el código postal a `centroid` antes de invocar el microservicio, según lo confirmado para este flujo.
2. La cantidad capturada representa el umbral que el usuario desea satisfacer; la comparación se realiza en frontend porque el endpoint no recibe la cantidad.
3. Aunque la pantalla presenta el texto “a partir de uno o más de estos campos”, este endpoint requiere al menos un SKU y un `centroid`. Una búsqueda únicamente por código postal o empresa no está soportada.
4. La selección de empresa no modifica la consulta de nodeAvailability mientras no exista una regla de mapeo o un parámetro correspondiente en el contrato.
5. La vista completa de producto contiene campos que no devuelve nodeAvailability; deben provenir de otras fuentes para que puedan mostrarse.

## 9. Criterios de aceptación

1. Al consultar un SKU con un código postal resoluble, el frontend envía el `centroid` resuelto y el SKU a `POST /oms/api/nodeAvailability`.
2. El frontend no invoca este endpoint si no tiene SKU o no pudo resolver el centro.
3. Una respuesta exitosa se presenta asociada al SKU y al centro correspondientes.
4. Cuando la disponibilidad aplicable es menor que la cantidad solicitada, el frontend indica que no alcanza; cuando es igual o mayor, indica que sí alcanza.
5. Los errores HTTP 400, 500 y 502 no se presentan como una consulta exitosa ni como disponibilidad cero.
6. El frontend no presenta como datos de nodeAvailability la información de producto o categorías de inventario que no aparecen en su respuesta.
7. El reporte de compras no se enruta a nodeAvailability.
