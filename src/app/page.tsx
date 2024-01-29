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
    <div>
       <div className='text-center mt-9   page-title text-3xl font-bold '>Zyking 每日阅读</div>

    <section className="info-list gray">
     
      <ul className="news-list">
        {
          list.sort((a, b) => parseInt(b.day) - parseInt(a.day)).map((item) => {
            return <li key={item.day} className="determine-hover enable-hover" data-type="article">
              <a className="history-link" title="Article One Headline" href="#">
                <div className="canvas-background">
                  <div className="stalker-wrap"></div>
                </div>
                <div className="gradient-hover gradient-1"></div>
                <div className="constrain">
                  <span className="date">{convertDate(item.day)}</span>
                 
                  <p> <Link href={`/${item.day}`}>{formatDateString(item.day).replace(".md", "")}</Link></p>
                </div>
                <div className="gradient-hover gradient-2"></div>
              </a>
            </li>
          })
        }
      </ul>
    </section>
    </div>
  )

}