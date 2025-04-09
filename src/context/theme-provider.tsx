
import React, { createContext, useContext, useEffect } from "react";

type Theme = "default"; // We can add more themes in the future if needed

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "default",
}: ThemeProviderProps) {
  // Apply theme CSS variables
  useEffect(() => {
    document.documentElement.classList.add(defaultTheme);
    
    // Ensure our custom styling is applied
    document.documentElement.style.setProperty("--background", "354 76% 57%");
    document.documentElement.style.setProperty("--foreground", "0 0% 100%");
    document.documentElement.style.setProperty("--primary", "51 100% 50%");
    document.documentElement.style.setProperty("--primary-foreground", "0 0% 20%");
    document.documentElement.style.setProperty("--cmr", "0 100% 27%");
    document.documentElement.style.setProperty("--cmr-foreground", "0 0% 100%");
    document.documentElement.style.setProperty("--border", "51 100% 50%");
    
    return () => {
      document.documentElement.classList.remove(defaultTheme);
    };
  }, [defaultTheme]);

  const value = {
    theme: defaultTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
