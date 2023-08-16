import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { AccountType } from '@/shared/constants';
import { UpdateWalletDTO } from '@/wallet/dto';
import { IWalletRepository } from '@/wallet/interfaces';
import { UpdateWalletUseCase } from '@/wallet/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { IBankRepository } from '@/bank/interfaces';
import { Bank } from '@/bank/infra/entities';
import { Wallet } from '@/wallet/infra/entities';

describe('UpdateWalletUseCase', () => {
  let updateWalletUseCase: UpdateWalletUseCase;
  let findBankByIdUseCase: FindBankByIdUseCase;
  let walletRepository: IWalletRepository;
  let findByIdMock: jest.SpyInstance;
  let updateMock: jest.SpyInstance;
  let findBankByIdMock: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateWalletUseCase,
        FindBankByIdUseCase,
        {
          provide: IWalletRepository,
          useFactory: () => ({
            update: jest.fn(),
            findById: jest.fn(),
          }),
        },
        {
          provide: IBankRepository,
          useFactory: () => ({
            findById: jest.fn(),
          }),
        },
      ],
    }).compile();

    updateWalletUseCase = module.get<UpdateWalletUseCase>(UpdateWalletUseCase);
    findBankByIdUseCase = module.get<FindBankByIdUseCase>(FindBankByIdUseCase);
    walletRepository = module.get<IWalletRepository>(IWalletRepository);

    findByIdMock = jest.spyOn(walletRepository, 'findById');
    updateMock = jest.spyOn(walletRepository, 'update');
    findBankByIdMock = jest.spyOn(findBankByIdUseCase, 'execute');
  });

  const validId = '4e8b5d94-6b16-4a42-b6d1-dc58b553d109';
  const invalidId = 'invalid-id';

  const updateData: UpdateWalletDTO = {
    id: validId,
    bank_id: validId,
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Nova descrição',
  };

  const bank = {
    id: validId,
    name: 'anyBank',
    logo_url: 'anyURL',
  } as Bank;

  describe('execute', () => {
    it('should be update wallet successfully', async () => {
      const updatedWallet = plainToClass(Wallet, updateData);

      findBankByIdMock.mockResolvedValue(bank);
      updateMock.mockResolvedValue(updatedWallet);
      findByIdMock.mockResolvedValue(updatedWallet);

      await expect(updateWalletUseCase.execute(updateData)).resolves.toEqual(
        updatedWallet,
      );
      expect(walletRepository.update).toHaveBeenCalledTimes(1);
      expect(walletRepository.update).toHaveBeenCalledWith(updatedWallet);
    });

    it('should throw NotFoundException if wallet does not exist', async () => {
      const updateData: UpdateWalletDTO = {
        account_type: AccountType.CHECKING_ACCOUNT,
        bank_id: validId,
        description: 'Nova descrição',
        id: invalidId,
      };

      findBankByIdMock.mockResolvedValue(bank);
      findByIdMock.mockResolvedValue(null);
      updateMock.mockResolvedValue(NotFoundException);

      await expect(
        updateWalletUseCase.execute(updateData),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(walletRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if bank does not exist', async () => {
      const updateData: UpdateWalletDTO = {
        account_type: AccountType.CHECKING_ACCOUNT,
        bank_id: invalidId,
        description: 'Nova descrição',
        id: validId,
      };

      updateMock.mockResolvedValue(NotFoundException);
      findBankByIdMock.mockResolvedValue(null);

      await expect(
        updateWalletUseCase.execute(updateData),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(findBankByIdUseCase.execute).toHaveBeenCalledTimes(1);
      expect(findBankByIdUseCase.execute).toHaveBeenCalledWith(
        updateData.bank_id,
      );
      expect(walletRepository.findById).not.toHaveBeenCalled();
      expect(walletRepository.update).not.toHaveBeenCalled();
    });
  });
});
