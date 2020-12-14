export interface ImportDto {
    data: string;
    type: string;
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
}