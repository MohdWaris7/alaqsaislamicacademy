import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Mail, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePopularArticles } from "../hooks/useQueries";
import ArticleCard from "./ArticleCard";

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c"];

const categories = [
  { name: "قرآن و حدیث", icon: "📖", count: 12 },
  { name: "اسلامی تاریخ", icon: "🕌", count: 8 },
  { name: "تصوف و روحانیت", icon: "✨", count: 10 },
  { name: "معاشرہ و ثقافت", icon: "🤝", count: 7 },
  { name: "اخلاقی رہنمائی", icon: "💎", count: 9 },
];

const tags = [
  "قرآن",
  "حدیث",
  "نماز",
  "روزہ",
  "زکات",
  "حج",
  "ایمان",
  "اخلاق",
  "تصوف",
  "تاریخ",
  "خواتین",
  "صبر",
];

export default function Sidebar() {
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: articles, isLoading } = usePopularArticles();

  const recentArticles = articles?.slice(0, 4) ?? [];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("آپ کامیابی سے سبسکرائب ہو گئے!");
      setEmail("");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <aside className="space-y-6">
      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-urdu font-bold text-lg text-foreground mb-4 urdu-heading text-right">
          تلاش
        </h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 flex-shrink-0"
            data-ocid="search.submit_button"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="تلاش کریں..."
            className="font-urdu text-right flex-1"
            data-ocid="search.input"
          />
        </form>
      </div>

      {/* Categories */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-urdu font-bold text-lg text-foreground mb-4 urdu-heading text-right">
          زمرہ جات
        </h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.name}>
              <Link
                to="/category/$name"
                params={{ name: cat.name }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-sans-clean">
                  {cat.count}
                </span>
                <span className="font-urdu text-sm text-foreground group-hover:text-primary transition-colors">
                  {cat.icon} {cat.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-urdu font-bold text-lg text-foreground mb-4 urdu-heading text-right">
          حالیہ مضامین
        </h3>
        <div className="space-y-1">
          {isLoading
            ? SKELETON_KEYS.map((k) => (
                <div key={k} className="flex gap-3 p-3">
                  <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))
            : recentArticles.map((article) => (
                <ArticleCard
                  key={article.id.toString()}
                  article={article}
                  variant="compact"
                />
              ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-urdu font-bold text-lg text-foreground mb-4 urdu-heading text-right">
          ٹیگز
        </h3>
        <div className="flex flex-wrap gap-2 justify-end">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-muted rounded-full text-sm font-urdu text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div
        className="rounded-xl p-5 text-right"
        style={{
          background: "oklch(var(--primary))",
          color: "oklch(var(--primary-foreground))",
        }}
      >
        <div className="flex justify-end mb-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Mail className="h-5 w-5" />
          </div>
        </div>
        <h3 className="font-urdu font-bold text-lg mb-2">نیوز لیٹر</h3>
        <p className="font-urdu text-sm opacity-80 mb-4">
          نئے مضامین کی اطلاع ای میل پر پائیں
        </p>
        <form onSubmit={handleNewsletterSubmit} className="space-y-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="آپ کا ای میل"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-urdu text-right"
          />
          <Button
            type="submit"
            className="w-full font-urdu"
            style={{ background: "var(--gold)", color: "#000" }}
          >
            سبسکرائب کریں
          </Button>
        </form>
      </div>
    </aside>
  );
}
