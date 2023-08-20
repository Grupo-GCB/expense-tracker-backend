import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { RegisterWalletUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO } from '@/wallet/dto';
import { AccountType } from '@/shared/constants/enums';
import { FindUserByIdUseCase } from '@/user/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Wallet } from '@/wallet/infra/entities';

describe('Register Wallet Use Case', () => {
  let registerWalletUseCase: RegisterWalletUseCase;
  let walletRepository: IWalletRepository;
  let listUserByIdUseCase: ListUserByIdUseCase;
  let findBankByIdUseCase: FindBankByIdUseCase;
  let walletData: SaveWalletDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterWalletUseCase,
        {
          provide: IWalletRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ListUserByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindBankByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    registerWalletUseCase = module.get<RegisterWalletUseCase>(
      RegisterWalletUseCase,
    );
    walletRepository = module.get<IWalletRepository>(IWalletRepository);
    listUserByIdUseCase = module.get<ListUserByIdUseCase>(ListUserByIdUseCase);
    findBankByIdUseCase = module.get<FindBankByIdUseCase>(FindBankByIdUseCase);

    walletRepository.create = jest.fn().mockResolvedValue({} as Wallet);
    listUserByIdUseCase.execute = jest.fn().mockResolvedValue({});
    findBankByIdUseCase.execute = jest.fn().mockResolvedValue({});

    walletData = {
      user_id: 'user_id',
      bank_id: 'bank_id',
      account_type: AccountType.CHECKING_ACCOUNT,
      description: 'Descrição da carteira',
    };
  });

  it('should be able to register a new wallet', async () => {
    const result = await registerWalletUseCase.createWallet(walletData);

    expect(result).toBeDefined();
    expect(walletRepository.create).toHaveBeenCalledTimes(1);
    expect(walletRepository.create).toHaveBeenCalledWith(walletData);
  });

  it('should not be able to return a wallet when user id does not exist', async () => {
    listUserByIdUseCase.execute = jest.fn().mockResolvedValue(undefined);

    await expect(
      registerWalletUseCase.createWallet(walletData),
    ).rejects.toThrowError(NotFoundException);

    expect(listUserByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(listUserByIdUseCase.execute).toHaveBeenCalledWith(
      walletData.user_id,
    );

    await expect(
      async () => await registerWalletUseCase.createWallet(walletData),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not be able to return a wallet when bank id does not exist', async () => {
    findBankByIdUseCase.execute = jest.fn().mockResolvedValue(null);

    await expect(
      registerWalletUseCase.createWallet(walletData),
    ).rejects.toThrowError(NotFoundException);

    expect(findBankByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(findBankByIdUseCase.execute).toHaveBeenCalledWith(
      walletData.bank_id,
    );

    await expect(
      async () => await registerWalletUseCase.createWallet(walletData),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not be able to return a wallet if the wallet register fails', async () => {
    walletRepository.create = jest
      .fn()
      .mockRejectedValueOnce(
        new BadRequestException('Erro ao criar a carteira.'),
      );

    await expect(
      registerWalletUseCase.createWallet(walletData),
    ).rejects.toThrowError(BadRequestException);
    expect(walletRepository.create).toHaveBeenCalledTimes(1);
    expect(walletRepository.create).toHaveBeenCalledWith(walletData);
  });
});
