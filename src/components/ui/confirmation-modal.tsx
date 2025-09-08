"use client";

import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { AlertTriangle, Edit, Trash2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  variant?: 'edit' | 'delete';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  variant = 'edit'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (variant) {
      case 'delete':
        return <Trash2 className="h-5 w-5 text-destructive" />;
      case 'edit':
        return <Edit className="h-5 w-5 text-primary" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-[hsl(var(--success))]" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'delete':
        return 'destructive';
      case 'edit':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {message}
          </p>
          <div className="flex gap-2 justify-end">
            <Button onClick={onClose} variant="outline">
              {cancelText}
            </Button>
            <Button onClick={handleConfirm} variant={getConfirmButtonVariant()}>
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
