import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubtaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['TODO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'])
  status?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'URGENT'])
  priority?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubtaskDto)
  subtasks?: CreateSubtaskDto[];
}
