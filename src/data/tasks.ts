export type Task = {
  id: string;
  title: string;
  competed: boolean;
};

export const tasks: Task[] = [
  {
    id: "1",
    title: "Study Hono",
    competed: false,
  },
  {
    id: "2",
    title: "Running",
    competed: true,
  },
];

export const generatedId = (): string => {
  return Date.now().toString();
};
