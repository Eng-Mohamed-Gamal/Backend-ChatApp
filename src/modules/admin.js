import { Router } from "express";


const router = Router()



router.get("/keep-alive" , (req , res , next)=> {
    res.send("Appliction is awake!")
})

export default router ;