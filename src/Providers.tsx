import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import { BusinessProfileProvider } from "./context/BusinessProfileContext";

const Providers = () => {
  return (
    <SessionProvider>
      <BusinessProfileProvider>
        <Outlet />
      </BusinessProfileProvider>
    </SessionProvider>
  );
};

export default Providers;
