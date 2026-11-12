# Microservicio Node Availability (`nodeAvailability`)

Microservicio encargado de interactuar con el servicio de inventario OMS de Liverpool para consultar la disponibilidad de stock por centro (`centroid`) y conjunto de SKUs (máximo 10). Mantiene en memoria la caché del token y el estado del circuit breaker.

## Características

- **Autenticación OAuth2**: Obtiene token `Bearer` mediante `client_credentials` contra el endpoint configurado:
  `POST <OMS_AUTH_URL>/inventory/<tenantId>/v1/oauth2/token`
- **Caché en memoria del token**: Almacena el token en memoria evitando llamadas redundantes al servicio de autenticación. Utiliza la variable configurable `OMS_TOKEN_CACHE_EXPIRES_IN_SEC` (o el `expires_in` de la respuesta, ej. 43200s) y un timestamp de expiración con margen de renovación previa de 60 segundos.
- **Autenticación para consulta de disponibilidad**: Obtiene el token vigente dentro del flujo protegido por el circuit breaker, de modo que no se intenta autenticar cuando el circuito está abierto.
- **Consulta OData a OMS**: Construye la URL estructurada para los parámetros `(P_CENTROID='{centroid}',SKU01='...',...,SKU10='...')`.
- **Formato camelCase**: Retorna un array de objetos con las propiedades: `key`, `centroid`, `skuId`, `quantity`, `onHandTienda`.
- **Validación de SKUs**: Acepta un arreglo de hasta 10 SKUs por petición.
- **Circuit breaker de OMS**: Protege en un único circuito la obtención del token y la consulta de inventario. Ante una falla de disponibilidad, abre el circuito y consulta como fallback la información persistida en `product_inventory`, asociada por `inventory_node.node_code` (igual al `centroid`) y `products.sku`. El fallback devuelve `current_quantity` tanto en `quantity` como en `onHandTienda`, junto con la fecha almacenada en `to_ts`. Los errores HTTP 4xx no relacionados con disponibilidad no activan el fallback; 408 y 429 sí.

El circuit breaker opera en memoria por proceso. Si hay varias réplicas, cada una mantiene su propio estado. Cuando Inventory Visibility falla o el circuito ya está abierto, la consulta usa el inventario disponible en BD y responde con el contrato exitoso HTTP 200. Al vencer el periodo configurado, se permite una solicitud de prueba a Inventory Visibility. Si no existen registros locales para el centro y los SKU solicitados, el fallback devuelve un arreglo vacío.

## Variables de Entorno (`config/config.env`)

| Variable | Descripción | Ejemplo / Valor por defecto |
|---|---|---|
| `DESC_ENV` | Entorno de ejecución (`DEV`, `QA`, `PROD`) | `DEV` |
| `PORT` | Puerto de escucha del microservicio | `4015` |
| `TIME_ZONE` | Zona horaria | `America/Mexico_City` |
| `OMS_INVENTORY_URL` | Endpoint base de inventario OMS | `http://api-omsweb-visor-qa.liverpool.com.mx/oms/api/inventario/pos/skus` |
| `OMS_AUTH_URL` | URL base para autenticación OAuth2 | `http://api-omsweb-visor-qa.liverpool.com.mx` |
| `OMS_AUTH_PATH` | Ruta de autenticación con placeholder `{tenantId}` | `/inventory/{tenantId}/v1/oauth2/token` |
| `OMS_TENANT_ID` | Identificador de tenant | `0002` |
| `OMS_CLIENT_ID` | Client ID de la aplicación | `cliente_oms_id` |
| `OMS_CLIENT_SECRET` | Client Secret de la aplicación | `cliente_oms_secret` |
| `OMS_TOKEN_CACHE_EXPIRES_IN_SEC` | Expiración de caché en memoria en segundos (ej. 43200 o 86400) | `43200` |
| `OMS_CIRCUIT_BREAKER_TIMEOUT_MS` | Tiempo máximo para autenticación más consulta de inventario | `45000` |
| `OMS_CIRCUIT_BREAKER_RESET_TIMEOUT_MS` | Tiempo que permanece abierto antes de permitir una solicitud de prueba | `30000` |
| `REJECT_UNAUTHORIZED_SSL` | Validación estricta de certificados SSL | `false` |
| `KAFKA_BROKERS` | Lista de brokers Kafka separados por coma; si se omite, Kafka no inicia | `localhost:9092` |
| `KAFKA_TOPIC_IV` | Topic Kafka que contiene actualizaciones de inventario | `iv-inventory-updates` |
| `KAFKA_GROUP_ID` | Grupo del consumidor Kafka | `node-availability-inventory` |
| `KAFKA_CLIENT_ID` | Identificador opcional del cliente Kafka | `node-availability` |

Kafka es opcional y, cuando se configura, se inicia junto con Pub/Sub. Los mensajes de ambos orígenes se procesan con las mismas reglas de validación y persistencia. Si el mismo evento se publica en ambos sistemas, puede procesarse dos veces. Al igual que en Pub/Sub, un fallo de procesamiento se registra y el mensaje se confirma; no se solicita su reentrega.

## Endpoint del Microservicio

### `POST /oms/api/nodeAvailability`

#### Request Body
```json
{
  "centroid": "0002",
  "skus": [
    "1031250222",
    "3288846"
  ]
}
```

#### Response Exitosa (200 OK)
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
    },
    {
      "key": 1,
      "centroid": "0002",
      "skuId": "000000000003288846",
      "quantity": "729",
      "onHandTienda": "297"
    }
  ]
}
```

### `GET /oms/api/health`
Verifica el estado del servicio y el estado de la caché del token de autenticación.

### `POST /oms/api/nodeAvailability/inventory-updates`
Procesa una actualización de inventario con la misma estructura y reglas que el flujo de Pub/Sub.

#### Request Body
```json
{
  "lines": [
    {
      "lineId": "1",
      "itemId": "Liv_SL_Item001",
      "shipNodeAvailabilities": [
        {
          "shipNode": "28",
          "currentAvailability": {
            "toTs": "2026-11-13T13:58:27.567Z",
            "availableQuantity": 2000.0,
            "shortageQuantity": 0.0
          }
        }
      ]
    }
  ]
}
```

#### Response Exitosa (200 OK)
```json
{
  "success": true,
  "code": 200,
  "message": "Actualización de inventario procesada exitosamente",
  "data": {
    "linesReceived": 1,
    "processedCount": 1,
    "skippedCount": 0
  }
}
```
