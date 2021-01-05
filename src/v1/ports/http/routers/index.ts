import { Router } from "express";
import { ImportDocs } from "./import-docs-routes";
const v1 = Router();
v1.use(ImportDocs);

export { v1 };
