import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="main-container p-8 flex flex-col items-center justify-center min-h-screen">
        <h1 className="header-text text-4xl font-bold text-primary mb-6">404 Page Not Found</h1>
        <Link
          to="/"
          className="text-accent hover:text-accent/80 underline transition-colors duration-200"
        >
          Go back to Home
        </Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
