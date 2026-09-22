import type { ReactNode, MouseEventHandler } from "react";
import { Link } from "react-router";

type BaseButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  type: "primary" | "secondary" | "small" | "round";
};

type LinkButtonProps = BaseButtonProps & {
  to: string;
  onClick?: never;
};

type ClickButtonProps = BaseButtonProps & {
  to?: never;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type ButtonProps = LinkButtonProps | ClickButtonProps;

function Button({ children, disabled, to, type, onClick }: ButtonProps) {
  const base =
    "inline-block text-sm cursor-pointer rounded-full bg-yellow-400 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-yellow-300 focus:bg-yellow-300 focus:ring focus:ring-yellow-300 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed ";

  const styles = {
    primary: base + "px-4 py-3 md:px-6 md:py-4",
    small: base + "px-4 py-2 md:px-5 md:py-2.5 text-xs",
    round: base + "px-2.5 py-1 md:px-3.5 md:py-2 text-sm",
    secondary:
      "inline-block text-sm cursor-pointer rounded-full border-2 border-stone-300 px-4 py-2.5 font-semibold tracking-wide text-stone-400 uppercase transition-colors duration-300 hover:bg-stone-300 hover:text-stone-800 focus:bg-stone-300 focus:text-stone-800 focus:ring focus:ring-stone-200 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed md:px-6 md:py-3.5",
  } as const;

  if (to)
    return (
      <Link className={styles[type]} to={to}>
        {children}
      </Link>
    );

  if (onClick)
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        {children}
      </button>
    );
  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
}

export default Button;
