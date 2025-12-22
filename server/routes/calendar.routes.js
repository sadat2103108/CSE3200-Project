import express from "express";

import {
    calendarAddController,
    calendarDeleteController,
    calendarFetchController,
    calendarUpdateController
} from "../controllers/calendar.controllers.js";



const router = express.Router();


router.get("/fetch", calendarFetchController);

router.post("/add", calendarAddController);

router.patch("/update", calendarUpdateController);

router.delete("/delete", calendarDeleteController);


export default router;
