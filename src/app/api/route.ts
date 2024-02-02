import axios from 'axios';

export async function GET(request: Request) {

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
