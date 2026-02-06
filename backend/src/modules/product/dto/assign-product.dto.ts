import { IsString, IsNotEmpty } from 'class-validator';

export class AssignProductDto {
  @IsString()
  @IsNotEmpty()
  storeId: string;
}
