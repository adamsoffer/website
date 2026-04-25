import { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "white" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-green text-white hover:bg-green-light hover:shadow-lg hover:shadow-green-bright/20 active:bg-green-dark disabled:bg-white/[0.06] disabled:text-fg-disabled disabled:hover:shadow-none",
  secondary:
    "border border-strong text-white hover:border-white/30 hover:bg-white/[0.06] active:bg-white/[0.10] disabled:border-hairline disabled:text-fg-disabled disabled:hover:bg-transparent",
  white:
    "bg-white text-black hover:bg-white/95 hover:shadow-lg hover:shadow-black/20 active:bg-white/90 disabled:bg-white/30 disabled:text-black/40 disabled:hover:shadow-none",
  ghost:
    "text-fg-strong hover:text-white hover:bg-white/[0.06] active:bg-white/[0.10] disabled:text-fg-disabled disabled:hover:bg-transparent",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3.5 text-xs rounded-md",
  md: "h-10 px-5 text-sm rounded-lg",
  lg: "h-12 px-6 text-base rounded-xl",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type AsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type AsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: AsLink | AsButton) {
  const {
    variant = "primary",
    size = "md",
    children,
    className = "",
    ...rest
  } = props;
  // Active scale + transition-all so the press feels tactile. Ring-based focus
  // instead of browser outline for branded affordance.
  const base = `inline-flex items-center justify-center gap-2 select-none font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-bright/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 motion-reduce:active:scale-100 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if ("href" in rest) {
    return (
      <a
        className={base}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={base}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
