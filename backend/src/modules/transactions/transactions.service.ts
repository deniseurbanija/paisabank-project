import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/db/entities/Transactions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {
    this.initializeTransactions();
  }

  async findLastTransactions(userId: number): Promise<Transaction[]> {
    console.log(userId);

    return this.transactionsRepository.find({
      where: { userId: 1 },
      order: { date: 'DESC' },
      take: 5,
    });
  }

  async findAllTransactions(
    userId: number,
    transactionType?: string,
  ): Promise<Transaction[]> {
    console.log(
      'Buscando transacciones para usuario:',
      userId,
      'tipo:',
      transactionType,
    );
    const queryBuilder = this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = 1') //! DEBO OBTENER EL ID DEL USUARIO
      .orderBy('transaction.date', 'DESC');

    if (transactionType) {
      queryBuilder.andWhere('transaction.transactionType = :transactionType', {
        transactionType,
      });
    }

    return queryBuilder.getMany();
  }

  private async initializeTransactions() {
    const count = await this.transactionsRepository.count();
    if (count === 0) {
      // Generar 20 transacciones de ejemplo variadas
      const transactions = [];
      const types = ['SUS', 'CASH_IN', 'CASH_OUT'];
      const titles = [
        'Pago de Alquiler',
        'Transferencia recibida',
        'Pago de Servicios',
        'Salario',
        'Compra Supermercado',
        'Subscripción Netflix',
        'Transferencia a Juan',
        'Retiro de Cajero',
        'Depósito',
        'Pago Tarjeta Crédito',
      ];

      for (let i = 0; i < 20; i++) {
        const typeIndex = i % 3;
        const titleIndex = i % 10;

        // Generar cantidades acordes al tipo de transacción
        let amount;
        if (types[typeIndex] === 'CASH_IN') {
          amount = (Math.random() * 1000 + 100).toFixed(2);
        } else {
          amount = (-1 * (Math.random() * 500 + 50)).toFixed(2);
        }

        // Generar fecha en los últimos 30 días
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        transactions.push({
          userId: 1,
          title: titles[titleIndex],
          amount: amount,
          transactionType: types[typeIndex],
          date: date.toISOString(),
        });
      }

      await this.transactionsRepository.save(transactions);
    }
  }
}
