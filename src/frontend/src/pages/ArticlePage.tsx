import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import { Calendar, Check, Copy, Eye, MessageSquare, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Article } from "../backend.d";
import ArticleCard from "../components/ArticleCard";
import {
  formatUrduDate,
  useAddComment,
  useIncrementViewCount,
  usePopularArticles,
} from "../hooks/useQueries";

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      className="reading-progress"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
}

function parseContent(
  content: string,
): { type: "h2" | "blockquote" | "p"; text: string }[] {
  return content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ")) {
        return { type: "h2" as const, text: trimmed.slice(3) };
      }
      if (trimmed.startsWith("> ")) {
        return { type: "blockquote" as const, text: trimmed.slice(2) };
      }
      return { type: "p" as const, text: trimmed };
    })
    .filter((b) => b.text.length > 0);
}

function TableOfContents({ content }: { content: string }) {
  const blocks = parseContent(content);
  const headings = blocks.filter((b) => b.type === "h2");

  if (headings.length === 0) return null;

  return (
    <div
      className="bg-muted/50 border border-border rounded-xl p-5 mb-8"
      data-ocid="article.toc_panel"
    >
      <h3 className="font-urdu font-bold text-base text-foreground mb-3 text-right">
        فہرست مضامین
      </h3>
      <ol className="space-y-2 text-right">
        {headings.map((h, i) => (
          <li key={h.text}>
            <a
              href={`#heading-${i}`}
              className="font-urdu text-sm text-primary hover:underline"
            >
              {i + 1}. {h.text}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ArticleContent({ content }: { content: string }) {
  const blocks = parseContent(content);
  let headingIndex = 0;

  return (
    <div className="article-content urdu-text">
      {blocks.map((block, i) => {
        if (block.type === "h2") {
          const idx = headingIndex++;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: heading index needed for anchor IDs
            <h2 key={i} id={`heading-${idx}`}>
              {block.text}
            </h2>
          );
        }
        if (block.type === "blockquote") {
          // biome-ignore lint/suspicious/noArrayIndexKey: static article content blocks
          return <blockquote key={i}>{block.text}</blockquote>;
        }
        // biome-ignore lint/suspicious/noArrayIndexKey: static article content blocks
        return <p key={i}>{block.text}</p>;
      })}
    </div>
  );
}

export default function ArticlePage() {
  const { id } = useParams({ from: "/article/$id" });
  const { data: articles, isLoading } = usePopularArticles();
  const addComment = useAddComment();
  const incrementViewCount = useIncrementViewCount();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);
  const viewCountIncremented = useRef(false);

  const article: Article | undefined = articles?.find(
    (a) => a.id.toString() === id,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: only track article, not mutate fn
  useEffect(() => {
    if (article && !viewCountIncremented.current) {
      viewCountIncremented.current = true;
      incrementViewCount.mutate(article.id);
    }
  }, [article]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to top on article id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      toast.success("لنک کاپی ہو گیا!");
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) {
      toast.error("براہ کرم اپنا نام اور تبصرہ لکھیں۔");
      return;
    }
    if (article) {
      addComment.mutate(
        { articleId: article.id, author: commentAuthor, text: commentText },
        {
          onSuccess: () => {
            setComments((prev) => [
              ...prev,
              {
                id: Date.now(),
                author: commentAuthor,
                text: commentText,
                date: new Date().toLocaleDateString("ur-PK"),
              },
            ]);
            setCommentAuthor("");
            setCommentText("");
            toast.success("آپ کا تبصرہ شامل ہو گیا۔");
          },
        },
      );
    }
  };

  const relatedArticles =
    articles
      ?.filter(
        (a) => a.id.toString() !== id && a.category === article?.category,
      )
      .slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-8"
        data-ocid="article.loading_state"
      >
        <ReadingProgressBar />
        <div className="max-w-4xl mx-auto">
          <Skeleton className="aspect-[16/7] w-full rounded-2xl mb-8" />
          <Skeleton className="h-10 w-3/4 ml-auto mb-4" />
          <Skeleton className="h-5 w-1/2 ml-auto mb-8" />
          <div className="space-y-4">
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-5 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div
        className="container mx-auto px-4 py-16 text-center"
        data-ocid="article.error_state"
      >
        <p className="font-urdu text-xl text-muted-foreground">
          مضمون نہیں ملا۔
        </p>
        <Link
          to="/"
          className="font-urdu text-primary hover:underline mt-4 inline-block"
        >
          واپس ہوم پیج
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ReadingProgressBar />

      <article>
        {/* Hero Image */}
        <div className="relative h-64 sm:h-96 lg:h-[500px] overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-10">
            <Badge
              className="mb-3 font-urdu"
              style={{ background: "var(--gold)", color: "#000" }}
            >
              {article.category}
            </Badge>
            <h1 className="font-urdu font-bold text-white text-2xl sm:text-4xl lg:text-5xl urdu-heading leading-tight">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Article Meta */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-end gap-4 sm:gap-6 text-sm text-muted-foreground font-urdu">
              <div className="flex items-center gap-2">
                <span>{formatUrduDate(article.date)}</span>
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <span>{article.viewCount.toString()} مرتبہ دیکھا</span>
                <Eye className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <span>{article.author}</span>
                <User className="h-4 w-4" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                data-ocid="article.share.button"
                className="font-urdu"
              >
                {copied ? (
                  <Check className="h-4 w-4 ml-2" />
                ) : (
                  <Copy className="h-4 w-4 ml-2" />
                )}
                {copied ? "کاپی ہو گیا" : "لنک شیئر"}
              </Button>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <TableOfContents content={article.content} />
              <ArticleContent content={article.content} />

              {article.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2 justify-end">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted rounded-full text-sm font-urdu text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <Separator className="my-8" />

              <div className="bg-muted/40 border border-border rounded-xl p-6 text-right">
                <div className="flex items-center gap-4 justify-end">
                  <div>
                    <h4 className="font-urdu font-bold text-foreground">
                      {article.author}
                    </h4>
                    <p className="font-urdu text-sm text-muted-foreground mt-1">
                      اسلامی موضوعات کے ماہر قلم کار
                    </p>
                  </div>
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary text-primary-foreground font-urdu text-lg">
                      {article.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <Separator className="my-8" />

              <section>
                <h3 className="font-urdu font-bold text-xl text-foreground mb-6 text-right flex items-center justify-end gap-2">
                  <span>تبصرے</span>
                  <MessageSquare className="h-5 w-5 text-primary" />
                </h3>

                <form
                  onSubmit={handleCommentSubmit}
                  className="bg-card border border-border rounded-xl p-6 mb-6"
                >
                  <h4 className="font-urdu font-semibold text-foreground mb-4 text-right">
                    تبصرہ لکھیں
                  </h4>
                  <div className="space-y-4">
                    <Input
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      placeholder="آپ کا نام"
                      className="font-urdu text-right"
                      data-ocid="article.comment.input"
                    />
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="اپنا تبصرہ لکھیں..."
                      rows={4}
                      className="font-urdu text-right resize-none"
                    />
                    <div className="flex justify-start">
                      <Button
                        type="submit"
                        disabled={addComment.isPending}
                        data-ocid="article.comment.submit_button"
                        className="font-urdu"
                      >
                        {addComment.isPending
                          ? "شامل ہو رہا ہے..."
                          : "تبصرہ شامل کریں"}
                      </Button>
                    </div>
                  </div>
                </form>

                <AnimatePresence>
                  {comments.length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground font-urdu"
                      data-ocid="article.comment.empty_state"
                    >
                      ابھی کوئی تبصرہ نہیں۔ پہلے تبصرہ کریں!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment, i) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-card border border-border rounded-xl p-5 text-right"
                          data-ocid={`article.comment.item.${i + 1}`}
                        >
                          <div className="flex items-center justify-end gap-3 mb-3">
                            <div>
                              <p className="font-urdu font-semibold text-foreground">
                                {comment.author}
                              </p>
                              <p className="text-xs text-muted-foreground font-urdu">
                                {comment.date}
                              </p>
                            </div>
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary font-urdu">
                                {comment.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <p className="font-urdu text-foreground leading-relaxed">
                            {comment.text}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </section>
            </div>

            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-muted/50 border border-border rounded-xl p-5">
                  <h3 className="font-urdu font-bold text-sm text-foreground mb-3 text-right">
                    اس مضمون میں
                  </h3>
                  <div className="space-y-2 text-right">
                    {parseContent(article.content)
                      .filter((b) => b.type === "h2")
                      .map((h, i) => (
                        <a
                          key={h.text}
                          href={`#heading-${i}`}
                          className="block font-urdu text-xs text-muted-foreground hover:text-primary transition-colors py-1"
                        >
                          {h.text}
                        </a>
                      ))}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="w-full font-urdu"
                    data-ocid="article.share.button"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 ml-2" />
                    ) : (
                      <Copy className="h-4 w-4 ml-2" />
                    )}
                    {copied ? "کاپی" : "شیئر"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-urdu font-bold text-2xl text-foreground urdu-heading text-right mb-8">
              متعلقہ مضامین
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((a, index) => (
                <ArticleCard
                  key={a.id.toString()}
                  article={a}
                  ocid={`article.related.item.${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
