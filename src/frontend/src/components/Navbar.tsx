import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useState } from "react";

const categories = [
  "قرآن و حدیث",
  "اسلامی تاریخ",
  "تصوف و روحانیت",
  "معاشرہ و ثقافت",
  "اخلاقی رہنمائی",
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-xs">
      {/* Top bar with branding */}
      <div className="bg-primary text-primary-foreground py-1.5">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <span className="text-xs font-urdu opacity-80">
            ﷽ بسم اللہ الرحمن الرحیم
          </span>
          <span className="text-xs font-urdu opacity-70">
            {new Date().toLocaleDateString("ur-PK", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            data-ocid="nav.home_link"
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-urdu font-bold text-lg">
                م
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="font-urdu font-bold text-xl text-primary leading-tight urdu-heading">
                مجلہ اسلام
              </div>
              <div className="text-xs text-muted-foreground font-urdu">
                اسلامی علوم و معارف
              </div>
            </div>
          </Link>

          {/* Desktop categories */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => (
              <Link
                key={cat}
                to="/category/$name"
                params={{ name: cat }}
                className="px-3 py-1.5 text-sm font-urdu text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
              >
                {cat}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="h-9 w-9"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-ocid="nav.dark_mode_toggle"
              className="h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="py-3 flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="تلاش کریں..."
                  className="font-urdu text-right"
                  data-ocid="search.input"
                  autoFocus
                />
                <Button
                  type="submit"
                  size="sm"
                  data-ocid="search.submit_button"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to="/category/$name"
                  params={{ name: cat }}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 font-urdu text-right text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
