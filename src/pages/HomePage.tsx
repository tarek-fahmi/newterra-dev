import React from "react";
import { Link } from "react-router-dom";
import { ChartBar, Rocket, ShieldAlert, User, Menu } from "lucide-react";

// Import shadcn components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/context/SessionContext";
import supabase from "@/supabase";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <div className="p-3 bg-zinc-100 rounded-full mb-4 text-black-600">
          {icon}
        </div>
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const LandingPage = () => {
  const { session } = useSession();
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="bg-gradient-to-r from-primary to-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">NewTerra</div>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  {session?.user ? (
                    <Button
                      variant="secondary"
                      className="text-primary hover:bg-card"
                      onClick={() => {
                        supabase.auth.signOut();
                      }}
                    >
                      Sign out
                    </Button>
                  ) : (
                    <Link to="/auth">
                      <Button
                        variant="secondary"
                        className="text-primary hover:bg-card"
                      >
                        Sign In
                      </Button>
                    </Link>
                  )}
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center py-16 gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">
                Empowering Smart Agriculture
              </h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Transform your farm operations with cutting-edge digital solutions for real-time monitoring, precision agriculture, and data-driven decision making.
              </p>
              <div className="flex space-x-4">
                <Button variant="secondary" asChild>
                  <Link to="/auth">Start Your Digital Farm Journey</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="bg-muted bg-opacity-30 border border-border border-opacity-50 rounded-xl h-64 md:h-80 w-full flex items-center justify-center">
                <p className="text-foreground">Smart Farm Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Why Choose NewTerra?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Rocket size={24} />}
              title="Real-Time Monitoring"
              description="Monitor your farm operations in real-time with integrated IoT sensors and automated data collection systems."
            />
            <FeatureCard
              icon={<ShieldAlert size={24} />}
              title="Compliance & Security"
              description="Automated compliance reporting and secure data management to meet regulatory requirements and protect your farm data."
            />
            <FeatureCard
              icon={<ChartBar size={24} />}
              title="Precision Agriculture"
              description="Optimize crop yields and resource allocation with advanced analytics, forecasting, and precision farming technologies."
            />
            <FeatureCard
              icon={<User size={24} />}
              title="Expert Support"
              description="Dedicated agricultural technology specialists providing 24/7 support and guidance for your farming operations."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="bg-muted rounded-xl h-64 md:h-80 w-full flex items-center justify-center text-muted-foreground">
                Agricultural Technology Solutions
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-primary">
                About NewTerra
              </h2>
              <p className="text-muted-foreground mb-4">
                Based in Camperdown, New South Wales, NewTerra is a leading digital business information systems integrator specializing in tailored solutions for farmers and agricultural businesses across Australia.
              </p>
              <p className="text-muted-foreground mb-6">
                We focus on enhancing farm operational efficiency through real-time monitoring, precision agriculture technologies, and integrated digital platforms that enable crop yield optimization, resource allocation, and comprehensive financial management.
              </p>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <Link to="/about">Learn About Our Mission</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            What Our Farmers Say
          </h2>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground mb-4">
                  "NewTerra's integrated digital platform transformed our farming operations completely. We've seen a 35% increase in crop yields and significantly reduced resource waste through their precision agriculture solutions."
                </p>
                <div className="flex items-center">
                  <Avatar>
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      MW
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-bold text-primary">Michael Williams</p>
                    <p className="text-muted-foreground">Owner, Williams Family Farm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NewTerra</h3>
              <p className="text-muted-foreground">Empowering Smart Agriculture Through Digital Innovation</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Solutions</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/solutions/precision-agriculture"
                    className="text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    Precision Agriculture
                  </Link>
                </li>
                <li>
                  <Link
                    to="/solutions/farm-monitoring"
                    className="text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    Farm Monitoring
                  </Link>
                </li>
                <li>
                  <Link
                    to="/solutions/compliance-reporting"
                    className="text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    Compliance Reporting
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/blog"
                    className="text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    Agricultural Insights
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guides"
                    className="text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    Implementation Guides
                  </Link>
                </li>
                <li>
                  <Link
                    to="/webinars"
                    className="text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    Farm Tech Webinars
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-muted" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} NewTerra. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary-foreground transition-colors"
              >
                {/* Social Icon 1 */}
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary-foreground transition-colors"
              >
                {/* Social Icon 2 */}
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary-foreground transition-colors"
              >
                {/* Social Icon 3 */}
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary-foreground transition-colors"
              >
                {/* Social Icon 4 */}
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
