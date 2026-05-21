import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/Markdown.module.css";
import type { ComponentProps, JSX } from "react";
import { default as MD } from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import "@/styles/CodeHighlight.css";

type MarkdownProps = ComponentProps<typeof MD>;

export function Markdown({
  allowedElements,
  allowElement,
  disallowedElements,
  components,
  skipHtml,
  urlTransform,
  unwrapDisallowed,
  children,
}: MarkdownProps): JSX.Element {
  const { isDarkMode } = useTheme();

  return (
    <div className={styles.markdownBody} data-theme={isDarkMode ? "dark" : "light"}>
      <MD
        allowedElements={allowedElements}
        allowElement={allowElement}
        disallowedElements={disallowedElements}
        components={components}
        skipHtml={skipHtml}
        urlTransform={urlTransform}
        unwrapDisallowed={unwrapDisallowed}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypePrism]}
      >
        {children}
      </MD>
    </div>
  );
}
