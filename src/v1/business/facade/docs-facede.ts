import { Request } from "express";

export interface DocsFacade {
  import: (file: Request) => Promise<DocsImportResponse>;
}
