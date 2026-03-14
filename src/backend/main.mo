import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

actor {
  module Article {
    public func compare(a1 : Article, a2 : Article) : Order.Order {
      Nat.compare(a2.viewCount, a1.viewCount);
    };
  };

  type Article = {
    id : Nat;
    title : Text;
    excerpt : Text;
    content : Text;
    category : Text;
    author : Text;
    date : Time.Time;
    imageUrl : Text;
    tags : [Text];
    viewCount : Nat;
  };

  type Comment = {
    articleId : Nat;
    author : Text;
    text : Text;
    date : Time.Time;
  };

  var nextArticleId = 6;

  let articles = Map.fromIter<Nat, Article>([
    (1, {
      id = 1;
      title = "قرآن کی روشنی";
      excerpt = "قرآن پاک کی بنیادی تعلیمات";
      content = "قرآن پاک ہمارا رہنما ہے...";
      category = "Quran & Hadith";
      author = "واثق";
      date = Time.now();
      imageUrl = "https://example.com/quran.jpg";
      tags = ["قرآن", "حدیث"];
      viewCount = 50;
    }),
    (2, {
      id = 2;
      title = "اسلامی تاریخ";
      excerpt = "اسلام کا آغاز";
      content = "اسلامی تاریخ بہت گہری ہے...";
      category = "Islamic History";
      author = "واثق";
      date = Time.now();
      imageUrl = "https://example.com/history.jpg";
      tags = ["تاریخ", "اسلام"];
      viewCount = 30;
    }),
    (3, {
      id = 3;
      title = "تصوف کیا ہے؟";
      excerpt = "روحانیت کی اہمیت";
      content = "تصوف روحانی ترقی کی ایک راہ ہے...";
      category = "Tasawwuf/Spirituality";
      author = "واثق";
      date = Time.now();
      imageUrl = "https://example.com/spirituality.jpg";
      tags = ["تصوف", "روحانیت"];
      viewCount = 20;
    }),
    (4, {
      id = 4;
      title = "معاشرتی اقدار";
      excerpt = "اسلام میں معاشرتی اصول";
      content = "اسلام معاشرتی نظم سکھاتا ہے...";
      category = "Society & Culture";
      author = "واثق";
      date = Time.now();
      imageUrl = "https://example.com/society.jpg";
      tags = ["معاشرت", "ثقافت"];
      viewCount = 15;
    }),
    (5, {
      id = 5;
      title = "اخلاقی رہنمائی";
      excerpt = "اچھے اخلاق کی اہمیت";
      content = "اچھے اخلاق مسلمان کی پہچان ہیں...";
      category = "Moral Guidance";
      author = "واثق";
      date = Time.now();
      imageUrl = "https://example.com/morality.jpg";
      tags = ["اخلاق", "رہنمائی"];
      viewCount = 10;
    }),
  ].values());

  let comments = Map.empty<Nat, List.List<Comment>>();

  public shared ({ caller }) func createArticle(title : Text, excerpt : Text, content : Text, category : Text, author : Text, imageUrl : Text, tags : [Text]) : async Nat {
    let id = nextArticleId;
    let article : Article = {
      id;
      title;
      excerpt;
      content;
      category;
      author;
      date = Time.now();
      imageUrl;
      tags;
      viewCount = 0;
    };
    articles.add(id, article);
    nextArticleId += 1;
    id;
  };

  public query ({ caller }) func getArticlesByCategory(category : Text) : async [Article] {
    articles.values().toArray().filter(
      func(article) { Text.equal(article.category, category) }
    );
  };

  public query ({ caller }) func getPopularArticles() : async [Article] {
    articles.values().toArray().sort();
  };

  public shared ({ caller }) func incrementViewCount(articleId : Nat) : async () {
    switch (articles.get(articleId)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) {
        let updatedArticle = {
          article with viewCount = article.viewCount + 1
        };
        articles.add(articleId, updatedArticle);
      };
    };
  };

  public shared ({ caller }) func addComment(articleId : Nat, author : Text, text : Text) : async () {
    let comment : Comment = {
      articleId;
      author;
      text;
      date = Time.now();
    };

    let existingComments = switch (comments.get(articleId)) {
      case (null) { List.empty<Comment>() };
      case (?commentList) { commentList };
    };

    existingComments.add(comment);
    comments.add(articleId, existingComments);
  };
};
