import { SaveWalletDTO } from '../dto';
import { Wallet } from '@/wallet/infra/entities';

export abstract class IWalletRepository {
  abstract create(data: SaveWalletDTO): Promise<Wallet>;
}
