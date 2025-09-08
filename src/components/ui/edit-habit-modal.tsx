"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Edit } from "lucide-react";

interface EditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  currentName: string;
}

export function EditHabitModal({
  isOpen,
  onClose,
  onSave,
  currentName
}: EditHabitModalProps) {
  const [editedName, setEditedName] = useState(currentName);

  useEffect(() => {
    if (isOpen) {
      setEditedName(currentName);
    }
  }, [isOpen, currentName]);

  const handleSave = () => {
    if (editedName.trim() && editedName.trim() !== currentName) {
      onSave(editedName.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setEditedName(currentName);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  const isNameChanged = editedName.trim() !== currentName && editedName.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white border border-gray-200 shadow-lg hover:bg-white hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Edit className="h-5 w-5 text-primary" />
            Edit Habit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Habit Name
            </label>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter habit name"
              className="w-full"
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={handleClose} variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!isNameChanged}
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
