import { cn } from "../../utils/cn";

export default function Avatar({ name, src, size = "md", className }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg", xl: "h-20 w-20 text-xl" };
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return <img src={src} alt={name} className={cn("rounded-full object-cover", sizes[size], className)} />;
  }

  return (
    <div
      className={cn(
        "rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center",
        sizes[size],
        className
      )}
    >
      {initials || "?"}
    </div>
  );
}

export function ProfileCard({ name, role, email, avatar }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
      <Avatar name={name} src={avatar} size="lg" />
      <div>
        <h3 className="font-semibold text-slate-900">{name}</h3>
        {role && <p className="text-sm text-slate-500">{role}</p>}
        {email && <p className="text-sm text-primary">{email}</p>}
      </div>
    </div>
  );
}
