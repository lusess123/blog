import Image from 'next/image'
// 提供插入md文档模板标签
import ReactMarkdown from 'react-markdown';
// 支持gfm语法 简单理解就是平时书写md文档的语法
import remarkGfm from 'remark-gfm';
// md文档所需要的样式，例如表格的线条等等
import 'github-markdown-css';
import rehypeRaw from 'rehype-raw'
import fs from 'fs'
import { join } from 'path'

export default  function Home({ params : { x }} : any) {
  const mdPath  = join(process.cwd(), 'blogs/read-daily/2023年12月.md')
  console.log('mdPath:', mdPath)
  const md = fs.readFileSync(mdPath, 'utf8')
  console.log('md:', md)
  return (
      <div>
      <ReactMarkdown  className="markdown-body"
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[[remarkGfm,{ singleTilde: false }]]}>
        {md}
        </ReactMarkdown>
      </div>
  )
}

// export function generateStaticParams() {
//   const mdPath  = join(process.cwd(), 'blogs/read-daily/2023年12月.md')
//   console.log('xmdPath:', mdPath)
//   const md = fs.readFileSync(mdPath, 'utf8')
//   console.log('x:', md)
//   return [
//      {
//       x: md
//      }
//   ]
// }
