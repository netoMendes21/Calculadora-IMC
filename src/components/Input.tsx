import { cn } from "../lib/utils";

export default function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={cn(
        `block w-full border border-rose-400 rounded p-3`,
        className
      )}
      {...props}
    />
  );
}
