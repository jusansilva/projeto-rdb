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