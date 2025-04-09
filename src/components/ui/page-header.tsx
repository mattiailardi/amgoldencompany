
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  backLink?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  backLink,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex justify-between items-center mb-6", className)}>
      <div className="flex flex-col">
        {backLink && (
          <Link to={backLink}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2 text-gold hover:text-gold-600 hover:bg-gold-100/10 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Indietro
            </Button>
          </Link>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gold">{title}</h1>
          {description && <p className="text-white/70 mt-1">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export default PageHeader;
