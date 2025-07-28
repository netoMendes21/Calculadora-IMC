export default function Input({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="block w-full border border-rose-400 rounded p-3"
      {...props}
    />
  );
}
