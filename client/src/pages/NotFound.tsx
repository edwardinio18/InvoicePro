import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="text-2xl font-medium mt-2 mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 text-center">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFound;
