import type { IApi } from "umi"
import build from "./utils/buidl"

// umi build将dist目录压缩为dist.zip
export default (api: IApi) => {
  // See https://umijs.org/docs/guides/plugins
  api.describe({
    key: "UmiPluginBuildZip",
  })
  // 构建完成生成dist目录后，执行压缩命令
  api.onBuildHtmlComplete(() => {
    build(api)
    console.log("build dist zip is success")
  })
}
