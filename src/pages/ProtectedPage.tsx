import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { Button } from "@/components/ui/button";
import supabase from "@/supabase";

const ProtectedPage = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  return (
    <main className="bg-background text-foreground min-h-screen p-4 flex max-w-3xl mx-auto flex-col gap-4 mt-10">
      <h1 className="text-3xl font-bold text-primary">This is a Protected Page</h1>
      <p className="text-slate">Current User : {session?.user.email || "None"}</p>
      <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link className="home-link" to="/">
          ◄ Home
        </Link>
      </Button>
      <Button
        onClick={() => {
          supabase.auth.signOut().then(() => {
            navigate("/");
          });
        }}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        Sign Out
      </Button>
    </main>
  );
};

export default ProtectedPage;
