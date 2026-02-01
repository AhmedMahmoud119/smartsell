import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.orderService.create(userId, workspaceId, createOrderDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('storeId') storeId?: string,
    @Query('status') status?: string,
  ) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.orderService.findAll(userId, workspaceId, storeId, status);
  }

  @Get('stats')
  getStats(@Request() req, @Query('storeId') storeId?: string) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.orderService.getStats(userId, workspaceId, storeId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.orderService.findOne(userId, workspaceId, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.orderService.update(userId, workspaceId, id, updateOrderDto);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.orderService.delete(userId, workspaceId, id);
  }
}
