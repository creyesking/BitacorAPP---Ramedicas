export type Roles = 'SUSCRIPTOR' | 'ADMIN';

export interface Task {
  description: string;
  userId: number;
  time: number;
}

export interface TaskResponse extends Task {
  description: string;
  userId: number;
  id: number;
  createdAt: string;
  updatedAt: string;
  time: number;
}
