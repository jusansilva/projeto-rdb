export interface ImportDto {
    bilhetagem: FileTemp;
    gps: FileTemp;
}

export interface FileTemp extends File {
    name: string;
    data: Buffer;
    size: number;
    encoding: string;
    tempFilePath: string;
    truncated: boolean;
    mimetype: string;
    md5: string;
}

export interface BilhetagemDto {
    carro?: string;
    linha?: string;
    data?: Date;
    cartaoId?: string;
    transacao?: string;
    sentido?: string;
    document?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface GpsImportDto {
    data_final: Date;
    AVL: string;
    carro: string;
    latitude: string;
    longitude: string;
    ponto_notavel: string;
    desc_ponto_notavel: string;
    linha: string;
    sentido: string;
    document?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RelationshipDto {
    data_gps: Date;
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