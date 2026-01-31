import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('store')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post()
  create(@Request() req, @Body() createStoreDto: CreateStoreDto) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.storeService.create(userId, workspaceId, createStoreDto);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.storeService.findAll(userId, workspaceId);
  }

  @Get('stats')
  getStats(@Request() req) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.storeService.getStats(userId, workspaceId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.storeService.findOne(userId, workspaceId, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.storeService.update(userId, workspaceId, id, updateStoreDto);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    const workspaceId = req.user.workspaces[0]?.workspace.id;

    return this.storeService.delete(userId, workspaceId, id);
  }
}
