import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

// Same rules as create, but every field optional -> perfect for PATCH.
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
