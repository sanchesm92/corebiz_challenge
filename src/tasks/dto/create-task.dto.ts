import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Complete the project',
    description:
      'The title of the task. This should be a concise summary of the task to be completed.',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Complete the project by the end of the month',
    description:
      'A detailed description of the task. This field is optional and can provide additional context or instructions.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '08/20/2024',
    description:
      'The due date for the task in the format MM/DD/YYYY. This indicates the deadline for task completion.',
  })
  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    description:
      'The current status of the task. Possible values include "PENDING", "IN_PROGRESS", and "COMPLETED".',
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
