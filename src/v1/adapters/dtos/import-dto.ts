export interface ImportDto {
    bilhetagem:File;
    gps: File;
}

export interface BilhetagemDto {
    carro?: string;
    linha?: string;
    data?: string;
    cartaoId?: string;
    transacao?: string;
    sentido?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface GpsImportDto {
    data_final: string;
    AVL: string;
    carro: string;
    latitude: string;
    longitude: string;
    ponto_notavel: string;
    desc_ponto_notavel: string;
    linha: string;
    sentido: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RelationshipDto {
    data_gps: string;
    carro?: string;
    linha: string;
    AVL: string;
    cartaoId?: string;
    transacao?: string;
    sentido?: string;
    latitude: string;
    longitude: string;
    ponto_notavel: string;
    desc_ponto_notavel: string;
}