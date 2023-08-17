import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { AccountType } from '@/shared/constants';
import { UpdateWalletDTO } from '@/wallet/dto';
import { IWalletRepository } from '@/wallet/interfaces';
import { UpdateWalletUseCase } from '@/wallet/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { IBankRepository } from '@/bank/interfaces';
import { Bank } from '@/bank/infra/entities';
import { Wallet } from '@/wallet/infra/entities';

describe('Update Wallet Use Case', () => {
  let sut: UpdateWalletUseCase;
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

    sut = module.get<UpdateWalletUseCase>(UpdateWalletUseCase);
    findBankByIdUseCase = module.get<FindBankByIdUseCase>(FindBankByIdUseCase);
    walletRepository = module.get<IWalletRepository>(IWalletRepository);

    findByIdMock = jest.spyOn(walletRepository, 'findById');
    updateMock = jest.spyOn(walletRepository, 'update');
    findBankByIdMock = jest.spyOn(findBankByIdUseCase, 'execute');

    findBankByIdMock.mockResolvedValue(bank);
    updateMock.mockResolvedValue(NotFoundException);
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

  it('should be able to update a wallet', async () => {
    const updatedWallet = plainToClass(Wallet, updateData);

    updateMock.mockResolvedValue(updatedWallet);
    findByIdMock.mockResolvedValue(updatedWallet);

    await expect(sut.execute(updateData)).resolves.toEqual(updatedWallet);

    expect(walletRepository.update).toHaveBeenCalledTimes(1);
    expect(walletRepository.update).toHaveBeenCalledWith(updatedWallet);

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(updateData.id);

    expect(findBankByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(findBankByIdUseCase.execute).toHaveBeenCalledWith(
      updateData.bank_id,
    );
  });

  it('should not be able to update a wallet when wallet does not exists', async () => {
    const dtoWithNonExistingWallet: UpdateWalletDTO = {
      ...updateData,
      id: invalidId,
    };

    findByIdMock.mockResolvedValue(null);

    await expect(sut.execute(dtoWithNonExistingWallet)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(findBankByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(findBankByIdUseCase.execute).toHaveBeenCalledWith(
      dtoWithNonExistingWallet.bank_id,
    );

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(
      dtoWithNonExistingWallet.id,
    );

    expect(walletRepository.update).not.toHaveBeenCalled();
  });

  it('should not be able to update a wallet when bank does not exists', async () => {
    const dtoWithNonExistingBank: UpdateWalletDTO = {
      ...updateData,
      bank_id: invalidId,
    };

    findBankByIdMock.mockResolvedValue(null);

    await expect(sut.execute(dtoWithNonExistingBank)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(findBankByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(findBankByIdUseCase.execute).toHaveBeenCalledWith(
      dtoWithNonExistingBank.bank_id,
    );

    expect(walletRepository.findById).not.toHaveBeenCalled();
    expect(walletRepository.update).not.toHaveBeenCalled();
  });
});
