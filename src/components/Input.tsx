import { cn } from "../lib/utils";

export default function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
  className?: string;
}) {
  return <input className={cn("measurement-input", className)} {...props} />;
}
