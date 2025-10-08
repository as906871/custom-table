import { Home, User, Settings, Bell } from "lucide-react";

export const menuItems = [
  { label: "Task", icon: Home, path: "/" },
  { label: "Task1", icon: User, path: "/task1" },
  { label: "Task2", icon: Settings, path: "/task2" },
  { label: "Task3", icon: Bell, path: "/task3", badge: 3 },
];


export const COLUMN_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'file', label: 'File' },
  { value: 'single-select', label: 'Single Select' },
  { value: 'multi-select', label: 'Multi Select' },
];
