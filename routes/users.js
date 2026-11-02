import { Router } from "express"

import users from "../data/mock-users.js"

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
    try {
        res.json(users)
    } catch (error) {
        res.status(500).json({error: "Une erreur interne est survenue"})
    }
})

export default usersRouter