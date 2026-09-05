import { Router, type IRouter } from "express";
import healthRouter from "./health";
import fashionShowRouter from "./fashion-show";

const router: IRouter = Router();

router.use(healthRouter);
router.use(fashionShowRouter);

export default router;
