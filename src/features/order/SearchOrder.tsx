import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";

function SearchOrder() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query) return;

    navigate(`/order/${query}`);
    setQuery("");
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        className="w-28 rounded-full bg-yellow-100 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:ring focus:ring-yellow-500/50 focus:outline-none sm:w-64 sm:focus:w-72"
        id="search-order-input"
        placeholder="Search order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}

export default SearchOrder;
