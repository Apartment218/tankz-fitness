import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

type CardContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

type CardFooterProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function mergeClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={mergeClasses(
        "rounded-2xl border border-zinc-200 bg-white shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={mergeClasses(
        "border-b border-zinc-200 px-6 py-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: CardTitleProps) {
  return (
    <h2
      className={mergeClasses(
        "text-xl font-black tracking-tight text-zinc-950",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={mergeClasses(
        "mt-1 text-sm leading-6 text-zinc-600",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  return (
    <div
      className={mergeClasses("p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={mergeClasses(
        "border-t border-zinc-200 px-6 py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}