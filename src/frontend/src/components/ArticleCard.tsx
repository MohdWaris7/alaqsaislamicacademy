import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Calendar, Eye, User } from "lucide-react";
import type { Article } from "../backend.d";
import { formatUrduDate } from "../hooks/useQueries";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
  ocid?: string;
}

export default function ArticleCard({
  article,
  variant = "default",
  ocid,
}: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <Link
        to="/article/$id"
        params={{ id: article.id.toString() }}
        data-ocid={ocid}
        className="group block relative overflow-hidden rounded-2xl article-card cursor-pointer"
      >
        <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-8">
          <Badge
            className="mb-3 font-urdu text-xs"
            style={{ background: "var(--gold)", color: "#000" }}
          >
            {article.category}
          </Badge>
          <h2 className="font-urdu font-bold text-white text-xl sm:text-3xl leading-snug mb-3 urdu-heading">
            {article.title}
          </h2>
          <p className="font-urdu text-white/75 text-sm sm:text-base leading-relaxed line-clamp-2 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4 text-white/60 text-xs font-urdu flex-row-reverse">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {article.viewCount.toString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatUrduDate(article.date)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        to="/article/$id"
        params={{ id: article.id.toString() }}
        data-ocid={ocid}
        className="group flex gap-3 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-16 h-16 object-cover rounded-lg flex-shrink-0 order-last"
          loading="lazy"
        />
        <div className="flex-1 text-right">
          <h4 className="font-urdu text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-urdu">
            <Calendar className="h-3 w-3" />
            <span>{formatUrduDate(article.date)}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      to="/article/$id"
      params={{ id: article.id.toString() }}
      data-ocid={ocid}
      className="group block bg-card rounded-xl overflow-hidden border border-border article-card cursor-pointer"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5 text-right">
        <Badge
          className="mb-2 font-urdu text-xs"
          style={{
            background: "oklch(var(--primary) / 0.12)",
            color: "oklch(var(--primary))",
          }}
        >
          {article.category}
        </Badge>
        <h3 className="font-urdu font-bold text-foreground text-lg leading-snug mb-2 group-hover:text-primary transition-colors urdu-heading line-clamp-2">
          {article.title}
        </h3>
        <p className="font-urdu text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-start gap-3 text-xs text-muted-foreground font-urdu flex-row-reverse">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {article.author}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {article.viewCount.toString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
