import { Role } from "@/app/generated/prisma/enums";
import { getRoleColors } from "@/lib/roleUtils";
import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: Role | string;
  className?: string;
}

/**
 * Role badge component with gradient styling based on role
 */
export function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  const colors = getRoleColors(role);

  return (
    <Badge
      className={`bg-gradient-to-r ${colors.gradient} text-white px-3 py-1 text-sm font-semibold ${className}`}
    >
      {role}
    </Badge>
  );
}
