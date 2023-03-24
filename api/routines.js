const express = require("express");
const RoutineRouter = express.Router();

const {getAllPublicRoutines, getRoutinesWithoutActivities, createRoutine, getRoutineById, updateRoutine, destroyRoutine} = require("../db")

RoutineRouter.get("/", async (req,res) => {
    const allRoutines = await getAllPublicRoutines();

    res.send({allRoutines})
})

RoutineRouter.post("/", async(req, res) =>{
    if(!req.body.user) res.send("You must be logged in to perform this action")
    
    const {name, goal,} = req.body;
    const creatorId = req.body.user.id
    
    const isPublic = false;
    if(req.body.isPublic) {
        isPublic = req.body.isPublic;
    }

    const createdRout = await createRoutine({creatorId, name, goal, isPublic})

    if(createdRout) res.send(createdRout);
    else res.send("Invalid routine data").status(400)
})

RoutineRouter.patch("/:routineId", async (req,res) =>{
    const {routineId} = req.params;
    
    const {name, goal,} = req.body;
    const creatorId = req.body.user.id
    
    const isPublic = false;
    if(req.body.isPublic) {
        isPublic = req.body.isPublic;
    }

    try {
        const originalPost = await getRoutineById(routineId);
        const id = originalPost.id

        if(originalPost.creatorId == creatorId){
            const updatedRout = await updateRoutine({id, isPublic, name, goal})
            res.send(updatedRout)
        }else{
            res.send("You are not authorized to alter this routine").status(403)
        }
        
    } catch (error) {
        console.log(error)
    }
}) 


RoutineRouter.delete("/:routineId", async (req, res) => {
    const {routineId} = req.params;

    const creatorId = req.body.user.id

    try {
        const deltedRout = await getRoutineById(routineId);


        if(deltedRout && deltedRout.creatorId == creatorId){
            await destroyRoutine(routineId)
            res.send({success: true,
            deltedRout
            })
        }else if(deltedRout){
            res.send({success: false,
                message: "You do not have access to delete this routine."}).status(403)
        }else{
            res.send({success: false,
                message: "No routine was found with that ID."}).status(404)
        }
    } catch (error) {
        console.log(error)
    }
})



module.exports = {
    RoutineRouter
}