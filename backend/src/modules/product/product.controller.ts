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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AssignProductDto } from './dto/assign-product.dto';

@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  create(@Request() req, @Body() createProductDto: CreateProductDto) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.productService.create(userId, workspaceId, createProductDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('storeId') storeId?: string,
    @Query('status') status?: string,
  ) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.productService.findAll(userId, workspaceId, storeId, status);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.productService.findOne(userId, workspaceId, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.productService.update(userId, workspaceId, id, updateProductDto);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.productService.delete(userId, workspaceId, id);
  }

  @Post('bulk-update-status')
  bulkUpdateStatus(
    @Request() req,
    @Body() body: { productIds: string[]; status: string },
  ) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.productService.bulkUpdateStatus(
      userId,
      workspaceId,
      body.productIds,
      body.status,
    );
  }

  @Get('unassigned/list')
  getUnassignedProducts(@Request() req) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.productService.getUnassignedProducts(userId, workspaceId);
  }

  @Post(':id/assign-store')
  assignToStore(
    @Request() req,
    @Param('id') id: string,
    @Body() assignProductDto: AssignProductDto,
  ) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.productService.assignToStore(
      userId,
      workspaceId,
      id,
      assignProductDto.storeId,
    );
  }

  @Delete(':id/unassign-store')
  unassignFromStore(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.productService.unassignFromStore(userId, workspaceId, id);
  }
}
