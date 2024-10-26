export interface Task {
    id: number,
    user_id: number,
    labels: string,
    title: string,
    description: string,
    completed: 0 | 1,
    created_at: Date,
    updated_at: Date
}

export type CreateTaskReq = Pick<Task, 'title' | 'description'>;
export type UpdateTaskReq = CreateTaskReq & Pick<Task, 'id' | 'completed'>;