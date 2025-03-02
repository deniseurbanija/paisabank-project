import { Controller, Get } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('paisabank/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async getCards() {
    return await this.cardsService.getCards();
  }
}
