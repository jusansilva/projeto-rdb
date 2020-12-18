import { ImportDto, RelationshipDto } from "../dtos/import-dto";

export interface DocsFacade {
  import: (dto: ImportDto) => Promise<string>;
  find: (date?: string, carro?: string) => Promise<RelationshipDto[]>;
}
