import Image from 'next/image'
// 提供插入md文档模板标签
import ReactMarkdown from 'react-markdown';
// 支持gfm语法 简单理解就是平时书写md文档的语法
import remarkGfm from 'remark-gfm';
// md文档所需要的样式，例如表格的线条等等
// import 'github-markdown-css';
import rehypeRaw from 'rehype-raw'
import fs from 'fs'
import path, { join } from 'path'
import { getList, formatDateString   } from "../../util/file-util"
import './day.scss'
import parse from 'html-react-parser';

export default function Home(props: any) {
    // console.log('props:', props)
    const file = formatDateString(props.params.day)
    let xd
    if (!(props?.params?.x)) {
        const mdPath = join(process.cwd(), 'blogs/read-daily/' + file)
        console.log('mdPath render:', mdPath)
        const md = fs.readFileSync(mdPath, 'utf8')
        // console.log('md:', md)
        xd = md.replaceAll('https://cdn.nlark.com', 'https://file.zyking.xyz/api?url=https://cdn.nlark.com')
    } else {
        xd = props?.params?.x
    }
    return (
        <div className='day-page'>
            <ReactMarkdown className="markdown-body"
                components={{"img": ImageComponent as any}}
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
                {xd}
            </ReactMarkdown>
        </div>
    )
}

function ImageComponent(props: any) {
    // console.log('ImageComponent:', props)
    
    return <Image {...props}  priority  alt={props.src} style={{width:"100%"}} height={500} width={500} />
}
  

export async function generateStaticParams() {
     return await getList()
}





