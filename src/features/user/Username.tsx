import { useAppSelector } from "../../hooks";
import { getUsername } from "./userSlice";

function Username() {
  const username = useAppSelector(getUsername);
  if (!username) return null;

  return (
    <div className="hidden text-sm font-semibold md:block">{username}</div>
  );
}

export default Username;
