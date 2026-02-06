import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SettingsService } from './settings.service';
import { UpdateCurrenciesDto } from './dto/update-currencies.dto';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // ==================== CURRENCIES CRUD ====================

  // Get all workspace currencies
  @Get('currencies')
  getAllCurrencies(@Request() req: any) {
    return this.settingsService.getAllCurrencies(
      req.user.userId,
      req.user.workspaceId,
    );
  }

  // Create currency
  @Post('currencies')
  createCurrency(@Request() req: any, @Body() dto: CreateCurrencyDto) {
    return this.settingsService.createCurrency(
      req.user.userId,
      req.user.workspaceId,
      dto,
    );
  }

  // Update currency
  @Put('currencies/:id')
  updateCurrency(
    @Request() req: any,
    @Param('id') currencyId: string,
    @Body() dto: UpdateCurrencyDto,
  ) {
    return this.settingsService.updateCurrency(
      req.user.userId,
      req.user.workspaceId,
      currencyId,
      dto,
    );
  }

  // Delete currency
  @Delete('currencies/:id')
  deleteCurrency(@Request() req: any, @Param('id') currencyId: string) {
    return this.settingsService.deleteCurrency(
      req.user.userId,
      req.user.workspaceId,
      currencyId,
    );
  }

  // ==================== STORE CURRENCIES ====================

  // Get store currency settings
  @Get('stores/:storeId/currencies')
  getStoreCurrencies(@Request() req: any, @Param('storeId') storeId: string) {
    return this.settingsService.getStoreCurrencies(
      req.user.userId,
      req.user.workspaceId,
      storeId,
    );
  }

  // Update store currency settings
  @Put('stores/:storeId/currencies')
  updateStoreCurrencies(
    @Request() req: any,
    @Param('storeId') storeId: string,
    @Body() dto: UpdateCurrenciesDto,
  ) {
    return this.settingsService.updateStoreCurrencies(
      req.user.userId,
      req.user.workspaceId,
      storeId,
      dto,
    );
  }
}
