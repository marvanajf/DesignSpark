import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface FeatureBreadcrumbsProps {
  crumbs: BreadcrumbItem[];
}

export default function FeatureBreadcrumbs({ crumbs }: FeatureBreadcrumbsProps) {
  return (
    <div className="flex items-center text-sm text-muted-foreground overflow-auto py-2">
      {crumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          )}
          {index === crumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-[#74d1ea] transition-colors">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}