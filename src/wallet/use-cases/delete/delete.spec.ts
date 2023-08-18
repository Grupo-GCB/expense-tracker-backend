import { Test, TestingModule } from '@nestjs/testing';

import { IWalletRepository } from '@/wallet/interfaces';
import { AccountType } from '@/shared/constants';
import { NotFoundException } from '@nestjs/common';
import { DeleteWalletUseCase } from '@/wallet/use-cases';
import { Wallet } from '@/wallet/infra/entities';

describe('Delete Wallet Use Case', () => {
  let walletRepository: IWalletRepository;
  let sut: DeleteWalletUseCase;
  let findByIdMock: jest.SpyInstance;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteWalletUseCase,
        {
          provide: IWalletRepository,
          useFactory: () => ({
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          }),
        },
      ],
    }).compile();

    sut = module.get<DeleteWalletUseCase>(DeleteWalletUseCase);
    walletRepository = module.get<IWalletRepository>(IWalletRepository);

    findByIdMock = jest.spyOn(walletRepository, 'findById');
  });

  const validId = '4e8b5d94-6b16-4a42-b6d1-dc58b553d109';
  const invalidId = 'invalid-id';

  const wallet = {
    id: validId,
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Descrição',
    deleted_at: null as Date | null,
  } as Wallet;

  it.only('should be able to delete a wallet when exist a wallet', async () => {
    findByIdMock.mockResolvedValue(wallet);

    await sut.execute({ id: wallet.id });

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(wallet.id);

    expect(walletRepository.delete).toHaveBeenCalledTimes(1);
    expect(walletRepository.delete).toHaveBeenCalledWith(wallet.id);
  });

  it('should not be able to delete a wallet when non exist wallet', async () => {
    const nonExistingWalletId: Wallet = {
      ...wallet,
      id: invalidId,
    };

    const result = sut.execute(nonExistingWalletId);

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(
      nonExistingWalletId.id,
    );

    expect(result).rejects.toBeInstanceOf(NotFoundException);

    expect(walletRepository.delete).not.toHaveBeenCalled();
  });
});
