import type { IApi } from "umi"
const path = require("path")
const fs = require("fs")
const JSZip = require("jszip")
const zip = new JSZip()

export default function build(api: IApi, fileName = "dist", output?: string) {
  // paths.absOutputPath，输出路径，默认是 ./dist
  if (!output) output = path.resolve(__dirname, api.paths.absOutputPath)
  fileName += ".zip"
  const makeZip = function () {
    const distPath: any = path.resolve(output)
    const readDir = function (zip: any, dirPath: any) {
      // 读取dist下的根文件目录
      const files = fs.readdirSync(dirPath)
      files.forEach((fileName: any) => {
        const fillPath = path.join(dirPath, "./", fileName)
        const file = fs.statSync(fillPath)
        // 如果是文件夹的话需要递归遍历下面的子文件
        if (file.isDirectory()) {
          const dirZip = zip.folder(fileName)
          readDir(dirZip, fillPath)
        } else {
          // 读取每个文件为buffer存到zip中
          zip.file(fileName, fs.readFileSync(fillPath))
        }
      })
    }
    const removeExistedZip = () => {
      const dest = path.join(distPath, "./" + fileName)
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest)
      }
    }
    const zipDir = function (distPath: any) {
      readDir(zip, distPath)
      zip
        .generateAsync({
          type: "nodebuffer", // 压缩类型
          compression: "DEFLATE", // 压缩算法
          compressionOptions: {
            // 压缩级别
            level: 9,
          },
        })
        .then((content: any) => {
          const dest = path.join(distPath, "../" + fileName)
          removeExistedZip()
          // 把zip包写到硬盘中，这个content现在是一段buffer
          fs.writeFileSync(dest, content)
        })
    }
    removeExistedZip()
    zipDir(distPath)
  }
  makeZip()
}
