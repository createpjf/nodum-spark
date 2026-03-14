import { useState } from "react";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useT } from "@/i18n/LanguageContext";

const CopyCodeButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useT();
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors text-[11px]"
      aria-label={t("copy")}
    >
      {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
      <span>{copied ? t("copied") : t("copy")}</span>
    </button>
  );
};

interface TextBlockProps {
  content: string;
  isStreaming?: boolean;
}

const TextBlock = ({ content, isStreaming }: TextBlockProps) => {
  return (
    <div className="min-w-0 max-w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeStr = String(children).replace(/\n$/, "");
            if (match || codeStr.includes("\n")) {
              return (
                <div className="my-2 rounded-xl overflow-x-auto border border-white/5">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#1E1E2C] text-[11px] text-zinc-400 font-mono">
                    <span>{match?.[1] || "code"}</span>
                    <CopyCodeButton code={codeStr} />
                  </div>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match?.[1] || "text"}
                    PreTag="div"
                    customStyle={{ margin: 0, borderRadius: 0, fontSize: "12.5px", padding: "12px 14px" }}
                  >
                    {codeStr}
                  </SyntaxHighlighter>
                </div>
              );
            }
            return (
              <code className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono text-[12px] break-all">
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-2 rounded-lg border border-border/40">
                <table className="min-w-full text-[13px] border-collapse">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-border/40 px-3 py-2 bg-muted/40 font-semibold text-left text-[12px]">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="border-b border-border/20 px-3 py-1.5 last:border-0">{children}</td>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-[3px] border-primary/40 pl-3 text-muted-foreground italic my-2">
                {children}
              </blockquote>
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-0.5 mb-2 ml-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-0.5 mb-2 ml-1">{children}</ol>;
          },
          h1({ children }) {
            return <h1 className="text-[17px] font-bold mb-2 mt-3 first:mt-0">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-[15px] font-bold mb-1.5 mt-3 first:mt-0">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-[13px] font-semibold mb-1 mt-2 first:mt-0">{children}</h3>;
          },
          strong({ children }) {
            return <strong className="font-semibold">{children}</strong>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-[2px] h-[14px] bg-foreground/60 ml-0.5 align-middle animate-pulse" />
      )}
    </div>
  );
};

export default TextBlock;
