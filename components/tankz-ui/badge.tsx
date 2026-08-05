import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

function mergeClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getVariantClasses(variant: BadgeVariant) {
  switch (variant) {
    case "success":
      return "bg-emerald-100 text-emerald-800";

    case "warning":
      return "bg-amber-100 text-amber-800";

    case "danger":
      return "bg-red-100 text-red-800";

    case "info":
      return "bg-blue-100 text-blue-800";

    case "primary":
      return "bg-red-600 text-white";

    case "neutral":
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

export function Badge({
  children,
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={mergeClasses(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide",
        getVariantClasses(variant),
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function getStatusBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case "ACTIVE":
    case "PAID":
    case "ATTENDED":
      return "success";

    case "PAUSED":
    case "PENDING":
    case "CONFIRMED":
    case "WAITLISTED":
      return "warning";

    case "CANCELLED":
    case "FAILED":
    case "NO_SHOW":
    case "SUSPENDED":
      return "danger";

    case "REFUNDED":
      return "info";

    case "EXPIRED":
    case "INACTIVE":
    default:
      return "neutral";
  }
}