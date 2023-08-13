import { IWalletRepository } from '@/wallet/interfaces';
import { FindWalletByIdUseCase } from '@/wallet/use-cases';

describe('Find Bank by ID', () => {
  let findWalletById: FindWalletByIdUseCase;
  let walletRepository: jest.Mocked<IWalletRepository>;

  const walletId = 'existent-wallet-id';
  const nonExistentWalletId = 'non-existent-wallet-id';

  beforeAll(() => {
    walletRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IWalletRepository>;

    findWalletById = new FindWalletByIdUseCase(walletRepository);
  });
});
