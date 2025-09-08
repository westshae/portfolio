"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { X, AlertTriangle, Mail } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail: string;
  isLoading?: boolean;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
  isLoading = false,
}: DeleteAccountModalProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const requiredText = userEmail && userEmail.length > 0 ? userEmail : "DELETE";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmationText(value);
    setIsConfirmed(value === requiredText);
  };

  const handleConfirm = () => {
    if (isConfirmed) onConfirm();
  };

  const handleClose = () => {
    setConfirmationText("");
    setIsConfirmed(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Delete Account
              </h2>
              <p className="text-sm text-gray-600">
                This action cannot be undone
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-red-800">
                  Warning: This will permanently delete your account
                </h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• All your habits and progress data</li>
                  <li>• Weekly summaries and statistics</li>
                  <li>• Account settings and preferences</li>
                  <li>• This action cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>

          {userEmail && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="h-4 w-4" />
              <span>{userEmail}</span>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="delete-confirmation" className="text-sm font-medium text-gray-900">
              {userEmail && userEmail.length > 0
                ? "To confirm, type your email address:"
                : "To confirm, type DELETE:"}
            </Label>
            <Input
              id="delete-confirmation"
              type="text"
              value={confirmationText}
              onChange={handleChange}
              placeholder={userEmail && userEmail.length > 0 ? "Enter your email address" : "Type DELETE"}
              disabled={isLoading}
              className={`bg-white border-gray-300 text-gray-900 ${isConfirmed ? "border-green-500 focus:border-green-500" : ""}`}
            />
            {confirmationText && !isConfirmed && (
              <p className="text-sm text-red-600">
                {userEmail && userEmail.length > 0 ? "Text does not match your email" : "Please type DELETE to confirm"}
              </p>
            )}
            {isConfirmed && (
              <p className="text-sm text-green-600">✓ Confirmation accepted</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </div>
            ) : (
              "Delete Account"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
