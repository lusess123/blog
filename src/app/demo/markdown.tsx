import React, { useEffect, PropsWithChildren, useState } from 'react'
import markdownToHtml from './markdownToHtml'
import './markdown.scss'

export default function MarkDown({ children }: PropsWithChildren) {
    const [html, setHtml] = useState<string>('')
  useEffect(()=> {
      (async () => {
        const html = await markdownToHtml(children as string)
        setHtml(html)
      })()
  }, [children])
    return (
        <div className='markdown' dangerouslySetInnerHTML={{__html: html}}>
        </div>
    )
}
