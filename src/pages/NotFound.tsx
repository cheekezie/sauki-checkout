import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-6">
        {/* Center content vertically */}
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">
            404
          </h1>
          <p className="mb-4 text-2xl font-bold text-gray-800">
            We can't seem to find the page you are looking for
          </p>
          <p className="mb-4 text-lg font-light text-gray-500">
            The page you're looking for might have been moved, deleted, or doesn't exist.
          </p>
          <div className="flex mx-auto justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="rounded-[50px] w-[140px] p-2 px-4 bg-primary text-white whitespace-nowrap hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

