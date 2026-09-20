import { Link, useNavigate } from "react-router";
import type { ReactNode } from "react";

type LinkButtonProps = {
  children: ReactNode;
  to: string;
};

function LinkButton({ children, to }: LinkButtonProps) {
  const navigate = useNavigate();
  const className =
    "cursor-pointer text-sm text-blue-500 hover:text-blue-600 hover:underline";

  if (to === "-1")
    return (
      <button className={className} onClick={() => navigate(-1)}>
        {children}
      </button>
    );
  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  );
}

export default LinkButton;
