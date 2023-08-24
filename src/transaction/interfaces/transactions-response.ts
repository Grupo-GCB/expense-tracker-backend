export interface ITransactionResponse {
  id: string;
  categories: string;
  description: string;
  value: number;
  type: string;
  date: Date;
  wallet_id: string;
}
