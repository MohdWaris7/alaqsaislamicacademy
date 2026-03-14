import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import ArticleCard from "../components/ArticleCard";
import Sidebar from "../components/Sidebar";
import { useArticlesByCategory } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4"];

export default function CategoryPage() {
  const { name } = useParams({ from: "/category/$name" });
  const { data: articles, isLoading } = useArticlesByCategory(name);

  return (
    <div className="min-h-screen">
      {/* Category Header */}
      <div
        className="relative py-12 overflow-hidden"
        style={{ background: "oklch(var(--primary))" }}
      >
        <div className="absolute inset-0 islamic-pattern" />
        <div className="relative container mx-auto px-4 text-right">
          <div className="flex items-center justify-end gap-2 text-primary-foreground/60 text-sm font-urdu mb-3">
            <span>{name}</span>
            <ChevronRight className="h-4 w-4" />
            <Link
              to="/"
              className="hover:text-primary-foreground transition-colors"
            >
              ہوم
            </Link>
          </div>
          <h1 className="font-urdu font-bold text-3xl sm:text-4xl text-primary-foreground urdu-heading">
            {name}
          </h1>
          <p className="font-urdu text-primary-foreground/70 mt-2">
            {isLoading ? "لوڈ ہو رہا ہے..." : `${articles?.length ?? 0} مضامین`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                data-ocid="category.posts.loading_state"
              >
                {SKELETON_KEYS.map((k) => (
                  <div
                    key={k}
                    className="bg-card rounded-xl overflow-hidden border border-border"
                  >
                    <Skeleton className="aspect-[16/10] w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !articles || articles.length === 0 ? (
              <div
                className="text-center py-20 text-muted-foreground font-urdu"
                data-ocid="category.posts.empty_state"
              >
                <p className="text-xl mb-2">
                  اس زمرے میں ابھی کوئی مضمون نہیں ہے۔
                </p>
                <p className="text-sm">جلد نئے مضامین شامل کیے جائیں گے۔</p>
                <Link
                  to="/"
                  className="font-urdu text-primary hover:underline mt-4 inline-block"
                >
                  واپس ہوم پیج
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <ArticleCard
                      article={article}
                      ocid={`category.posts.item.${index + 1}`}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
