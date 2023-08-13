import { AccountType } from '@/shared/constants';
import { Wallet } from '@/wallet/infra/entities';
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

  it('should be able to return a wallet', async () => {
    const walletData = {
      id: '01',
      account_type: AccountType.CHECKING_ACCOUNT,
      description: 'Primeira Descrição de carteira.',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      bank: null,
      user: null,
      transactions: null,
    } as Wallet;

    walletRepository.findById.mockResolvedValue(walletData);

    const result = await findWalletById.execute(walletId);

    expect(result.wallet).toEqual(walletData);
    expect(walletRepository.findById).toHaveBeenCalledWith(walletId);
    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
  });
});
