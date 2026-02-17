import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import sequelize from './config/database.js'
import todoRouter from './routes/todo.js'
import authRouter from './routes/auth.js'
import todoItemRouter from './routes/todoItem.js'

const PORT = 8000
const app = express()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/todos/:id/items', todoItemRouter)

app.use('/', authRouter)

app.use('/todos', todoRouter)

async function start() {
    try {
        await sequelize.authenticate()
        console.log('Database connected!')

        await sequelize.sync()

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    } catch (error) {
        console.error('Failed to start:', error)
    }
}

start()