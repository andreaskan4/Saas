import { Router } from "express"
import { toDoItem } from "../models/index.js"

export const todoItemRouter = Router({mergeParams: true}) //mergeParams to get the base url

/**
 * @swagger
 * /todos/{id}/items:
 *   post:
 *     summary: Δημιουργία νέου item μέσα σε ένα todo
 *     tags: [Todo Items]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Γάλα
 *     responses:
 *       201:
 *         description: Το item δημιουργήθηκε
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoItem'
 *       500:
 *         description: Κάτι πήγε στραβά
 */
todoItemRouter.post('/', async (req,res) => {
    const baseId = req.params.id
    try {
    
        const item = await toDoItem.create({
            content: req.body.content,
            toDoId: baseId,
            completed: false
        })
        console.log(`added todo ITEM with title ${req.body.content}`)
        res.status(201).json(item)
    
    } catch (error) {

        console.log(error)
        res.status(500).json({
            error: 'something went wrong'
        })
        
    }
})

/**
 * @swagger
 * /todos/{id}/items/{iid}:
 *   get:
 *     summary: Επιστρέφει ένα item βάσει ID
 *     tags: [Todo Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID του todo
 *       - in: path
 *         name: iid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID του item
 *     responses:
 *       201:
 *         description: Το item βρέθηκε
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoItem'
 *       404:
 *         description: Το item δεν βρέθηκε
 */
todoItemRouter.get('/:iid', async (req, res) => {
    const baseId = req.params.id

    try{
        const todoItem = await toDoItem.findByPk(req.params.iid)

        if (!todoItem) {
            console.log(`todo with an id of ${req.params.iid} was not found inside todo with an id of ${req.params.id}`)
            return res.status(404).json({ error: `Todo ITEM with id of ${req.params.iid} not found inside todo with an id of ${req.params.id}` })
        }

        res.status(201).json(todoItem)
        console.log(`found the todo ITEM with an id of ${req.params.iid}`)
    } catch(error) {

    }
})

/**
 * @swagger
 * /todos/{id}/items/{iid}:
 *   put:
 *     summary: Ενημέρωση ενός item
 *     tags: [Todo Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID του todo
 *       - in: path
 *         name: iid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID του item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Νέο περιεχόμενο
 *               completed:
 *                 type: boolean
 *                 example: true
 *               toDoId:
 *                 type: integer
 *                 description: Μετακίνηση σε άλλο todo
 *     responses:
 *       200:
 *         description: Το item ενημερώθηκε
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoItem'
 *       404:
 *         description: Το item δεν βρέθηκε
 */
todoItemRouter.put('/:iid', async (req, res) => {
    const todoItem = await toDoItem.findByPk(req.params.iid)

    if (!todoItem) {
        console.log(`todo ITEM with an id of ${req.params.id} was not updated because it was found`)
        return res.status(404).json({ error: 'Todo not found' })
    }

    const updatedData = {
        content: req.body.content,
        toDoId: req.body.toDoId || req.params.iid
    }

    if (req.body.completed !== undefined) updatedData.completed = req.body.completed

    await todoItem.update(updatedData)
    console.log(`todo ITEM with id of ${req.params.iid} updated`)

    res.json(todoItem)
})

/**
 * @swagger
 * /todos/{id}/items/{iid}:
 *   delete:
 *     summary: Διαγραφή ενός item
 *     tags: [Todo Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID του todo
 *       - in: path
 *         name: iid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID του item
 *     responses:
 *       200:
 *         description: Το item διαγράφηκε
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Todo ITEM deleted
 *       404:
 *         description: Το item δεν βρέθηκε
 */
todoItemRouter.delete('/:id', async (req, res) => {
    const todoItem = await toDoItem.findByPk(req.params.id)

    if (!todoItem) {
        console.log(`todo ITEM with an id of ${req.params.id} was not deleted because it was not found`)
        return res.status(404).json({ error: 'Todo ITEM not found' })
    }

    await todoItem.destroy()
    console.log(`todo with id of ${req.params.id} deleted`)

    res.json({ message: 'Todo ITEM deleted' })
})

export default todoItemRouter