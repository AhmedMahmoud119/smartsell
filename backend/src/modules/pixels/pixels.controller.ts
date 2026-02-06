import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PixelsService } from './pixels.service';
import { UpdatePixelsDto } from './dto/update-pixels.dto';

@Controller('pixels')
@UseGuards(JwtAuthGuard)
export class PixelsController {
  constructor(private pixelsService: PixelsService) {}

  @Get(':storeId')
  getPixels(@Request() req, @Param('storeId') storeId: string) {
    const workspaceId = req.user.workspaces[0]?.workspace.id;
    return this.pixelsService.getPixels(storeId, workspaceId);
  }

  @Patch(':storeId')
  updatePixels(
    @Request() req,
    @Param('storeId') storeId: string,
    @Body() dto: UpdatePixelsDto,
  ) {
    const workspaceId = req.user.workspaces[0]?.workspace.id;
    return this.pixelsService.updatePixels(storeId, workspaceId, dto);
  }

  @Post(':storeId/test')
  testPixel(
    @Request() req,
    @Param('storeId') storeId: string,
    @Query('type') pixelType: string,
  ) {
    const workspaceId = req.user.workspaces[0]?.workspace.id;
    return this.pixelsService.testPixel(storeId, workspaceId, pixelType);
  }
}
