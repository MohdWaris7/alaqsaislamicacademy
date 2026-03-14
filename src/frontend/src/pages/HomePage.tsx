import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import ArticleCard from "../components/ArticleCard";
import Sidebar from "../components/Sidebar";
import { useArticlesByCategory, usePopularArticles } from "../hooks/useQueries";

const categories = [
  "قرآن و حدیث",
  "اسلامی تاریخ",
  "تصوف و روحانیت",
  "معاشرہ و ثقافت",
  "اخلاقی رہنمائی",
];

const SKELETON_KEYS_3 = ["sk-1", "sk-2", "sk-3"];
const SKELETON_KEYS_5 = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

function CategoryTabContent({ category }: { category: string }) {
  const { data: articles, isLoading } = useArticlesByCategory(category);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKELETON_KEYS_3.map((k) => (
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
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div
        className="text-center py-16 text-muted-foreground font-urdu"
        data-ocid="homepage.posts.empty_state"
      >
        اس زمرے میں ابھی کوئی مضمون نہیں ہے۔
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <motion.div
          key={article.id.toString()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ArticleCard
            article={article}
            ocid={`homepage.posts.item.${index + 1}`}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: articles, isLoading } = usePopularArticles();
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const featuredArticle = articles?.[0];
  const latestArticles = articles?.slice(1, 4) ?? [];
  const popularArticles = articles?.slice(0, 5) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern" />
        <div className="relative container mx-auto px-4 py-8 sm:py-12">
          {isLoading ? (
            <div
              className="rounded-2xl overflow-hidden"
              data-ocid="homepage.featured.card"
            >
              <Skeleton className="aspect-[21/9] w-full" />
            </div>
          ) : featuredArticle ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ArticleCard
                article={featuredArticle}
                variant="featured"
                ocid="homepage.featured.card"
              />
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* Ornament */}
      <div className="container mx-auto px-4">
        <div className="ornament-divider">
          <span className="text-2xl" style={{ color: "var(--gold)" }}>
            ❋
          </span>
        </div>
      </div>

      {/* Main Content + Sidebar */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            {/* Latest Articles */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/"
                  className="font-urdu text-sm text-primary hover:underline"
                >
                  مزید دیکھیں
                </Link>
                <h2 className="font-urdu font-bold text-2xl text-foreground urdu-heading">
                  تازہ ترین مضامین
                </h2>
              </div>

              {isLoading ? (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  data-ocid="homepage.posts.loading_state"
                >
                  {SKELETON_KEYS_3.map((k) => (
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
              ) : latestArticles.length === 0 ? (
                <div
                  className="text-center py-12 text-muted-foreground font-urdu"
                  data-ocid="homepage.posts.empty_state"
                >
                  ابھی کوئی مضمون موجود نہیں۔ جلد آ رہا ہے!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {latestArticles.map((article, index) => (
                    <motion.div
                      key={article.id.toString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <ArticleCard
                        article={article}
                        ocid={`homepage.posts.item.${index + 1}`}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Tabs */}
            <div>
              <h2 className="font-urdu font-bold text-2xl text-foreground urdu-heading text-right mb-6">
                زمرے کے مطابق
              </h2>
              <Tabs
                value={activeCategory}
                onValueChange={setActiveCategory}
                dir="rtl"
              >
                <TabsList className="h-auto flex-wrap gap-1 bg-muted p-1 mb-6 w-full justify-end">
                  {categories.map((cat) => (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      data-ocid="homepage.category.tab"
                      className="font-urdu text-sm px-3 py-1.5"
                    >
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {categories.map((cat) => (
                  <TabsContent key={cat} value={cat}>
                    <CategoryTabContent category={cat} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-urdu font-bold text-2xl text-foreground urdu-heading text-right mb-8">
            مقبول مضامین
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {SKELETON_KEYS_5.map((k) => (
                <Skeleton key={k} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {popularArticles.map((article, index) => (
                <motion.div
                  key={article.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <ArticleCard
                    article={article}
                    ocid={`homepage.posts.item.${index + 1}`}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
