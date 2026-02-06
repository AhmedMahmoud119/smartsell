import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  /**
   * GET /analytics/dashboard
   * Get dashboard overview stats
   */
  @Get('dashboard')
  async getDashboardStats(
    @Request() req,
    @Query('storeId') storeId?: string,
  ) {
    return this.analyticsService.getDashboardStats(req.user.workspaceId, storeId);
  }

  /**
   * GET /analytics/revenue
   * Get revenue over time
   */
  @Get('revenue')
  async getRevenueOverTime(
    @Request() req,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getRevenueOverTime(req.user.workspaceId, query);
  }

  /**
   * GET /analytics/top-products
   * Get best selling products
   */
  @Get('top-products')
  async getTopProducts(
    @Request() req,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getTopProducts(req.user.workspaceId, query);
  }

  /**
   * GET /analytics/top-customers
   * Get highest value customers
   */
  @Get('top-customers')
  async getTopCustomers(
    @Request() req,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getTopCustomers(req.user.workspaceId, query);
  }

  /**
   * GET /analytics/orders-by-status
   * Get order status distribution
   */
  @Get('orders-by-status')
  async getOrdersByStatus(
    @Request() req,
    @Query('storeId') storeId?: string,
  ) {
    return this.analyticsService.getOrdersByStatus(req.user.workspaceId, storeId);
  }

  /**
   * GET /analytics/sales-by-store
   * Get revenue breakdown by store
   */
  @Get('sales-by-store')
  async getSalesByStore(@Request() req) {
    return this.analyticsService.getSalesByStore(req.user.workspaceId);
  }

  /**
   * GET /analytics/recent-orders
   * Get recent orders
   */
  @Get('recent-orders')
  async getRecentOrders(
    @Request() req,
    @Query('storeId') storeId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getRecentOrders(
      req.user.workspaceId,
      storeId,
      limit ? parseInt(limit, 10) : 5,
    );
  }
}
