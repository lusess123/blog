'use client'
import React, { useEffect, useRef } from 'react'
import { useRequest } from 'ahooks'
import axios from 'axios'
import './chat.scss'
import io from 'socket.io-client';
// import MarkDown from './markdown'
import markdownToHtml from './markdownToHtml'
import './markdown.scss'

function mergeAndAppendUniqueByKey(array1:any, array2: any) {
    // 创建一个 Map 用于存储两个数组中的元素
    let mergedMap = new Map();

    // 先添加 array2 的元素到 Map 中
    array2.forEach((item: any) => mergedMap.set(item[0], item));

    // 然后添加 array1 的元素，这将覆盖 array2 中相同键的元素
    array1.forEach((item:any) => mergedMap.set(item[0], item));

    // 将 Map 的值转换回数组形式
    return Array.from(mergedMap.values());
}

let a = 0


async function processArraySerial(item: any[]) {
    item[1] = await markdownToHtml(item[1])
    return item
}

async function processArrayMarkdown(array: any) {
    // 使用 map 将数组中的每个元素转换为一个处理它们的 Promise
    const promises = array.map(processArraySerial);

    // Promise.all 等待所有的 Promise 完成
    const results = await Promise.all(promises);

    // 返回处理后的结果数组
    return results;
}

const thinking = (text: any) => <div className="thinking">{text}<span>.</span><span>.</span><span>.</span><span>.</span><span>.</span></div>
const ItemDict = {
    thinking
}

export default function Chat() {

    const [data, setData] = React.useState<any[]>([[-1, 'Server Busy,Please waiting....', 'system']])
    const dataRef = useRef<any[]>(data)
    const elem = useRef<any>(null)
    const socketRef = useRef<any>(null)
    const textRef = useRef<any>(null)
    const shouldScroll = useRef<any>(true)
    const { data: respData, error: errorData } = useRequest(() => axios.get('https://demo.zyking.xyz/input'), {})

    useEffect(() => {
        // 监听自定义事件
        document.body.scrollTop = 0
        document.body.style.overflowY = 'hidden';
        const chatDiv = elem.current;
        chatDiv.scrollTop = chatDiv.scrollHeight;
        // markdownToHtml('## 你好').then(a=> console.log("markdownToHtml: ", a))
        if (respData) {
            // list.message = await processArrayMarkdown(list.message)

            const socket = socketRef.current = io('https://demo.zyking.xyz/chat'); // 这里的URL应该替换为你的服务器地址

            (async () => {
                const history = await processArrayMarkdown(respData?.data?.history)
                dataRef.current = history
                socket.on('connect', () => {
                    console.log('connected to socket server');

                });
                socket.on('append', async (list) => {
                    const chatDiv = elem.current;
                    const scroll = chatDiv.scrollTop + chatDiv.clientHeight - chatDiv.scrollHeight
                    shouldScroll.current = scroll >= -30 && scroll <= 30
                    list.message = await processArrayMarkdown(list?.message || [])
                    const newDaya = mergeAndAppendUniqueByKey((list.message), dataRef.current)
                    // const newDaya = [...dataRef.current, ...(list?.message || [])]
                    setData(newDaya)
                    dataRef.current = newDaya
                });
                socket.io.on("error", (error) => {
                    // alert('error')
                    const newDaya = [...dataRef.current, ['error' + a++, 'connect error', 'error', +new Date()]]
                    setData(newDaya)
                    dataRef.current = newDaya
                });
                socket.io.on("ping", () => {
                });
                socket.io.on("reconnect", (attempt) => {
                    // ...
                    const newDaya = [...dataRef.current, ['reconnect' + a++, 'reconnect ' + attempt, 'error', +new Date()]]
                    setData(newDaya)
                    dataRef.current = newDaya
                });
                shouldScroll.current = true
                setData(history)
                setTimeout(() => {
                    chatDiv.scrollTop = chatDiv.scrollHeight + 1000;
                }, 500)


            })()


            return () => {
                socket.disconnect()
                socket.close()
                // 监听自定义事件
                document.body.style.overflowY = 'visible';
            }
        } else {
            return () => {
                document.body.style.overflowY = 'visible';
            }
        }
    }, [respData])

    useEffect(() => {
        if (elem.current) {
            const chatDiv = elem.current;
            if (shouldScroll.current) {
                chatDiv.scrollTop = chatDiv.scrollHeight + 1000;
                shouldScroll.current = true
            }
        }
    }, [data])

    useEffect(() => {
        if (errorData) {
            const newDaya = [...dataRef.current, ['errorinput' + a + (+new Date()), 'Server error, please try again', 'error', +new Date()]]
            setData(newDaya)
            dataRef.current = newDaya
        }
    }, [errorData])



    function send() {
        const text = textRef.current.value
        if (text) {
            textRef.current.value = ""
            const id = 'message' + (a++) + (+ new Date())
            const askId = (id + '-user')
            const answer = id
            const newDaya = [...dataRef.current, [askId, text, 'user', +new Date()], [answer, '', 'thinking', +new Date()]]
            shouldScroll.current = true
            setData(newDaya)
            dataRef.current = newDaya
            socketRef.current.emit('message', text, (askId), answer);
        }
    }


    const history = data
    return <div className='page-demo-chat flex flex-col h-screen'>
        <div className='element'></div>
        <div className='flex-1 overflow-auto pb-[40px] pt-[12px] h-[100%]'>
            <ul className="chat-thread h-[100%] whitespace-normal " ref={ref => elem.current = ref}>
                {
                    history.map((item : any) => {
                        const name = (item[2])
                        const fun = ItemDict[name as "thinking"] 
                        return <li key={item[0]} className={' chat-thread-li ' + (item[2] === 'thinking' ? 'ai' : item[2])}>
                            <div className="avatar"></div>
                            {fun ? (fun(item[1])) : <div className='markdown' dangerouslySetInnerHTML={{ __html: item[1] }} />}
                            <div className="chat-bubble-arrow"></div>
                        </li>
                    })
                }
            </ul>
        </div>
        <div className='h-16 pb-40 flex justify-center items-center'>
            <div className="chat-window flex ">
                <input
                    onCompositionStart={(e : any) => {
                        e.target["composing"] = true
                    }}
                    onCompositionEnd={(e: any) => {
                        e.target["composing"] = false
                    }}
                    onKeyDown={(event: any) => {
                        if (event.key === 'Enter' && !event.target["composing"]) {
                            send()
                        }
                    }} ref={ref => textRef.current = ref} className="chat-window-message" name="chat-window-message" type="text" autoComplete="off" autoFocus />
                <button onClick={send} className="bg-zeroai-green  text-white font-bold py-2 px-4 rounded shadow-lg">
                    Send
                </button>
            </div>
        </div>
    </div>
}