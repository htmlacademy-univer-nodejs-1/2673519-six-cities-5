import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { Amenity, amenities, HousingType, housingTypes } from '../../../types/index.js';

export class UpdateOfferDto {
    @IsOptional()
    @IsString()
    @Length(10, 100)
      title?: string;

    @IsOptional()
    @IsString()
    @Length(20, 1024)
      description?: string;

    @IsOptional()
    @IsString()
      preview?: string;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(6)
    @ArrayMaxSize(6)
    @IsString({ each: true })
      images?: string[];

    @IsOptional()
    @IsBoolean()
      isPremium?: boolean;

    @IsOptional()
    @IsBoolean()
      isFavorite?: boolean;

    @IsOptional()
    @IsIn(housingTypes)
      housingType?: HousingType;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(8)
      roomsCount?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(10)
      guestsCount?: number;

    @IsOptional()
    @IsInt()
    @Min(100)
    @Max(100000)
      price?: number;

    @IsOptional()
    @IsArray()
    @IsIn(amenities, { each: true })
      amenities?: Amenity[];
}
