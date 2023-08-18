import { Test, TestingModule } from '@nestjs/testing';

import { DeleteWalletUseCase } from './delete';
import { IWalletRepository } from '@/wallet/interfaces';
import { AccountType } from '@/shared/constants';
import { UpdateWalletDTO } from '@/wallet/dto';
import { NotFoundException } from '@nestjs/common';

describe('Delete Wallet Use Case', () => {
  let walletRepository: IWalletRepository;
  let sut: DeleteWalletUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteWalletUseCase,
        {
          provide: IWalletRepository,
          useFactory: () => ({
            findById: jest.fn(),
            delete: jest.fn(),
          }),
        },
      ],
    }).compile();

    sut = module.get<DeleteWalletUseCase>(DeleteWalletUseCase);
    walletRepository = module.get<IWalletRepository>(IWalletRepository);
  });

  const validId = '4e8b5d94-6b16-4a42-b6d1-dc58b553d109';
  const invalidId = 'invalid-id';

  const walletData: UpdateWalletDTO = {
    id: validId,
    bank_id: validId,
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Nova descrição',
  };

  it.only('should not be able to delete a wallet when non exist wallet', async () => {
    const nonExistingWalletId: UpdateWalletDTO = {
      ...walletData,
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
