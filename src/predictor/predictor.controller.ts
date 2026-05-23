import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PredictorService } from './predictor.service';
import { PredictDto } from './dto/predict.dto';

@ApiTags('Predictor')
@Controller('predictor')
export class PredictorController {
  constructor(private readonly predictorService: PredictorService) {}

  @Get()
  @ApiOperation({
    summary: 'Predict college admissions based on exam and rank',
    description:
      'Returns colleges where your rank falls within historical cutoff ranges, with admission chance categorization (HIGH/MEDIUM/LOW/REACH)',
  })
  predict(@Query() dto: PredictDto) {
    return this.predictorService.predict(dto);
  }
}
