import type { Post } from "@/@types/blog";
import { useState } from "react";

interface Props {
  posts: Post[];
}

export default function BlogList({ posts }: Props) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? posts.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false)
        );
      })
    : posts;

  return (
    <div>
      <div
        className="border-border-light bg-background-secondary mb-6 flex items-center gap-2 rounded-sm border px-3 py-2 sm:gap-3 sm:px-4 sm:py-3"
        role="search"
      >
        <span
          className="text-foreground-muted shrink-0 font-mono text-xs select-none sm:text-sm"
          aria-hidden="true"
        >
          $ grep -i
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search posts..."
          aria-label="Search blog posts"
          className="text-primary placeholder:text-foreground-muted min-w-0 flex-1 border-none bg-transparent font-mono text-xs outline-none sm:text-sm"
        />
        {query && (
          <span className="text-foreground-muted shrink-0 font-mono text-xs">
            {filtered.length} match{filtered.length !== 1 ? "es" : ""}
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-foreground-muted font-mono text-sm italic">
          {query
            ? `grep: no matches for '${query}'`
            : "No posts yet. Stay tuned."}
        </p>
      ) : (
        <ul className="space-y-4" style={{ listStyle: "none", padding: 0 }}>
          {filtered.map((post) => (
            <li key={post.id}>
              <a
                href={`/blog/${post.id}`}
                className="group border-border bg-surface hover:border-primary block rounded-sm border p-4 no-underline transition-colors duration-300 sm:p-6"
              >
                <span className="text-foreground-muted mb-1 block font-mono text-[0.8rem] font-normal select-none">
                  {post.formattedDate}
                </span>
                <span className="text-primary group-hover:text-primary-light mb-2 block text-xl font-semibold sm:text-2xl">
                  {post.title}
                </span>
                {post.description && (
                  <span className="text-foreground-secondary block text-sm font-normal">
                    {post.description}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
