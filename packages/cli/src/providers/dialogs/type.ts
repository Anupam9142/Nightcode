import type { ReactNode } from "react";

export type DialogOptions = {
  title: string;
  children: ReactNode;
};

export type DialogContextValue = {
  open: (options: DialogOptions) => void;
  close: () => void;
};
