import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkMath from 'remark-math'
// import {read} from 'to-vfile'
import {unified} from 'unified'
import html from 'remark-html'

export default async function markdownToHtml(markdown: string) {
  // const result =  unified()
  // .use(markdown)
  // .use(latex)
  // .use(html).process(markdown)
  //  remark().use(latex).use(html).process(markdown)

  const result = await unified()
  .use(html)
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeStringify)
  .process(markdown)

  return result.toString()
}
