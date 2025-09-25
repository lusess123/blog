import React from 'react'
import { getList, formatDateString } from '../util/file-util'
import './page.scss'
import Link from 'next/link'

function convertDate(input: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const year = input.substring(0, 4);
  const monthIndex = parseInt(input.substring(4, 6), 10) - 1; // 月份索引（从0开始）

  if (monthIndex < 0 || monthIndex > 11) {
    return "Invalid month"; // 如果月份无效
  }

  const month = months[monthIndex];
  return `${month} ${year}`;
}

// const result = convertDate("201602");
// console.log(result); // 输出: "Feb 2016"


export default async function Home() {
  const list = await getList()
  return (
    <div className="container">
      <h1 className="page-title">Zyking'S 每日阅读</h1>

      <div className="blog-list">
        {list.sort((a, b) => parseInt(b.day) - parseInt(a.day)).map((item, index) => {
          const isRecent = index < 3; // Mark first 3 posts as recent/featured
          return (
            <article key={item.day} className={`blog-card ${isRecent ? 'featured' : ''}`}>
              <div className="blog-date">{convertDate(item.day)}</div>
              <Link href={`/${item.day}`} className="blog-title">
                {formatDateString(item.day).replace(".md", "")}
              </Link>
              <div className="read-more">阅读文章</div>
            </article>
          )
        })}

        {list.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <div className="empty-title">暂无文章</div>
            <div className="empty-description">还没有发布任何文章，请稍后再来查看。</div>
          </div>
        )}
      </div>
    </div>
  )

}