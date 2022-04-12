import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {

    }

    getTasks(filterDto: GetTaskFilterDto,user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto,user);
    }

    async getTaskById(id: string,user:User): Promise<Task> {
        const found = await this.taskRepository.findOne({where:{id,user}});
        if (!found) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return found;
    }

    createTasks(createTaskDto: CreateTaskDto,user:User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto,user)
    }

    async deleteTask(id: string,user: User): Promise<void> {
        const result = await this.taskRepository.delete({id,user});

        if(result.affected === 0 ){
            throw new NotFoundException(`Task with id ${id} not found`);
        }
    }

    async updateTaskStatus(id:string, status:TaskStatus,user:User):Promise<Task>{
        const task = await this.getTaskById(id,user);
        task.status = status;
        await this.taskRepository.save(task);
        
        return task;
    }
}
