import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { Button } from "@/components/ui/button";
import supabase from "@/supabase";
import { useEffect, useState } from "react";

// Enum for onboarding status
enum OnboardingStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED"
}

export const DashboardPage = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>(OnboardingStatus.NOT_STARTED);
  const [loading, setLoading] = useState(true);

  // Fetch onboarding status when component mounts
  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      if (!session?.user) return;

      try {
        // Query Supabase for onboarding status
        const { data, error } = await supabase
          .from('onboarding')
          .select('status')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching onboarding status:', error);
        } else if (data) {
          setOnboardingStatus(data.status as OnboardingStatus);
        }
      } catch (error) {
        console.error('Error in onboarding status fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingStatus();
  }, [session]);

  // Function to get button text based on onboarding status
  const getOnboardingButtonText = () => {
    switch (onboardingStatus) {
      case OnboardingStatus.NOT_STARTED:
        return "Begin Onboarding Now →";
      case OnboardingStatus.IN_PROGRESS:
        return "Continue Onboarding →";
      case OnboardingStatus.SUBMITTED:
        return "We're reviewing your application";
      case OnboardingStatus.COMPLETED:
        return "Congratulations, your onboarding is complete!";
      default:
        return "Begin Onboarding Now →";
    }
  };

  // Function to handle onboarding button click
  const handleOnboardingClick = () => {
    if (onboardingStatus === OnboardingStatus.NOT_STARTED ||
      onboardingStatus === OnboardingStatus.IN_PROGRESS) {
      navigate('/onboarding');
    }
  };

  // Render onboarding screen if not completed
  if (!loading && onboardingStatus !== OnboardingStatus.COMPLETED) {
    return (
      <main className="bg-background text-foreground min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Let's get started, Woodsy</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Complete your onboarding to access NewTerra services and tools.
          </p>

          {(onboardingStatus === OnboardingStatus.NOT_STARTED || onboardingStatus === OnboardingStatus.IN_PROGRESS) ? (
            <Button
              asChild
              className="text-xl py-6 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/onboarding">
                {getOnboardingButtonText()}
              </Link>
            </Button>
          ) : (
            <Button
              disabled
              className="text-xl py-6 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {getOnboardingButtonText()}
            </Button>
          )}

          {onboardingStatus === OnboardingStatus.SUBMITTED && (
            <p className="mt-4 text-muted-foreground">
              We're reviewing your application as fast as we can. Please check back when your onboarding has been completed.
            </p>
          )}

          <div className="mt-8">
            <p className="text-sm text-muted-foreground">Logged in as: <span className="text-foreground font-medium">{session?.user.email || "None"}</span></p>
            <Button
              onClick={() => {
                supabase.auth.signOut().then(() => {
                  navigate("/");
                });
              }}
              className="mt-4 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Regular dashboard view for completed onboarding
  return (
    <main className="bg-background text-foreground min-h-screen p-4 flex max-w-3xl mx-auto flex-col gap-4 mt-10">
      <h1 className="text-3xl font-bold text-primary">Hi Woodsy, Welcome to NewTerra.</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Empowering your agricultural business with cutting-edge digital tools for data-driven decision making,
        enhanced productivity, and sustainable farming practices.
      </p>
      <div className="bg-card border border-border rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3 text-primary">Your Farm Dashboard</h2>
        <p className="text-muted-foreground mb-4">
          Access real-time monitoring, precision agriculture technologies, and integrated digital platforms
          designed specifically for farmers and agricultural businesses.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-muted p-4 rounded-md border border-border">
            <h3 className="font-medium text-foreground">Crop Yield Optimization</h3>
            <p className="text-sm text-muted-foreground">Monitor and enhance your crop performance</p>
          </div>
          <div className="bg-muted p-4 rounded-md border border-border">
            <h3 className="font-medium text-foreground">Resource Management</h3>
            <p className="text-sm text-muted-foreground">Optimize allocation and reduce waste</p>
          </div>
          <div className="bg-muted p-4 rounded-md border border-border">
            <h3 className="font-medium text-foreground">Financial Insights</h3>
            <p className="text-sm text-muted-foreground">Track profitability and costs</p>
          </div>
          <div className="bg-muted p-4 rounded-md border border-border">
            <h3 className="font-medium text-foreground">Compliance Reporting</h3>
            <p className="text-sm text-muted-foreground">Automated regulatory compliance</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">Logged in as: <span className="text-foreground font-medium">{session?.user.email || "None"}</span></p>
      <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
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

export default DashboardPage;
