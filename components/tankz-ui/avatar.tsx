type AvatarProps = {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
};

export function Avatar({
  firstName,
  lastName,
  size = "md",
}: AvatarProps) {
  const initials =
    `${firstName[0] ?? ""}${lastName[0] ?? ""}`;

  const sizes = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-lg",
    lg: "h-20 w-20 text-3xl",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-red-600 font-black text-white ${sizes[size]}`}
    >
      {initials}
    </div>
  );
}