const express= require("express");

const { getRoutineActivityById, addActivityToRoutine, updateRoutineActivity, destroyRoutineActivity, getRoutineActivityByRoutine  } =require("../db")

const RoutineActivities=express.Router();

RoutineActivities.get("/:id", async (req, res) => {
    const id = req.body.id
    const RoutineActivity = await getRoutineActivityByRoutine(id)
    if (!RoutineActivity) {
            res.status(404).json({ message: `Routine activity with id ${id} not found`})
    } else {
        res.json(RoutineActivity)
    }
})

// RoutineActivities.post("/:id", async (req, res) => {
//     const userId = req.body.user.id
//     try {
//         if (req.body.routines.creatorId == userId) {
//             const addedActivity = await addActivityToRoutine()  
//             res.send({addedActivity})
//         } else {
//             res.send({
//                 success: false,
//                 message: "Cannot add an activity to a routine that is not yours"
//             })
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message: "Internal Server Error"
//         })
//     }
// })

RoutineActivities.patch("/:id", async (req, res) => {
        const id = req.params.id
        const {duration, count} = req.body
    try {
        const updatedRoutineActivities = await updateRoutineActivity({id, count, duration})

        if(updatedRoutineActivities.length == 0) {
            res.status(404).json({ message: `Routine Activity with id ${id} not found` });
        } else {
            res.json(updatedRoutineActivities[0])
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

RoutineActivities.delete("/:id", async (req, res) => {
    const id = req.params

    try {
            const deleteRoutineActivity = await destroyRoutineActivity(id)
            res.send({
                success: true,
                deleteRoutineActivity
            })

    } catch(error) {
        console.log(error)
        
            res.status(500).json({message: "Internal server error"})
            
        
    }
})





module.exports = RoutineActivities 