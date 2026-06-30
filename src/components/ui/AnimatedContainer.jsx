import { cn } from "../../utils/cn";

export default function AnimatedContainer({ children, className, delay = 0 }) {
  return (
    <div className={cn("animate-fade-in-up", className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
