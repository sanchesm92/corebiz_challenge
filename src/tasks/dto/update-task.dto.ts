import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Complete the project',
    description:
      'The title of the task. This field allows you to update the task title if necessary.',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Complete the project by the end of the month',
    description:
      'A detailed description of the task. This field is optional and can be used to modify the existing description.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '08/20/2024',
    description:
      'The new due date for the task in the format MM/DD/YYYY. This can be updated if the deadline changes.',
  })
  @IsString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    description:
      'The current status of the task. Options include "PENDING", "IN_PROGRESS", and "COMPLETED". Use this field to update the task status.',
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
