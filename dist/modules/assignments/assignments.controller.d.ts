import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    create(createAssignmentDto: CreateAssignmentDto): Promise<import("./entities/assignment.entity").Assignment>;
    findAll(): Promise<import("./entities/assignment.entity").Assignment[]>;
    findOne(id: string): Promise<import("./entities/assignment.entity").Assignment>;
    update(id: string, updateAssignmentDto: UpdateAssignmentDto): Promise<import("./entities/assignment.entity").Assignment>;
    remove(id: string): Promise<import("./entities/assignment.entity").Assignment>;
}
