import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CollegesService } from './colleges.service';
import { QueryCollegesDto } from './dto/query-colleges.dto';

@ApiTags('Colleges')
@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @Get()
  @ApiOperation({
    summary: 'List colleges with full-text search, filters, and cursor pagination',
  })
  findAll(@Query() query: QueryCollegesDto) {
    return this.collegesService.findAll(query);
  }

  @Get('filters')
  @ApiOperation({ summary: 'Get distinct filter values for states, cities, and types' })
  getFilters() {
    return this.collegesService.getDistinctFilters();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get full college detail by slug' })
  @ApiParam({ name: 'slug', example: 'iit-bombay' })
  findOne(@Param('slug') slug: string) {
    return this.collegesService.findBySlug(slug);
  }
}
