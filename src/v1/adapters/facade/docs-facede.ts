import { ImportDto, RelationshipDto } from "../dtos/import-dto";

export interface DocsFacade {
  import: (dto: ImportDto) => Promise<void>;
  find: (date?: string, carro?: string) => Promise<RelationshipDto[]>;
  saveRelatioship: (date?: string, carro?: string) => Promise<string>;
}
