export function renderMarkdown(content: string): string {
  if (!content) return ""

  // Simple markdown parser - in production, consider using a library like marked or remark
  let html = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="font-heading text-lg text-accent mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-heading text-xl text-primary mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="font-heading text-2xl text-primary mb-4">$1</h1>')

    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Lists
    .replace(
      /^- (.*$)/gim,
      '<li class="flex items-start"><span class="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>$1</li>',
    )

    // Line breaks
    .replace(/\n\n/g, '</p><p class="font-body text-foreground leading-relaxed">')
    .replace(/\n/g, "<br>")

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith("<")) {
    html = `<p class="font-body text-foreground leading-relaxed">${html}</p>`
  }

  // Wrap lists in ul tags
  html = html.replace(/(<li[^>]*>.*?<\/li>)/gs, (match) => {
    return `<ul class="space-y-2 font-body text-foreground">${match}</ul>`
  })

  return html
}
