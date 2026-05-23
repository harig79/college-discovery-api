import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CompareService } from './compare.service';

@ApiTags('Compare')
@Controller('compare')
export class CompareController {
  constructor(private readonly compareService: CompareService) {}

  @Get()
  @ApiOperation({
    summary: 'Compare 2-3 colleges side by side',
    description: 'Pass comma-separated college IDs. Example: ?ids=1,2,3',
  })
  @ApiQuery({ name: 'ids', example: '1,2,3', description: 'Comma-separated college IDs' })
  compare(@Query('ids') ids: string) {
    if (!ids) throw new BadRequestException('ids query param is required');

    const parsed = ids
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (parsed.length === 0) {
      throw new BadRequestException('No valid IDs provided');
    }

    return this.compareService.compare(parsed);
  }
}
