import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost";

type ButtonSize = "sm" | "md" | "lg";

type SharedButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

type NativeButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = SharedButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type ButtonProps = NativeButtonProps | LinkButtonProps;

function mergeClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function getVariantClasses(variant: ButtonVariant) {
  switch (variant) {
    case "secondary":
      return "bg-zinc-900 text-white hover:bg-zinc-800";

    case "outline":
      return "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100";

    case "danger":
      return "bg-red-700 text-white hover:bg-red-800";

    case "ghost":
      return "bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950";

    case "primary":
    default:
      return "bg-red-600 text-white hover:bg-red-700";
  }
}

function getSizeClasses(size: ButtonSize) {
  switch (size) {
    case "sm":
      return "min-h-9 px-3 py-2 text-xs";

    case "lg":
      return "min-h-12 px-6 py-3.5 text-base";

    case "md":
    default:
      return "min-h-10 px-4 py-2.5 text-sm";
  }
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
  } = props;

  const classes = mergeClasses(
    "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    getVariantClasses(variant),
    getSizeClasses(size),
    fullWidth && "w-full",
    className,
  );

  if ("href" in props && typeof props.href === "string") {
    const {
      href,
      children: linkChildren,
      variant: _variant,
      size: _size,
      fullWidth: _fullWidth,
      className: _className,
      ...linkProps
    } = props;

    return (
      <Link
        href={href}
        className={classes}
        {...linkProps}
      >
        {linkChildren}
      </Link>
    );
  }

  const {
    children: buttonChildren,
    variant: _variant,
    size: _size,
    fullWidth: _fullWidth,
    className: _className,
    href: _href,
    type = "button",
    ...buttonProps
  } = props;

  return (
    <button
      type={type}
      className={classes}
      {...buttonProps}
    >
      {buttonChildren}
    </button>
  );
}