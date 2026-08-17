import { TooltipProvider } from "@radix-ui/react-tooltip";
import ThemeProvider from "@/providers/theme";

const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
};

export default Providers;
