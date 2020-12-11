import { Router } from "express";
import { Healht } from "./health-routes";
import { ImportDocs } from "./import-docs-routes";
const v1 = Router();
v1.use(ImportDocs);
v1.use(Healht);
// v1.use(AuthHandlerMiddleware.get().handler, Schedules);

export { v1 };
