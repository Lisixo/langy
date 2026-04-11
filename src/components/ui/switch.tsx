export function Switch({
  value,
  size = 24,
  disabled,
  onChange,
}: {
  value: boolean;
  disabled?: boolean;
  size?: number;
  onChange: (state: boolean) => void;
}) {
  const padding = 4;
  return (
    <div
      className={`rounded-full transition-colors ${disabled ? "cursor-auto" : "cursor-pointer"} ${disabled ? "bg-accent/30" : value ? "bg-accent outline-accent" : "bg-zinc-800 outline-zinc-700"} outline `}
      style={{ height: size, width: size * 2 }}
      onClick={() => !disabled && onChange(!value)}
    >
      <div
        className={`h-full bg-white rounded-full transition-transform`}
        style={{
          height: size - padding * 2,
          width: size - padding * 2,
          margin: padding,
          transform: value ? `translateX(${size}px)` : undefined,
        }}
      ></div>
    </div>
  );
}