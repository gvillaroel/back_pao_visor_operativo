# Casos de uso — tratamiento de mensajes de Inventory Visibility

## 1. Propósito y alcance

Describir el comportamiento implementado en `nodeAvailability` para recibir mensajes asociados a **Inventory Visibility (IV)** mediante Google Cloud Pub/Sub, validar su contenido, actualizar el inventario por producto y nodo, registrar auditoría y confirmar los mensajes.


### Actores y componentes

| Participante | Papel en este documento |
|---|---|
| Inventory Visibility | Actor principal y publicador de las actualizaciones de inventario. |
| nodeAvailability | Componente que crea el cliente de Pub/Sub, se suscribe y procesa los mensajes. |
| Pub/Sub | Entrega los mensajes mediante la suscripción configurada. |
| Base de datos | Almacena el inventario y permite localizar productos y nodos existentes. |


## 3. UC-PUB-01 — Iniciar la suscripción

**Actor principal:** Servicio `nodeAvailability`, como suscriptor de las actualizaciones publicadas por Inventory Visibility.  
**Disparador:** Se inicia el servidor del microservicio.  
**Precondiciones:** Existe una suscripción accesible y se ha configurado el entorno.

### Flujo principal

1. El servidor inicia y llama a la inicialización del suscriptor.
2. Se verifica que `GCP_PROJECT_ID` y `PUBSUB_SUBSCRIPTION_IV` estén definidos y no vacíos.
3. Si `GOOGLE_APPLICATION_CREDENTIALS` tiene una ruta no vacía, se comprueba que el archivo exista.
4. Se crea el cliente de Pub/Sub con el identificador de proyecto.
5. Se obtiene la suscripción configurada y se registran los manejadores de mensajes y errores.
6. El servicio marca el suscriptor como activo y registra el inicio en el log.

### Flujos alternos

- **Configuración obligatoria ausente:** se registran errores y no se inicializa el suscriptor. El servidor HTTP ya inició y este flujo no lo detiene.
- **Archivo de credenciales configurado pero inexistente:** se registra el error y no se inicializa el suscriptor.
- **Variable de credenciales ausente o vacía:** se registra una advertencia, pero la inicialización continúa; la biblioteca puede utilizar credenciales predeterminadas del entorno si están disponibles. Esta validación no comprueba que las credenciales funcionen.
- **Ya se está escuchando:** se registra una advertencia y no se agregan de nuevo los manejadores.

## 4. UC-PUB-02 — Procesar una actualización de inventario

**Actor principal:** Inventory Visibility, como publicador.  
**Componente ejecutor:** Suscriptor de `nodeAvailability`.  
**Disparador:** Inventory Visibility publica un mensaje y Pub/Sub lo entrega a la suscripción.  
**Precondiciones:** La suscripción está activa; el contenido tiene la estructura válida indicada en la sección 5.

### Flujo principal

1. El suscriptor toma el ID y la fecha de publicación del mensaje y registra su recepción.
2. Interpreta el contenido como un objeto de mensaje y valida sus líneas y nodos.
3. Inicia una transacción para procesar las disponibilidades.
4. Por cada línea, busca el producto cuyo SKU corresponda a `itemId`.
5. Por cada disponibilidad de la línea, busca el nodo cuyo código corresponda a `shipNode`.
6. Para cada pareja producto-nodo encontrada, inserta el registro o lo actualiza solo si la fecha recibida es más reciente, según la sección 6.
7. Confirma la transacción y registra la cantidad de registros procesados y omitidos.
8. Registra en el log un formato de auditoría con el ID del mensaje y las líneas interpretadas.
9. Invoca `ack()` para confirmar el mensaje.

**Postcondición:** Las parejas producto-nodo procesadas quedan guardadas si la transacción termina correctamente. Una transacción confirmada no implica que todas las líneas se hayan persistido: algunas pueden haberse omitido.

### Flujos alternos y excepciones

| Situación | Comportamiento implementado |
|---|---|
| Contenido vacío, JSON inválido o raíz que no sea un objeto | Se registra un error de interpretación y se intenta confirmar el mensaje con `ack()`. |
| Falta `lines`, está vacío o no es un arreglo | Se registra un error de validación y se intenta confirmar con `ack()`. |
| Una línea carece de `itemId`, `lineId` o del arreglo `shipNodeAvailabilities` | Se rechaza el mensaje completo antes de iniciar la persistencia; se registra el error y se intenta confirmar con `ack()`. |
| Una disponibilidad carece de `shipNode` | Se rechaza el mensaje completo durante la validación; se registra el error y se intenta confirmar con `ack()`. |
| `shipNodeAvailabilities` es un arreglo vacío | Es válido según la implementación; no se guarda ninguna disponibilidad para esa línea. |
| Producto no encontrado | Se registra una advertencia y se omiten las disponibilidades de esa línea; el procesamiento de las demás continúa. |
| Nodo no encontrado | Se registra una advertencia y se omite esa disponibilidad; las demás pueden procesarse. |
| Falta alguna de las cantidades | El campo de cantidad ausente se toma como `0`; la validación no exige esas cantidades ni verifica que sean numéricas. |
| La fecha recibida es igual o anterior a la almacenada | No se modifica el registro; se cuenta como omitido y se registra el motivo. |
| Falla durante la transacción | Se intenta revertir la transacción, se registra el error y se intenta confirmar con `ack()`. |


### Confirmación y recuperación

Para errores dentro del bloque de procesamiento, el código invoca `ack()` en `finally`, tanto si la persistencia fue exitosa como si falló la validación o la base de datos. **La intención del código es confirmar incluso los mensajes fallidos**, por lo que no debe suponerse una reentrega automática para recuperarlos. La llamada a `ack()` tampoco demuestra por sí sola que Pub/Sub haya aceptado la confirmación.

La extracción y conversión de la fecha de publicación ocurren antes de ese bloque: si fallan allí, el `finally` no llega a ejecutarse. El código revisado no muestra una cola de mensajes fallidos ni una estrategia propia de reintento o reprocesamiento.

## 5. Estructura del mensaje

El contenido del mensaje debe representar un objeto JSON; el método de interpretación admite `Buffer`, cadena JSON u objeto.

```json
{
  "lines": [
    {
      "lineId": "1",
      "itemId": "SKU-EJEMPLO",
      "shipNodeAvailabilities": [
        {
          "shipNode": "NODO-01",
          "currentAvailability": {
            "toTs": "2026-11-03T14:00:00.000Z",
            "availableQuantity": 10,
            "shortageQuantity": 2
          }
        }
      ]
    }
  ]
}
```

| Campo | Tratamiento implementado |
|---|---|
| `lines` | Arreglo obligatorio con al menos un elemento. |
| `lineId` | Obligatorio y no vacío; identifica la línea en validación y auditoría. |
| `itemId` | Obligatorio y no vacío; se busca como SKU del producto. |
| `shipNodeAvailabilities` | Arreglo obligatorio; puede estar vacío. |
| `shipNode` | Obligatorio en cada disponibilidad; se busca como código de nodo. |
| `currentAvailability.availableQuantity` | Opcional; si es `undefined`, se usa `0` para persistencia y auditoría. |
| `currentAvailability.shortageQuantity` | Opcional; si es `undefined`, se usa `0` para persistencia y auditoría. |
| `currentAvailability.toTs` | Cadena de fecha válida obligatoria por disponibilidad; se incluye en auditoría y se guarda como `to_ts`. |

## 6. Mapeo a inventario

Para cada producto y nodo encontrados:

| Origen | Campo en `product_inventory` | Valor del ejemplo |
|---|---|---:|
| Producto identificado por `itemId` | `id_product` | ID interno del producto |
| Nodo identificado por `shipNode` | `id_node` | ID interno del nodo |
| `availableQuantity` | `current_quantity` | 10 |
| `shortageQuantity` | `future_quantity` | 2 |
| `availableQuantity` | `estimated_quantity` | 10 |
| `toTs` | `to_ts` | Fecha recibida |

Si no existe el registro, se crea. Si existe, se actualiza únicamente cuando la fecha recibida es posterior a `to_ts` o cuando `to_ts` en BD es `NULL`. Para fechas iguales o anteriores se conserva el registro. La operación es atómica y requiere una restricción única en BD sobre `(id_product, id_node)`, además de la columna `to_ts`. El mapeo de `shortageQuantity` a `future_quantity` refleja el código actual y no implica, por sí mismo, que ambos conceptos sean equivalentes para el negocio.

## 7. UC-PUB-03 — Registrar auditoría y consultar incidencias

**Actor principal:** Operación / soporte.  
**Disparador:** Se necesita verificar el tratamiento de un mensaje o investigar una incidencia.

1. Se consulta el log del servicio por el ID del mensaje.
2. Se revisan la recepción, los errores de validación o persistencia y las advertencias de productos o nodos omitidos.
3. Cuando la persistencia finaliza sin error, se registra el resumen de cantidades procesadas y omitidas.
4. A continuación se registra una representación de auditoría de las líneas recibidas y sus disponibilidades.
5. Se revisa el resultado registrado de la invocación a `ack()`.

**Consideraciones:** La auditoría refleja las líneas del mensaje, incluso las omitidas por producto o nodo inexistente; no constituye por sí sola evidencia de que cada línea se haya guardado. Tampoco se registra una auditoría de contenido cuando el procesamiento falla antes de esa etapa. El mensaje de confirmación en log indica que se llamó a `ack()` sin excepción síncrona, no una confirmación comprobada por el servidor.

## 8. UC-PUB-04 — Cerrar la suscripción

**Actor principal:** Plataforma de ejecución.  
**Disparador:** El proceso recibe `SIGTERM` o `SIGINT`.

1. El servicio solicita el cierre del suscriptor.
2. Si existe una suscripción, retira los manejadores de mensaje y error e intenta cerrarla.
3. Registra el resultado o el error de cierre y marca el suscriptor como no activo.
4. Solicita el cierre del servidor HTTP y finaliza el proceso cuando este cierra.

## 9. Criterios de aceptación del comportamiento actual

Estos criterios describen resultados observables del código; no son una aprobación de las decisiones de negocio:

- **REQ-001:** Ante un mensaje válido con un producto y nodo existentes, se crea o actualiza un registro según las reglas de fecha y el mapeo de la sección 6.
- **REQ-002:** Ante un mensaje sin `lines` válido, se registra el error y no se ejecuta la persistencia de inventario.
- **REQ-003:** Ante un producto o nodo inexistente, se omite la disponibilidad correspondiente y se registra una advertencia; las demás disponibilidades válidas pueden persistirse.
- **REQ-004:** Si una operación falla dentro de la transacción, se intenta revertir y se registra el error.
- **REQ-005:** Después del procesamiento dentro del bloque protegido, se invoca `ack()` tanto en éxito como en error.
- **REQ-006:** Con un arreglo `shipNodeAvailabilities` vacío, la línea pasa la validación y no genera registros de inventario.
- **REQ-007:** Sin proyecto o suscripción configurados, el suscriptor no se inicializa y se registra el error.

## 10. Pendientes de confirmación

1. ¿Se acepta confirmar mensajes que fallaron o que contienen productos y nodos omitidos, o se requiere una política de recuperación?
2. ¿Es correcta para el negocio la correspondencia de `shortageQuantity` con `future_quantity` y de `availableQuantity` con `estimated_quantity`?
3. ¿Existen requisitos de orden, deduplicación o tratamiento de eventos antiguos? El código revisado no verifica explícitamente esas condiciones.

## 11. Referencias de implementación

- Inicio y cierre: [index.js](./index.js).
- Suscripción, procesamiento y confirmación: [PubSubSubscriberService.js](./services/PubSubSubscriberService.js).
- Interpretación, validación y formato de auditoría: [IVAvailabilityMessage.js](./models/IVAvailabilityMessage.js).
- Transacción y mapeo: [ProductInventoryService.js](./services/ProductInventoryService.js).
- Inserción y actualización: [ProductInventoryRepository.js](./repositories/ProductInventoryRepository.js).
