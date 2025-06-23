"use client";

import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./toastnotification.module.css";

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.showToast;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const showToast = (msg: string) => {
    setMessage(msg);
    setOpen(false);
    setTimeout(() => setOpen(true), 10);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast.Provider swipeDirection="right">
        <AnimatePresence>
          {open && (
            <Toast.Root
              open={open}
              onOpenChange={setOpen}
              className={styles.toastRoot}
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Toast.Title className={styles.toastTitle}>
                  {message}
                </Toast.Title>
                <Toast.Close className={styles.toastClose}>×</Toast.Close>
              </motion.div>
            </Toast.Root>
          )}
        </AnimatePresence>
        <Toast.Viewport className={styles.toastViewport} />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
