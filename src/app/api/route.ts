import { headers } from 'next/headers'
const url = 'https://cdn.nlark.com/yuque/0/2024/png/250863/1705629607336-42f66c5e-b57e-4450-acbf-9bb0fae59265.png?x-oss-process=image%2Fresize%2Cw_1088%2Climit_0'
// pages/api/image.js
import axios from 'axios';

export async function GET(request: Request) {
  // const res = new Response({
  //   hearders: {
  //     'Content-Type': 'image/jpeg',
  //     'Content-Length': 'response.headers["content-length"]'
  //   }
  // })
  // 图片的URL
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('url')
  const imageUrl = id!;

  // 发送请求下载图片
  const response = await axios({
    method: 'GET',
    url: imageUrl,
    responseType: 'arraybuffer'
  });

  return new Response(response.data as any, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': response.headers['content-length']
    }
  })
}
