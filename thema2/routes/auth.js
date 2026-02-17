import { Router } from "express"
import { user } from "../models/index.js"
import {isLoggedIn, setLoggedIn} from "../state.js"

const authRouter = Router()

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Δημιουργία νέου χρήστη
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: vaggelis
 *               password:
 *                 type: string
 *                 example: mypassword
 *     responses:
 *       201:
 *         description: Ο χρήστης δημιουργήθηκε
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Κάτι πήγε στραβά
 */
authRouter.post('/signup', async (req, res) => {
    try {

        const { name, password } = req.body
        const user_ = await user.create({
            name: name,
            password: password
        })
        console.log(`added user with name: ${name} and password: ${password}`)
        res.status(201).json(user_)

    } catch (error) {

        console.log(error)
        res.status(500).json({
            error: 'something went wrong'
        })

    }
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Σύνδεση χρήστη
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: vaggelis
 *               password:
 *                 type: string
 *                 example: mypassword
 *     responses:
 *       200:
 *         description: Επιτυχής σύνδεση
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome back vaggelis!
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       201:
 *         description: Ο χρήστης είναι ήδη συνδεδεμένος
 *       401:
 *         description: Λάθος κωδικός
 *       404:
 *         description: Ο χρήστης δεν βρέθηκε
 */
authRouter.post('/auth/login', async (req, res) => {
    if (isLoggedIn) {
        console.log("User is already logged in. Cant log in again!")
        return res.status(201).json({
            message: 'User is already logged in'
        })
    } else {
        setLoggedIn(true)
    }

    try {

        const { name, password } = req.body

        const existingUser = await user.findOne({
            where: { name: name }
        })

        if (!existingUser) {
            console.log(`User with the name ${name} was not found`)
            res.status(404).json({
                error: `User with the name ${name} does not exists`
            })
        }

        if (existingUser.password === password) {
            console.log("User logged in")
            return res.status(200).json({
                message: `Welcome back ${name}!`,
                user: existingUser
            })
        } else {
            return res.status(401).json({
                error: 'Wrong password'
            })
        }


    } catch (error) {

        console.log(error)
        res.status(501).json({
            error: 'something went wrong'
        })

    }
})

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Αποσύνδεση χρήστη
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: Ο χρήστης αποσυνδέθηκε ή δεν ήταν συνδεδεμένος
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged out
 */
authRouter.get('/auth/logout', async (req, res) => {
    if (!isLoggedIn) {
        console.log("User is not logged in. Cant log out!")
        return res.status(201).json({
            message: 'User is not logged in'
        })
    } else {
        setLoggedIn(false)
        console.log("User Logged out")
        return res.status(201).json({
            message: 'User logged out'
        })
    }
})

export default authRouter