import { SaveWalletDTO } from '@/wallet/dto';
import { Wallet } from '@/wallet/infra/entities';

export abstract class IWalletRepository {
  abstract create(data: SaveWalletDTO): Promise<Wallet>;
  abstract findAll(): Promise<Wallet[]>;
}
