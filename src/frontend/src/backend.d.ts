import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Article {
    id: bigint;
    title: string;
    content: string;
    date: Time;
    tags: Array<string>;
    author: string;
    imageUrl: string;
    viewCount: bigint;
    excerpt: string;
    category: string;
}
export type Time = bigint;
export interface backendInterface {
    addComment(articleId: bigint, author: string, text: string): Promise<void>;
    createArticle(title: string, excerpt: string, content: string, category: string, author: string, imageUrl: string, tags: Array<string>): Promise<bigint>;
    getArticlesByCategory(category: string): Promise<Array<Article>>;
    getPopularArticles(): Promise<Array<Article>>;
    incrementViewCount(articleId: bigint): Promise<void>;
}
