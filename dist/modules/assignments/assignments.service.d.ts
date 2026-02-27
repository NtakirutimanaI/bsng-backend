import { Repository } from 'typeorm';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
export declare class AssignmentsService {
    private assignmentsRepository;
    constructor(assignmentsRepository: Repository<Assignment>);
    create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment>;
    findAll(): Promise<Assignment[]>;
    findOne(id: string): Promise<Assignment>;
    update(id: string, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment>;
    remove(id: string): Promise<Assignment>;
}
