<div align="center">
<br>
<img width="200" src="https://raw.githubusercontent.com/Ezrea7/Rules/main/Icons/AppIcons/Image/IMG/DualSubs/YouTube.png">
<br>
<br>
<h1 align="center">Sur2b双语及增强字幕生成工具<h1>
</div>

# Sur2b

## 简介

YouTube 视频总结，字幕翻译脚本

## 功能

- 字幕翻译（Google、DeepL）
- 自定义字幕语言和位置
- 视频内容总结

## 手册

- Surge 配置
    - 安装模块：首页 → 修改 → 模块 → 安装新模块  → 输入[模块链接](https://www.notion.so/Sur2b-28623efaff9680609b0dcae24aed8061?pvs=21)
    
    <aside>
    💡 模块更新：首页 → 修改 → 模块 → 点击模块右侧 **•••** → 立即更新
    脚本更新：首页 → 左上角配置 → 外部资源 → 侧滑更新
    
    </aside>
    
- 捷径配置
    - 下载安装[捷径](https://www.notion.so/Sur2b-28623efaff9680609b0dcae24aed8061?pvs=21)
    - 配置 AI 总结的提示词
        
        ```
        Please use Chinese to summarize the video content based on the subtitles.
        
        Summary format:
        Video overview within 300 characters
        
        "time" "Key timeline summary within 50 characters"
        
        \/\/ Less than 8 key points, word count must strictly follow the rules
        
        {{subtitles}}
        ```
        
        可自行编辑提示词， `{{subtitles}}` 为字幕内容的位置，脚本会自动将字幕内容整理成如下格式以减少 Token 消耗
        
        ```
        (0:00) when I started this YouTube channel
        (0:01) I was making videos about film making uh
        (0:04) in my spare time something 
        (0:06) I was just learning myself at the time  
        (0:09) and I was just super excited to to share
        (0:12) what I was learning my experiences with the
        (0:41) I'm living the perfect life at least
        ......
        ```
        
    - 参照下方介绍配置其他参数
        
        
        | 字段 | 示例值 | 注释 |
        | --- | --- | --- |
        | `videoTranslation` | `true` | 是否开启字幕翻译功能 |
        | `translationProvider` | `Google` | 字幕翻译服务商，仅支持`Google`，`DeepL` |
        | `translationMaxMinutes` | `30` | 视频时长超过多少分钟后禁用翻译功能 |
        | `targetLanguage` | `zh-CN` | 翻译的目标语言（请参照[附录语言对照表](https://www.notion.so/Sur2b-28623efaff9680609b0dcae24aed8061?pvs=21)） |
        | `subLine` | `2` | 目标语言字幕的位置 `0`：覆盖原字幕，`1`：第一行，`2`：第二行 |
        | `deepLUrl` | `https://api.deepl.com/v2/translate` | DeepL 翻译接口链接，默认免费版接口，可空 |
        | `deepLAPIKey` | `0a1b2c3d-4e5f6g7h-8i9j-10k11l12m13n:fx` | DeepL 翻译接口 API Key |
        | `videoSummary` | `true` | 是否开启视频总结功能 |
        | `summaryMaxMinutes` | `20` | 视频时长超过多少分钟后禁用总结功能（**注意 Token 消耗**） |
        | `openAIProxyUrl` | `https://api.groq.com/openai/v1/chat/completions` | AI 总结接口链接 |
        | `openAIAPIKey` | `gsk_0a1b2c3d4e5f6g7h8i9j10k11l12m13n...` | AI 总结接口 API Key |
        | `openAIModel` | `moonshotai/kimi-k2-instruct-0905` | AI 总结接口模型 |
        | `summaryPrompts` |  | **请勿修改此项，此项为上方提示词的引用** |
        | `cacheMaxHours` | `72` | 已翻译/总结的结果缓存保留时长（小时），以减少重复翻译/总结 |
        | `delCache` | `false` | 是否立即清理已翻译/总结的结果缓存 |
    - 配置好参数后，运行一次捷径即可
    
    <aside>
    💡 捷径更新：重新下载安装
    
    </aside>
    
- 常见问题
    - 确保 Surge 的 MitM，脚本，模块功能正常开启
    - 确保 MitM 证书安装成功并信任
    - 如需修改配置，修改完参数后重新运行捷径即可
    - 如需立即清理缓存，将`delCache`修改为`true`后，运行捷径即可
    - 捷径运行报错：检查 Surge 配置，一般为对应功能未开启，MitM 设置问题 或 其他规则、重写、脚本、模块等影响
    - 简繁体互转不调用翻译接口，且翻译后字幕默认替换当前字幕，不会显示双语
    - 修改 `targetLanguage`，`subLine`等时建议同时清除缓存，否则会优先返回缓存结果
    - YouTube 自动生成的字幕暂不支持翻译（简繁体互转除外）

## 下载

- Surge 模块：👉[链接](https://raw.githubusercontent.com/Neurogram-R/Surge/refs/heads/master/module/Sur2b.sgmodule)
- 捷径：👉[安装](https://www.icloud.com/shortcuts/cb51b08d31a54f1184e81e72bad84039)

## 附录

[Google 翻译语言对照表](https://www.notion.so/Google-28623efaff9680e2ae42e2e1c92690b9?pvs=21) 

[DeepL 翻译语言对照表](https://www.notion.so/DeepL-28623efaff96809ca490e64bdf378069?pvs=21)

