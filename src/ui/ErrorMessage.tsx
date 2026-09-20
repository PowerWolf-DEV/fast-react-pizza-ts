import { useRouteError, isRouteErrorResponse } from "react-router";
import LinkButton from "./LinkButton";

function ErrorMessage() {
  const error = useRouteError();
  console.log(error);
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.statusText || String(error.data);
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{message}</p>
      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default ErrorMessage;
