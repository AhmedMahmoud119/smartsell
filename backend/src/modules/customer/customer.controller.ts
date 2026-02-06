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
  Request,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(
    @Request() req,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    const workspaceId = req.user.workspaces[0]?.workspace.id;
    return this.customerService.create(workspaceId, createCustomerDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('storeId') storeId?: string,
  ) {
    const workspaceId = req.user.workspaces[0]?.workspace.id;
    return this.customerService.findAll(workspaceId, storeId);
  }

  @Get('by-phone')
  findByPhone(
    @Request() req,
    @Query('storeId') storeId: string,
    @Query('phone') phone: string,
  ) {
    const workspaceId = req.user.workspaces[0]?.workspace.id;
    return this.customerService.findByPhone(workspaceId, storeId, phone);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const workspaceId = req.user.workspaces[0]?.workspace.id;
    return this.customerService.findOne(workspaceId, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const workspaceId = req.user.workspaces[0]?.workspace.id;
    return this.customerService.update(workspaceId, id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const workspaceId = req.user.workspaces[0]?.workspace.id;
    return this.customerService.remove(workspaceId, id);
  }
}
