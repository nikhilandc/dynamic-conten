/**
 * Lightweight Markdown → HTML renderer.
 * Supports: headings, bold, italic, inline code, code blocks,
 * unordered lists, ordered lists, blockquotes, links, horizontal rules.
 * No external dependencies needed.
 */
export const renderMarkdown = (md) => {
  if (!md) return '';

  let html = md
    // Escape HTML entities first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (``` ... ```)
  html = html.replace(/```([\s\S]*?)```/g, (_, code) =>
    `<pre class="md-pre"><code>${code.trim()}</code></pre>`
  );

  // Headings
  html = html
    .replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
    .replace(/^### (.+)$/gm,  '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm,   '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm,    '<h1 class="md-h1">$1</h1>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="md-quote">$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="md-hr" />');

  // Unordered lists
  html = html.replace(/^\* (.+)$/gm, '<li class="md-li">$1</li>');
  html = html.replace(/^- (.+)$/gm,  '<li class="md-li">$1</li>');
  html = html.replace(/(<li class="md-li">[\s\S]*?<\/li>)(\n(?!<li))/g, '$1</ul>\n');
  html = html.replace(/((?:^|(?<=\n))(?:<li class="md-li">))/g, '<ul class="md-ul">$1');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>');
  html = html.replace(/(<li class="md-oli">[\s\S]*?<\/li>)(\n(?!<li))/g, '$1</ol>\n');
  html = html.replace(/((?:^|(?<=\n))(?:<li class="md-oli">))/g, '<ol class="md-ol">$1');

  // Inline: bold, italic, inline code, links
  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold">$1</strong>')
    .replace(/__(.+?)__/g,     '<strong class="md-bold">$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em class="md-em">$1</em>')
    .replace(/_(.+?)_/g,       '<em class="md-em">$1</em>')
    .replace(/`(.+?)`/g,       '<code class="md-code">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="md-link" target="_blank" rel="noreferrer">$1</a>');

  // Paragraphs — wrap remaining lines
  html = html
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') ||
          trimmed.startsWith('<ol') || trimmed.startsWith('<li') ||
          trimmed.startsWith('<pre') || trimmed.startsWith('<blockquote') ||
          trimmed.startsWith('<hr')) return line;
      return `<p class="md-p">${line}</p>`;
    })
    .join('\n');

  return html;
};
