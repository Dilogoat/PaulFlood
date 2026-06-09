import { parseBiographyMarkdown, type BioInline } from "@/lib/content/render-biography";
import styles from "./bio-content.module.css";

function InlineNodes({ nodes }: { nodes: BioInline[] }) {
  return (
    <>
      {nodes.map((node, index) =>
        node.type === "link" ? (
          <a key={index} href={node.href} target="_blank" rel="noopener noreferrer">
            {node.label}
          </a>
        ) : (
          <span key={index}>{node.value}</span>
        )
      )}
    </>
  );
}

type BioContentProps = {
  biography: string;
};

export function BioContent({ biography }: BioContentProps) {
  const blocks = parseBiographyMarkdown(biography);

  return (
    <div className={styles.bioContent}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h3" : "h4";
          return (
            <Tag key={index} className={block.level === 2 ? styles.heading : styles.subheading}>
              {block.text}
            </Tag>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className={styles.list}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <InlineNodes nodes={item} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className={styles.paragraph}>
            <InlineNodes nodes={block.inlines} />
          </p>
        );
      })}
    </div>
  );
}
