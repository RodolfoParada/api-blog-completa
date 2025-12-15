// Task 1: Arquitectura del Proyecto de Blog (5 minutos)
// Estructura completa de una API de blog con posts y comentarios.

// Estructura del Proyecto
// api-blog/
// ├── src/
// │   ├── controllers/
// │   │   ├── postsController.js
// │   │   └── commentsController.js
// │   ├── models/
// │   │   ├── post.js
// │   │   └── comment.js
// │   ├── middleware/
// │   │   ├── auth.js
// │   │   ├── validation.js
// │   │   └── cors.js
// │   ├── routes/
// │   │   ├── posts.js
// │   │   └── comments.js
// │   ├── config/
// │   │   └── database.js
// │   └── utils/
// │       └── helpers.js
// ├── tests/
// ├── docs/
// ├── package.json
// ├── server.js
// └── README.md
// Modelos de Datos
// Post model
const Post = {
  id: 'uuid',
  titulo: 'string (required)',
  contenido: 'string (required)',
  autor: 'string (required)',
  etiquetas: 'array',
  estado: 'enum: borrador, publicado, archivado',
  fechaCreacion: 'datetime',
  fechaActualizacion: 'datetime',
  visitas: 'number'
};

// Comment model
const Comment = {
  id: 'uuid',
  postId: 'uuid (foreign key)',
  autor: 'string (required)',
  contenido: 'string (required)',
  email: 'string (optional)',
  estado: 'enum: pendiente, aprobado, rechazado',
  fechaCreacion: 'datetime'
};
// Funcionalidades a Implementar
// ✅ Autenticación JWT para operaciones de escritura
// ✅ CRUD completo para posts y comentarios
// ✅ Validación de datos con express-validator
// ✅ Manejo de errores estructurado
// ✅ Paginación y filtros para listados
// ✅ Búsqueda y ordenamiento
// ✅ Rate limiting para protección
// ✅ Documentación OpenAPI
// ✅ Tests básicos con herramientas externas