import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../auth/guards/workspace.guard';
import { GetWorkspaceId } from '../auth/decorators/get-workspace-id.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(
    @GetWorkspaceId() workspaceId: string,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    return this.customerService.create(workspaceId, createCustomerDto);
  }

  @Get()
  findAll(
    @GetWorkspaceId() workspaceId: string,
    @Query('storeId') storeId?: string,
  ) {
    return this.customerService.findAll(workspaceId, storeId);
  }

  @Get('by-phone')
  findByPhone(
    @GetWorkspaceId() workspaceId: string,
    @Query('storeId') storeId: string,
    @Query('phone') phone: string,
  ) {
    return this.customerService.findByPhone(workspaceId, storeId, phone);
  }

  @Get(':id')
  findOne(@GetWorkspaceId() workspaceId: string, @Param('id') id: string) {
    return this.customerService.findOne(workspaceId, id);
  }

  @Patch(':id')
  update(
    @GetWorkspaceId() workspaceId: string,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(workspaceId, id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@GetWorkspaceId() workspaceId: string, @Param('id') id: string) {
    return this.customerService.remove(workspaceId, id);
  }
}
