import { Router } from "express";
import { ImportDocs } from "./import-docs-routes";
import { User } from "./user-routes";
const v1 = Router();
v1.use(ImportDocs);
v1.use(User);

export { v1 };
