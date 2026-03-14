import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

const categories = [
  "قرآن و حدیث",
  "اسلامی تاریخ",
  "تصوف و روحانیت",
  "معاشرہ و ثقافت",
  "اخلاقی رہنمائی",
];

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      {/* Islamic ornament banner */}
      <div className="h-1" style={{ background: "var(--gold)" }} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-3">
              <div>
                <div className="font-urdu font-bold text-2xl leading-tight">
                  مجلہ اسلام
                </div>
                <div className="text-sm opacity-70 font-urdu">
                  اسلامی علوم و معارف
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="font-urdu font-bold text-xl">م</span>
              </div>
            </div>
            <p className="text-sm opacity-80 font-urdu leading-relaxed">
              یہ ویب سائٹ اسلامی علوم، تاریخ اور روحانیت کے موضوعات پر معیاری
              مضامین فراہم کرتی ہے۔
            </p>
          </div>

          {/* Categories */}
          <div className="text-right">
            <h3 className="font-urdu font-bold text-lg mb-4 gold-text">
              زمرہ جات
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to="/category/$name"
                    params={{ name: cat }}
                    className="font-urdu text-sm opacity-80 hover:opacity-100 hover:text-accent-foreground transition-opacity"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div className="text-right">
            <h3 className="font-urdu font-bold text-lg mb-4 gold-text">
              رابطہ
            </h3>
            <p className="text-sm opacity-80 font-urdu mb-4">
              اسلامی مضامین اور علمی مواد کے لیے ہمارے ساتھ رہیں۔
            </p>
            <div className="text-sm opacity-60 font-urdu">
              <p>ای میل: info@majlah-islam.com</p>
              <p className="mt-1">واٹس ایپ: 92-300-0000000+</p>
            </div>
          </div>
        </div>

        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
        >
          <p className="text-sm opacity-60 font-urdu">
            تمام حقوق محفوظ ہیں © {year} مجلہ اسلام
          </p>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm opacity-60 hover:opacity-100 transition-opacity font-sans-clean"
          >
            Built with{" "}
            <Heart
              className="h-3.5 w-3.5 fill-current"
              style={{ color: "var(--gold)" }}
            />{" "}
            using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
