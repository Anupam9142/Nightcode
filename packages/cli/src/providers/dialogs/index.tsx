import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { useKeyboard } from "@opentui/react";
import { useTheme } from "../theme";

import type { DialogOptions, DialogContextValue } from "./type";

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog(): DialogContextValue {
  const value = useContext(DialogContext);
  if (!value) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return value;
}

type DialogProviderProps = {
  children: ReactNode;
};

export function DialogProvider({ children }: DialogProviderProps) {
  const [dialog, setDialog] = useState<DialogOptions | null>(null);

  const open = useCallback((options: DialogOptions) => {
    setDialog(options);
  }, []);

  const close = useCallback(() => {
    setDialog(null);
  }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      {dialog && <DialogOverlay title={dialog.title} onClose={close}>{dialog.children}</DialogOverlay>}
    </DialogContext.Provider>
  );
}

type DialogOverlayProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

function DialogOverlay({ title, children, onClose }: DialogOverlayProps) {
  const { colors } = useTheme();

  useKeyboard((key) => {
    if (key.name === "escape") {
      onClose();
    }
  });

  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <box
        backgroundColor={colors.dialogSurface}
        borderColor={colors.thinkingBorder}
        border={["single"]}
        paddingX={2}
        paddingY={1}
        width="60%"
        flexDirection="column"
        gap={1}
      >
        <text bold>{title}</text>
        {children}
      </box>
    </box>
  );
}
