# ✅ CHECKLIST DE REQUISITOS - Examen Final DW

## Proyecto: Plataforma de Control de Pedidos Multiplataforma (Next.js + Spring Boot + Maven + MariaDB + PostgreSQL)

---

## 📋 ESTADO ACTUAL vs. REQUISITOS

### ✅ YA COMPLETADO

#### Componente A (Spring Boot + MariaDB)
- [x] Proyecto Maven con Spring Boot 3.5.7, Java 17
- [x] Entidades: Cliente, Pedido (con relación OneToMany)
- [x] Persistencia con JPA y MariaDB
- [x] Endpoints REST implementados:
  - [x] POST `/api/clientes` - Crear cliente
  - [x] GET `/api/clientes` - Listar clientes
  - [x] GET `/api/clientes/{id}` - Obtener cliente
  - [x] POST `/api/pedidos` - Crear pedido
  - [x] GET `/api/pedidos` - Listar pedidos
  - [x] GET `/api/pedidos/{id}` - Obtener pedido
  - [x] DELETE endpoints (no requeridos pero presentes)
- [x] Importa dependencia común (`componente-c`)
- [x] Usa métodos de `MetodosCompartidos` (generarCodigoUnico en POST pedidos)
- [x] OpenAPI 3 spec (`openapiA.yaml`) - RECIENTEMENTE MEJORADO

#### Componente B (Spring Boot + PostgreSQL)
- [x] Proyecto Maven con Spring Boot 3.5.7, Java 17
- [x] Entidades: Proveedor, Factura (con relación ManyToOne)
- [x] Persistencia con JPA y PostgreSQL
- [x] Endpoints REST implementados:
  - [x] POST `/api/proveedores` - Crear proveedor
  - [x] GET `/api/proveedores` - Listar proveedores
  - [x] POST `/api/facturas` - Crear factura
  - [x] GET `/api/facturas` - Listar facturas
  - [x] GET `/api/facturas/{id}` - Obtener factura
  - [x] DELETE endpoints (no requeridos)
- [x] Importa dependencia común (`componente-c`)
- [x] OpenAPI 3 spec (`openapiB.yaml`) - RECIENTEMENTE MEJORADO

#### Componente C (Librería Maven compartida)
- [x] Proyecto Java Maven (sin Spring)
- [x] Clase `MetodosCompartidos` con métodos reutilizables:
  - [x] `generarCodigoUnico(String tipoEntidad)` - Implementado
  - [x] `calcularTotal(List<Double> precios)` - Implementado
  - [x] `notificarRegistro(String urlEndpoint)` - Implementado (flujo circular)
- [x] Empaquetado como JAR y usado como dependencia en A y B
- [x] Parent Spring Boot alineado a 3.5.7 (RECIENTEMENTE ACTUALIZADO)

#### Infraestructura y configuración
- [x] `application.properties` configurados:
  - [x] Componente A: puerto 8080, MariaDB
  - [x] Componente B: puerto 8081, PostgreSQL
  - [x] Componente C: puerto 8082
- [x] Builds Maven compilados exitosamente (BUILD SUCCESS en todos)
- [x] Repositorio Git con commits iniciales

#### Dashboard (Next.js)
- [x] Proyecto Next.js básico creado
- [x] Estructura inicial con layout.tsx y page.tsx
- [x] Tailwind CSS y ESLint configurados

---

### ❌ FALTA POR IMPLEMENTAR / COMPLETAR

#### 1. **INTEGRACIÓN SPRINGDOC-OPENAPI (Swagger UI)**
   - [ ] Dependencia `springdoc-openapi-starter-webmvc-ui` agregada a Componente A
   - [ ] Dependencia `springdoc-openapi-starter-webmvc-ui` agregada a Componente B
   - [ ] Configuración en `application.properties` para habilitar endpoints de documentación
   - [ ] Verificar que `/swagger-ui.html` esté disponible en ejecución
   - [ ] Revisar que la generación automática capture los endpoints

**Prioridad:** ALTA  
**Razón:** Sin esto, la documentación OpenAPI no está expuesta en vivo. Es requisito obligatorio.  
**Commits requeridos:** 2
- `feat(componente-a): agregar springdoc-openapi para documentación Swagger`
- `feat(componente-b): agregar springdoc-openapi para documentación Swagger`

---

#### 2. **COMPLETAR LÓGICA DE CÁLCULO Y DESCUENTOS**
   - [ ] Entidad `Producto` en Componente A (debe estar en Pedido como lista embebida o relación)
   - [ ] Método en `MetodosCompartidos`: `calcularTotalConIVA(double subtotal, double iva)` ← **FALTA**
   - [ ] Método en `MetodosCompartidos`: `aplicarDescuento(double total, double porcentajeDescuento)` ← **FALTA**
   - [ ] Controlador Pedido debe usar estos métodos al registrar un pedido
   - [ ] Controlador Factura debe usar estos métodos al registrar una factura

**Prioridad:** ALTA  
**Razón:** Las instrucciones mencionan "cálculos" y "descuentos" en la lógica compartida explícitamente.  
**Commits requeridos:** 2
- `feat(componente-c): agregar métodos calcularTotalConIVA y aplicarDescuento`
- `feat(componente-a,b): integrar cálculo con IVA y descuentos en pedidos/facturas`

---

#### 3. **MEJORAR INTEGRACIÓN CIRCULAR ENTRE A Y B**
   - [ ] El método `notificarRegistro()` en `componente-c` usa conexión simple (muy frágil)
   - [ ] Cambiar a `WebClient` de Spring (async, resiliente con timeout)
   - [ ] Hacer que sea realmente circular: cuando se crea factura en B, consulte pedidos de A
   - [ ] Cuando se crea pedido en A, notifique a B

**Prioridad:** MEDIA-ALTA  
**Razón:** Instrucción expresa: "Uno de los métodos del componente C debe invocar a un endpoint del Componente A o B, completando un flujo circular de integración."  
**Commits requeridos:** 1
- `refactor(componente-c): mejorar integración circular con WebClient y lógica resiliente`

---

#### 4. **COMPLETAR ENTIDADES Y ESQUEMAS (ALINEACIÓN)**
   
**Componente A:**
   - [ ] Validar que `Cliente` coincida con schema OpenAPI (id, nombre, correo) ✓ OK
   - [ ] Crear DTO `PedidoInput` o validar que Pedido acepta lista de productos en JSON
   - [ ] Verificar que en `Pedido` esté el campo `productos` (list de Producto) ← **POSIBLE FALTA**
   - [ ] Crear entidad embebida o relación para `Producto` si no existe

**Componente B:**
   - [ ] Validar que `Proveedor` tenga campo `correo` (actualmente tiene `contacto`) ← **DISCREPANCIA**
   - [ ] Renombrar `contacto` a `correo` en Proveedor O actualizar OpenAPI
   - [ ] Validar que `Factura` tenga campo `totalFactura` (actualmente tiene `total`) ← **DISCREPANCIA**
   - [ ] Crear DTO o relación para `PedidoReferencia` en Factura

**Prioridad:** ALTA  
**Razón:** Las entidades deben coincidir exactamente con OpenAPI para que la integración sea correcta.  
**Commits requeridos:** 2
- `fix(componente-a): ajustar modelo Pedido para incluir lista de productos`
- `fix(componente-b): alinear campos Proveedor (correo) y Factura (totalFactura) con OpenAPI`

---

#### 5. **TESTS UNITARIOS**
   - [ ] Tests para `MetodosCompartidos` en Componente C (JUnit + Mockito)
     - [ ] Test para `generarCodigoUnico()`
     - [ ] Test para `calcularTotal()`
     - [ ] Test para `calcularTotalConIVA()`
     - [ ] Test para `aplicarDescuento()`
   - [ ] Tests para controladores Componente A (opcional pero recomendado)
   - [ ] Tests para controladores Componente B (opcional pero recomendado)

**Prioridad:** MEDIA  
**Razón:** Buena práctica; demuestra calidad de código.  
**Commits requeridos:** 1
- `test(componente-c): agregar tests unitarios para MetodosCompartidos`

---

#### 6. **DASHBOARD NEXT.JS - IMPLEMENTACIÓN FUNCIONAL**
   - [ ] Conectar a las APIs de Componente A y B desde Next.js
   - [ ] Crear página para listar clientes (GET `/api/clientes` de A)
   - [ ] Crear página para crear cliente (POST `/api/clientes` de A)
   - [ ] Crear página para listar pedidos (GET `/api/pedidos` de A)
   - [ ] Crear página para crear pedido (POST `/api/pedidos` de A)
   - [ ] Crear página para listar proveedores (GET `/api/proveedores` de B)
   - [ ] Crear página para crear proveedor (POST `/api/proveedores` de B)
   - [ ] Crear página para listar facturas (GET `/api/facturas` de B)
   - [ ] Crear página para crear factura (POST `/api/facturas` de B)
   - [ ] Configurar CORS en Componente A y B para permitir peticiones desde dashboard (puerto 3000)
   - [ ] Agregar variables de entorno para URLs de APIs

**Prioridad:** ALTA  
**Razón:** "Dashboard en Next.js será el panel administrativo que muestre información combinada proveniente de ambos servicios."  
**Commits requeridos:** 5+
- `feat(dashboard): crear layout base y navegación`
- `feat(dashboard): agregar páginas para gestión de clientes y pedidos`
- `feat(dashboard): agregar páginas para gestión de proveedores y facturas`
- `feat(dashboard): integrar llamadas a APIs de Componente A y B`
- `feat(dashboard): configurar CORS en componentes A y B`

---

#### 7. **DOCUMENTACIÓN Y README**
   - [ ] `README.md` en raíz con:
     - [ ] Descripción general del proyecto
     - [ ] Arquitectura del sistema (similar a las imágenes adjuntas)
     - [ ] Requisitos previos (Java 17, Maven, Node.js, bases de datos)
     - [ ] Instrucciones de instalación paso a paso
     - [ ] Instrucciones para levantar cada componente (backend en 8080, 8081; frontend 3000)
     - [ ] Instrucciones para acceder a Swagger UI
     - [ ] Notas sobre configuración de bases de datos (MariaDB y PostgreSQL)
     - [ ] Información sobre la integración circular
   - [ ] `README.md` en `componente-c` explicando cómo usarlo
   - [ ] Comentarios en clases principales explicando propósito

**Prioridad:** MEDIA  
**Razón:** Requisito de documentación explícito.  
**Commits requeridos:** 1
- `docs(root): agregar README con instrucciones completas`

---

#### 8. **CONFIGURACIÓN DE BASES DE DATOS**
   - [ ] Verificar scripts de creación de BD (MariaDB y PostgreSQL)
   - [ ] Documentar credenciales y conexiones
   - [ ] Validar que `spring.jpa.hibernate.ddl-auto=update` genera tablas automáticamente
   - [ ] Opcionalmente crear scripts SQL de inicialización (`data.sql`)

**Prioridad:** MEDIA  
**Razón:** Necesario para que cualquiera pueda ejecutar el proyecto.  
**Commits requeridos:** 1
- `docs(db): agregar scripts SQL para inicializar bases de datos`

---

#### 9. **CONFIGURAR CORS (CORS-Allow)**
   - [ ] En Componente A: agregar `@CrossOrigin` o configurar `WebMvcConfigurer`
   - [ ] En Componente B: agregar `@CrossOrigin` o configurar `WebMvcConfigurer`
   - [ ] Permitir origen `http://localhost:3000` (Dashboard)

**Prioridad:** ALTA  
**Razón:** El Dashboard no podrá comunicarse con las APIs sin CORS configurado.  
**Commits requeridos:** 1
- `feat(componente-a,b): configurar CORS para Next.js dashboard`

---

#### 10. **GENERAR POM AGREGADOR (OPCIONAL PERO RECOMENDADO)**
   - [ ] Crear `pom.xml` en raíz como multi-module
   - [ ] Declarar los tres módulos: componente-a, componente-b, componente-c
   - [ ] Permitir builds centralizados: `mvn -f pom.xml clean install`

**Prioridad:** BAJA  
**Razón:** Mejora la experiencia de desarrollo (opcional).  
**Commits requeridos:** 1
- `chore(root): agregar POM multi-module para builds centralizados`

---

#### 11. **VALIDACIONES Y MANEJO DE ERRORES**
   - [ ] Agregar validaciones en DTOs (javax.validation annotations)
   - [ ] Implementar `@ExceptionHandler` para manejar errores consistentemente
   - [ ] Retornar códigos HTTP correctos (201 CREATE, 400 BAD_REQUEST, 404 NOT_FOUND, 500 INTERNAL_SERVER_ERROR)

**Prioridad:** MEDIA  
**Razón:** Mejora robustez y coincide con especificaciones OpenAPI.  
**Commits requeridos:** 1
- `refactor(componente-a,b): agregar validaciones y manejo de errores global`

---

## 📊 RESUMEN CUANTITATIVO

### Completado:
- ✅ Componente A: 90%
- ✅ Componente B: 85%
- ✅ Componente C: 70%
- ✅ Dashboard: 5%

### Pendiente:
- **CRÍTICO:** 6 tareas (Swagger, cálculos avanzados, integración circular mejorada, alineación entidades, CORS, Dashboard)
- **IMPORTANTE:** 3 tareas (Tests, documentación, validaciones)
- **OPCIONAL:** 1 tarea (POM agregador)

---

## 🚀 ORDEN RECOMENDADO DE IMPLEMENTACIÓN

1. **Alinear entidades con OpenAPI** (30 min) → 2 commits
2. **Agregar springdoc-openapi** (20 min) → 2 commits
3. **Agregar métodos de cálculo avanzados a Componente C** (30 min) → 1 commit
4. **Mejorar integración circular** (30 min) → 1 commit
5. **Configurar CORS** (10 min) → 1 commit
6. **Agregar tests a Componente C** (30 min) → 1 commit
7. **Implementar Dashboard (Next.js)** (2-3 horas) → 5+ commits
8. **Documentación (README)** (30 min) → 1 commit
9. **Agregar validaciones** (30 min) → 1 commit
10. **POM agregador (OPCIONAL)** (15 min) → 1 commit

---

## 📝 TOTAL DE COMMITS NUEVOS NECESARIOS: ~20 commits

---

## ⚠️ OBSERVACIONES IMPORTANTES

1. **Discrepancia en campos Componente B:**
   - OpenAPI dice `correo` pero entidad tiene `contacto`
   - OpenAPI dice `totalFactura` pero entidad tiene `total`
   - Decide: ¿actualizar entidad o actualizar OpenAPI?

2. **Estructura de Producto:**
   - OpenAPI muestra Producto como objeto con `nombre` y `precio`
   - No veo entidad `Producto` en el código actual
   - ¿Debería ser embebida en Pedido o una relación separada?

3. **Dashboard sin integración:**
   - El dashboard actual es un template vacío
   - Necesita ser rediseñado para consumir ambas APIs

4. **Sin logs ni monitoreo:**
   - Agregar Log4J (mencionado en instrucciones) para logging
   - Considerar agregar endpoints de salud (`/actuator/health`)

---

## 💡 SIGUIENTE PASO

Indica qué tarea quieres que comience primero. Yo recomiendo empezar por:
1. Alinear entidades (para tener claridad en qué consumir)
2. Agregar Swagger (para poder probar visualmente)
3. Dashboard (la tarea más larga)

¿Comenzamos?
