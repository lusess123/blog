import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import fs from 'fs'
import path, { join } from 'path'
import { getList, formatDateString } from "../../util/file-util"
import './day.scss'

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
        <div className="article-container">
            <Link href="/" className="back-link">
                返回首页
            </Link>
            <ReactMarkdown
                className="markdown-here-wrapper"
                components={{"img": ImageComponent as any}}
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
            >
                {xd}
            </ReactMarkdown>
        </div>
    )
}

function ImageComponent(props: any) {
    // console.log('ImageComponent:', props)
    
    return <Image {...props}  priority className='mx-auto'  alt={props.src} style={{width:"auto"}} height={500} width={500} />
}
  

export async function generateStaticParams() {
     return await getList()
}





