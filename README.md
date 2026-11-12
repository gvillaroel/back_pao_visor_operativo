
# PAO

Aplicación integrada con OMS para realizar distintas operaciones en la tienda como consulta de inventarios, consulta de ordenes, editar dirección y fechas de entrega de ordenes, etc.


## Acknowledgements
 - [npm](https://docs.npmjs.com/)
 - [Node JS](https://nodejs.org/es/docs/)
 - [Express](https://expressjs.com/en/starter/installing.html)
 - [Sequelize](https://sequelize.org/)
 - [Postgresql](https://www.postgresql.org/docs/current/)
 - [Docker](https://www.docker.com/

## Authors

- [@rapinona](https://github.com/rapinona)
- [@mjbeltranu](https://github.com/mjbeltranu)
- [@rpadillad](https://github.com/rpadillad)
- [@ghidalgoo](https://github.com/ghidalgoo)

# Política

## Uso de Ramas

| Rama            | Uso                         |
| :---------------: | --------------------------- |
| feature         | Para realizar el desarrollo de una funcionalidad en específico. |
| dev             | Integración de nuevas funcionalidades desarrolladas. |
| qas             | Ejecución de planes de prueba y de calidad. Requiere Pull Request con aprobación. |
| hotfix          | Derivado de incidentes productivos y requiere corregir de forma inmediata. Se realiza Pull Request a main/master directamente. |
| main            | Se utiliza para los cambios productivos. Es indispensable realizar las aprobaciones correspondientes del **Operador**. Requiere Pull Request con aprobación |
| main (merge)    | Para el e-comerce en Liverpool, se realizará el pase a la rama de master / main a través de `MERGE` cuando se publique a **sitio cerrado.**  |
| main (tag)      | Para el e-comerce en Liverpool, se realizará el pase a la rama de master / main a través de `TAG` cuando se publique a **sitio abierto.** | 

## Nomenclatura de Ramas

La estructura de la nomenclatura de las ramas debe ser la siguiente:
```
[dev|qas|hotfix|main/master]  
|__ R##S##  
|__________ /feature/R##S##_IDSTORY 
```

**Donde:**

- `R##`: Número de release
- `S##`: Número de sprint
- `IDSTORY`: ID de historia en Jira o Proyecto

**NOTA:** En caso de ser `ID de Proyecto`, considerar que coincida con la cantidad de caracteres usados por Jira (6 caracteres)

### Ejemplo: 

```
dev  
|__ /R0704  
|_________ /feature/R0704_AAJ-179
```

## API Reference

#### INT 2004 - Modificación de Orden

```http
  POST https://api-qa-visor.liverpool.com.mx/oms/v1/int/2004
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### INT2010 - Consulta de Orden

```http
  POST https://api-qa-visor.liverpool.com.mx/oms/v1/int/2010
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string` | **Required**. Your API key |

#### INTG001 - Get Backorder Demand

```http
  GET https://api-qa-visor.liverpool.com.mx/oms/v1/int/G001/$PARAM1/$PARAM2
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string` | **Required**. Your API key |
| `PARAM1`      | `string` | **Required**. Ubicación o centro |
| `PARAM2`      | `string` | **Required**. sku |


#### INTG002 - Inventario

```http
  POST https://qatapigee.liverpool.com.mx/oms/v1/int/G002
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string` | **Required**. Your API key |
| `content_type`      | `string` | **Required**. Your content type |

#### INT3010 - GET NODE CAPIcity FOR ORDER

```http
  POST https://api-qa-visor.liverpool.com.mx/oms/v1/int/3010
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string` | **Required**. Your API key |

#### QA- BT - Fecha estimada de entrega

```http
  POST https://fechaestimadaqa2.liverpool.com.mx:4007/api/V4/SBB
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string` | **Required**. Your API key |

#### Consulta EMA

```http
  POST http://brokerqa.liverpool.com.mx:7082/wbi/DEM
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `cp`      | `string` | **Required**. body: cp |


#### Descripción sku

```http
  POST https://searchreplacement-qa2.liverpool.com.mx/sf/api/v1/getMultiProduct
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `product_id`      | `string` | **Required**. ID del producto |


## Installation

Instala todas las dependencias con este comando:

```bash
  npm install
```

Los paquetes principales a utilizar en el proyecto, son:

- activedirectory2: ActiveDirectory es un cliente ldapjs para authN (autenticación) y authZ (autorización) para Microsoft Active Directory con soporte de recuperación de rango para grandes instalaciones de Active Directory.
- axios: axios es una librería de JavaScript que se utiliza para realizar solicitudes HTTP desde una aplicación web o una aplicación basada en Node.js.
- body-parser: "body-parser" es un middleware de Node.js que se utiliza para analizar los datos enviados en el cuerpo de una solicitud HTTP.
- cors: "cors" es una biblioteca que permite a los desarrolladores configurar y habilitar el intercambio de recursos de origen cruzado (CORS) en sus aplicaciones web.
- express: "Express" es un framework de aplicaciones web de Node.js que se utiliza para crear aplicaciones web y APIs de manera eficiente y sencilla.
- jsonwebtoken: "jsonwebtoken" es una biblioteca de código abierto que se utiliza para trabajar con tokens JSON Web (JWT). JWT es un estándar abierto para la creación de tokens de autenticación seguros y compactos que pueden ser verificados y confiables entre diferentes servicios y aplicaciones.
- path: El módulo de JavaScript "path" proporciona una forma de trabajar con rutas de archivo y directorio en un sistema de archivos. Permite manipular y acceder a información sobre rutas de archivo, como nombres de archivo, extensiones, directorios padre, etc.
- sequelize: Sequelize es un módulo de JavaScript que se utiliza como un ORM (Object-Relational Mapping) para interactuar con bases de datos relacionales desde aplicaciones Node.js. 

Los paquetes secundarios o complementarios son:
- cookie-parser
- csv-parse
- csvtojson
- dotenv
- express-validator
- haversine
- https
- moment
- morgan
- multer
- pg
- pg-hstore
- xml2js


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DESC_ENV`
`PORT`
`DB_HOST`
`DB_USER`
`DB_PASS`
`DB_NAME`

`JWT_SECRET`
`JWT_EXPIRE`
`JWT_COOKIE_EXPIRE`
`SUPPLIER`
`PCORTO`

`URL2004`
`URL2010`
`URL3010`
`URLCOLONIAS`
`URLG002`
`URLPCORTO`
`URLFECHAESTIMADA`
`APIGEE`
`URL_MULTI_PRODUCT`
`FECHAST`
`URL_DEV`
`URLBACKORDER`
`URL_BACKORDER_KEY`
`URL_PEDIDOS_SUB`
`URL_PEDIDOS_LIV`
`URL_LDAP`

`USERNAME_LDAP`
`PASSWORD_LDAP`
`DOMAIN_AD`


##RUN

To run this proyect execute

```bash
  npm run dev
```

as defined in "scripts" section of package.json file

## Linting
Es un proceso para tareas de "limpiar" y seguir guías de estilo para código javascript tanto en el servidor (node.js) como en el navegador.

El uso del proceso de linting debe de ser obligatorio antes de subir un commit al repositorio.

Para el uso de linting se usan las siguientas herramientas:
- ESLint

### Instalar ESLint
```bash
npm install eslint --save-dev
```
### Configurar ESLint

Ejecutar el siguiente comando para inicializar valores de configuración:

```bash
npx eslint --init
```

Responder las siguientes preguntas:

```bash
? How would you like to use ESLint? …
  To check syntax only
  To check syntax and find problems
❯ To check syntax, find problems, and enforce code style
```

```bash
What type of modules does your project use? …
  JavaScript modules (import/export)
❯ CommonJS (require/exports)
  None of these
```

```bash
? Which framework does your project use? …
❯ React
  Vue.js
  None of these
```

```bash
? Does your project use TypeScript? › No / Yes

✔ How would you like to define a style for your project? …
❯ Use a popular style guide
  Answer questions about your style
  Inspect your JavaScript file(s)
```

```bash
- Elegir el formato JSON para el archivo de configuración
```

```bash
? Would you like to install them now with npm? No / ›Yes
```

### Usar ESLint
Para ejecutar ESLint en la terminal

```bash
npm run eslint
```
Para ejecutar ESLint en la terminal y aplicar automaticamente las sugerencias de estilo

```bash
npm run eslint-fix
```

Para ejecutar EsLint y que descargue todos los errores y sugerencias en un archivo

```bash
npm run eslint-report
```

## Deployment

To deploy this project run

Local Env:
```bash
    docker build -t oms-visor-backend .
    docker run -dp 4001:4001 oms-visor-backend
```

QA Env:
```bash
    docker build -t gcr.io/crp-qas-sis-omsweb/oms-visor-backend .

    docker push gcr.io/crp-qas-sis-omsweb/oms-visor-backend
```

Prod Env:
```bash
    docker build -t gcr.io/crp-qas-sis-omsweb/oms-visor-backend-prod .

    docker push gcr.io/crp-qas-sis-omsweb/oms-visor-backend-prod
```
Note: To deploy in a production environment, we need to upload the image to the "oms-visor-backend-prod" folder in the Container Registry for our QA project.


## Support

En caso de necesitar soporte puede contactarse a los siguientes correos:

- rapinona@liverpool.com.mx
- mjbeltranu@liverpool.com.mx
- ghidalgoo@liverpool.com.mx

