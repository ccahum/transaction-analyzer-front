import api from './client';

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  merchant: string;
  category: string;
  aiSummary: string;
  isAnomaly: boolean;
  anomalyReason: string | null;
  createdAt: string;
}

export type CreateTransactionDto = {
  description: string;
  amount: number;
  merchant: string;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data } = await api.get<Transaction[]>('/transactions');
  return data;
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
  const { data } = await api.get<Transaction>(`/transactions/${id}`);
  return data;
};

export const createTransaction = async (dto: CreateTransactionDto): Promise<Transaction> => {
  const { data } = await api.post<Transaction>('/transactions', dto);
  return data;
};
