import { Router } from "express"
import { toDo, toDoItem } from "../models/index.js"

export const todoRouter = Router()

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Επιστρέφει όλα τα todos μαζί με τα items τους
 *     tags: [Todos]
 *     responses:
 *       201:
 *         description: Λίστα με όλα τα todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TodoWithItems'
 *       500:
 *         description: Κάτι πήγε στραβά
 */
todoRouter.get('/', async (req, res) => {
    try {

        const allToDos = await toDo.findAll({ include: toDoItem })
        console.log(`returned all todos and todoItems`)
        res.status(201).json(allToDos)

    } catch (error) {

        console.log(error)
        res.status(500).json({
            error: 'something went wrong'
        })

    }
})

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Δημιουργία νέου todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Αγορές
 *     responses:
 *       201:
 *         description: Το todo δημιουργήθηκε
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Το todo υπάρχει ήδη
 *       500:
 *         description: Κάτι πήγε στραβά
 */
todoRouter.post('/', async (req, res) => {
    try {
        const item = await toDo.create({
            title: req.body.content
        })
        console.log(`added todo with title ${req.body.content}`)
        res.status(201).json(item)
    } catch (error) {
        console.log(error)
        if (error.name === "SequelizeTimeoutError") {
            res.status(400).json({
                error: `todo with title ${req.body.content} already exists`
            })
        } else {
            res.status(500).json({
                error: 'something went wrong'
            })
        }

    }
})

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Επιστρέφει ένα todo βάσει ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID του todo
 *     responses:
 *       201:
 *         description: Το todo βρέθηκε
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Το todo δεν βρέθηκε
 */
todoRouter.get('/:id', async (req,res) => {
    
    const todo = await toDo.findByPk(req.params.id)

    if(!todo) {
        console.log(`todo with an id of ${req.params.id} was not found`)
        return res.status(404).json({ error: 'Todo not found' })
    }
    
    res.status(201).json(todo)
})

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Ενημέρωση τίτλου ενός todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID του todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Νέος τίτλος
 *     responses:
 *       200:
 *         description: Το todo ενημερώθηκε
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Το todo δεν βρέθηκε
 */
todoRouter.put('/:id', async (req, res) => {
    const todo = await toDo.findByPk(req.params.id)

    if (!todo) {
        console.log(`todo with an id of ${req.params.id} was not updated because it was found`)
        return res.status(404).json({ error: 'Todo not found' })
    }

    await todo.update({ title: req.body.title })
    console.log(`todo with id of ${req.params.id} updated`)

    res.json(todo)
})

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Διαγραφή ενός todo και των items του
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID του todo
 *     responses:
 *       200:
 *         description: Το todo διαγράφηκε
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Todo deleted
 *       404:
 *         description: Το todo δεν βρέθηκε
 */
todoRouter.delete('/:id', async (req, res) => {
    const todo = await toDo.findByPk(req.params.id)

    if (!todo) {
        console.log(`todo with an id of ${req.params.id} was not deleted because it was not found`)
        return res.status(404).json({ error: 'Todo not found' })
    }

    await todo.destroy()
    console.log(`todo with id of ${req.params.id} deleted`)

    res.json({message: 'Todo deleted'})
})

export default todoRouter