import { ImportDto, BilhetagemDto } from "../dtos/import-dto";

export interface DocsFacade {
  import: (dto: ImportDto) => Promise<BilhetagemDto>;
}
