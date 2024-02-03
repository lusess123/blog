// 引入GoogleGenerativeAI库
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from '@google/generative-ai';
const MODEL_NAME = "gemini-pro";
import { setGlobalDispatcher, ProxyAgent } from "undici"


if (process.env.https_proxy) {
    const dispatcher = new ProxyAgent({ uri: new URL(process.env.https_proxy!).toString() });
    setGlobalDispatcher(dispatcher);
    console.log("process.env.https_proxy", process.env.https_proxy)
}
let model: any, genAI: any
if (process.env.API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.API_KEY);
    model = genAI.getGenerativeModel({ model: MODEL_NAME });
}



// 异步函数GET来处理请求
export async function GET(request: Request) {
    // 确保环境变量中有API_KEY
    if (!process.env.API_KEY) {
        console.error("API_KEY is not defined in the environment variables.");
        return new Response("Internal Server Error", { status: 500 });
    }

    try {


        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
            ],
        });

        const { searchParams } = new URL(request.url);
        const ask = searchParams.get('ask');

        // 确保prompt不为空
        if (!ask) {
            console.error("Prompt is required.");
            return new Response("Bad Request: Prompt is required", { status: 400 });
        }

        const result = await chat.sendMessage(ask);
        const response = result.response;

        // 返回生成的文本
        return new Response(response.text(), { status: 200 });
    } catch (error) {
        // 异常处理
        console.error("Error occurred:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}


