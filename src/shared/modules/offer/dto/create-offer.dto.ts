import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Length, Max, Min, ValidateNested } from 'class-validator';
import { Amenity, amenities, City, cities, HousingType, housingTypes } from '../../../types/index.js';
import { CoordinatesDto } from './coordinates.dto.js';

export class CreateOfferDto {
  @IsString()
  @Length(10, 100)
    title: string;

  @IsString()
  @Length(20, 1024)
    description: string;

  @IsOptional()
  @IsDateString()
    openDate: Date;

  @IsIn(cities)
    city: City;

  @IsString()
    preview: string;

  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
    images: string[];

  @IsOptional()
  @IsBoolean()
    isPremium?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
    rating?: number;

  @IsIn(housingTypes)
    housingType: HousingType;

  @IsInt()
  @Min(1)
  @Max(8)
    roomsCount: number;

  @IsInt()
  @Min(1)
  @Max(10)
    guestsCount: number;

  @IsInt()
  @Min(100)
  @Max(100000)
    price: number;

  @IsArray()
  @IsIn(amenities, { each: true })
    amenities: Amenity[];

  @IsOptional()
  @IsInt()
  @Min(0)
    commentsCount?: number;

  @ValidateNested()
  @Type(() => CoordinatesDto)
    coordinates: CoordinatesDto;
}
