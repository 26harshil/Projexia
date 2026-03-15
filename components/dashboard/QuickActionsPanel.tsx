"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  gradient: string;
}

interface QuickActionsPanelProps {
  actions: QuickAction[];
}

/**
 * Quick actions panel for dashboard
 * Displays action buttons with gradient styling
 */
export function QuickActionsPanel({ actions }: QuickActionsPanelProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            className={`bg-gradient-to-r ${action.gradient} hover:opacity-90 text-white justify-start gap-2`}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
