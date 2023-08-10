import { SaveWalletDTO, UpdateWalletDTO } from '@/wallet/dto';
import { Wallet } from '@/wallet/infra/entities';

export abstract class IWalletRepository {
  abstract create(data: SaveWalletDTO): Promise<Wallet>;
  abstract update(data: UpdateWalletDTO): Promise<Wallet>;
  abstract findById(wallet_id: string): Promise<Wallet>;
}
