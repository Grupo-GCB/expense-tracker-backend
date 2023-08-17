import { SaveWalletDTO } from '@/wallet/dto';
import { Wallet } from '@/wallet/infra/entities';

export abstract class IWalletRepository {
  abstract create(data: SaveWalletDTO): Promise<Wallet>;
  abstract delete(id: string): Promise<void>;
  abstract update(wallet: Wallet): Promise<Wallet>;
  abstract findById(wallet_id: string): Promise<Wallet>;
}
