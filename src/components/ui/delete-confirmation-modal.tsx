"use client";

import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  habitName: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  habitName
}: DeleteConfirmationModalProps) {
  const [typedName, setTypedName] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (typedName === habitName) {
      onConfirm();
      onClose();
      setTypedName("");
    }
  };

  const handleClose = () => {
    onClose();
    setTypedName("");
  };

  const isNameMatch = typedName === habitName;

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white border border-gray-200 shadow-lg hover:bg-white hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Habit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This action cannot be undone. To confirm deletion, type the habit name:
          </p>
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="font-medium text-gray-900">&quot;{habitName}&quot;</p>
          </div>
          <Input
            placeholder="Type the habit name to confirm"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2 justify-end">
            <Button onClick={handleClose} variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              variant="destructive"
              disabled={!isNameMatch}
            >
              Delete Habit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
