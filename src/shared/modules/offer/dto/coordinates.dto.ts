import { IsNumber } from 'class-validator';

export class CoordinatesDto {
  @IsNumber()
  public latitude: number;

  @IsNumber()
  public longitude: number;
}
