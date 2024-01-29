import fs from 'fs'
import path, { join } from 'path'
export async function getList() {
    const files = await getFilenames("./blogs/read-daily/")
    // console.log(files)
    return files.map((file) => {
        // const filename = "2023年11月.md";
        const regex = /(\d{4})年(\d{1,2})月\.md/;
        const newFormat = file.replace(regex, '$1$2');
        return { day: newFormat }
    })
}

/**
 * 异步获取指定目录下的所有文件名
 * @param {string} dirPath - 目录路径
 * @returns {Promise<string[]>} - 包含文件名的数组
 */
export async function getFilenames(dirPath: string) {
    try {
        const fullPath = path.join(process.cwd(), dirPath);
        const files = await fs.readdirSync(fullPath);
        return files;
    } catch (err) {
        throw new Error('Unable to scan directory: ' + err);
    }
}

export function formatDateString(dateString:string) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4);
  
    return `${year}年${month}月.md`;
}