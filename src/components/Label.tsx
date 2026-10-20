import type { LabelHTMLAttributes } from "react";

function Label({
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { children: React.ReactNode }) {
  return (
    <label className="field-label" {...props}>
      {children}
    </label>
  );
}

export default Label;
