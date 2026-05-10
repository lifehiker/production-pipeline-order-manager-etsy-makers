export type IntakeFieldType =
  | "text"
  | "textarea"
  | "select"
  | "date"
  | "number"
  | "file";

export type IntakeField = {
  id: string;
  type: IntakeFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
};

export type WeeklyTarget = {
  weekStart: string;
  weekEnd: string;
  ordersTarget: number;
  itemsTarget: number;
  minutesTarget: number;
};
