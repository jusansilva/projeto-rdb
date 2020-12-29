import { Router } from "express";
import { Healht } from "./health-routes";
import { ImportDocs } from "./import-docs-routes";
const v1 = Router();
v1.use(ImportDocs);
v1.use(Healht);

export { v1 };
