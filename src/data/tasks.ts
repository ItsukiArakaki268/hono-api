export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export const tasks: Task[] = [
  {
    id: 1,
    title: "Study Hono",
    completed: false,
  },
  {
    id: 2,
    title: "Running",
    completed: true,
  },
];

export const generatedId = (): number => {
  return tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
};
