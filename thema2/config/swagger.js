import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express.js To-Do API',
            version: '1.0.0',
            description: 'REST API διαχείρισης εργασιών (To-Do) με σύστημα αυθεντικοποίησης χρηστών',
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Local server'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'vaggelis' },
                        password: { type: 'string', example: 'mypassword' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Todo: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Αγορές' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                TodoWithItems: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Αγορές' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        toDoItems: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TodoItem' }
                        }
                    }
                },
                TodoItem: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        content: { type: 'string', example: 'Γάλα' },
                        completed: { type: 'boolean', example: false },
                        toDoId: { type: 'integer', example: 1 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
