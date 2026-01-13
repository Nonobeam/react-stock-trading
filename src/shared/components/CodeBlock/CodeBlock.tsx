/**
 * CodeBlock - Display code with syntax highlighting
 */

import './CodeBlock.css';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  onCopy?: () => void;
}

export function CodeBlock({ code, language = 'text', title, onCopy }: CodeBlockProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    onCopy?.();
  };

  return (
    <div className="code-block">
      {title && (
        <div className="code-block-header">
          <span className="code-block-title">{title}</span>
          <span className="code-block-language">{language}</span>
        </div>
      )}
      <div className="code-block-content">
        <pre>
          <code className={`language-${language}`}>{code}</code>
        </pre>
        <button className="code-block-copy" onClick={handleCopy} title="Copy to clipboard">
          📋
        </button>
      </div>
    </div>
  );
}
