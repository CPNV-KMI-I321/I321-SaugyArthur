import users from "../data/mock-users.js"

export const getUsers = (req, res) => {
    try {
        res.json(users)
    } catch (error) {
        res.status(500).json({error: "Une erreur interne est survenue"})
    }
}