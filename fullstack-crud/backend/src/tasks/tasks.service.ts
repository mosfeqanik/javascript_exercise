import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Business logic lives here; the controller only deals with HTTP.
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepo.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  create(dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepo.create(dto);
    return this.tasksRepo.save(task);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.tasksRepo.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tasksRepo.delete(id);
    if (!result.affected) throw new NotFoundException(`Task ${id} not found`);
  }
}
