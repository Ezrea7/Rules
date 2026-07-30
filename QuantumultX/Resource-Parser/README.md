<div align="center">
<h1 align="center">Geo Location Checker
<br>QX 专用资源解析器<h1>
<p align="center" color="#6a737d"><p>
<h3 align="center">仅支持QuantumultX<h3>
<br>
</div>
<b>使用方式：</b>

编辑配置，[general]下填入 <b>resource_parser_url=</b> 所在行代码 <b></b>


```
resource_parser_url=https://raw.githubusercontent.com/Ezrea7/Script/main/QuantumultX/Resource-Parser/resource-parser.js
```


🤖 主要功能: 

❶ 将其它格式的⟦服务器订阅⟧解析成 𝐐𝐮𝐚𝐧𝐭𝐮𝐦𝐮𝐥𝐭 𝐗 格式

☑︎ 支持 𝐕2𝐫𝐚𝐲𝐍/𝗦𝗦(𝗥/𝗗)/𝗛𝗧𝗧𝗣(𝗦)/𝗧𝗿𝗼𝗷𝗮𝗻/𝐕𝐋𝗲𝐬𝐬/𝗤𝘂𝗮𝗻𝘁𝘂𝗺𝘂𝗹𝘁(𝗫)/𝗦𝘂𝗿𝗴𝗲/𝐂𝐥𝐚𝐬𝐡/𝐒𝐡𝐚𝐝𝐨𝐰𝐫𝐨𝐜𝐤𝐞𝐭/𝐋𝐨𝐨𝐧 格式

☑︎ 提供说明 1⃣️ 中的可选个性化参数(筛选、重命名 等)

❷ 𝗿𝗲𝘄𝗿𝗶𝘁𝗲(重写) & 𝗳𝗶𝗹𝘁𝗲𝗿(分流) 的 转换 & 筛选 

☑︎ 用于禁用/修改远程引用中某(几)项 𝗿𝗲𝘄𝗿𝗶𝘁𝗲/𝗵𝗼𝘀𝘁𝗻𝗮𝗺𝗲/𝗳𝗶𝗹𝘁𝗲𝗿

☑︎ 𝐒𝐮𝐫𝐠𝐞/𝐂𝐥𝐚𝐬𝐡 类型规则 𝗹𝗶𝘀𝘁 与 模块 𝐦𝐨𝐝𝐮𝐥𝐞 的解析使用

----------------------------------------------------------
0️⃣ 在 ⟦订阅链接⟧ 后加 "#" 使用, 不同参数用 "&" 连接 

⚠️ ☞ "你的订阅连接#emoji=1&tfo=1&in=香港+台湾"

❖ 本地资源片段引用, 请将参数如 "#in=xxx&out=yyy" 填入资源片段的第 ① 行

❖ 🚦 支持中文, "操作" 以下特殊字符时请先替换(URL-Encode) 🚦

  ∎ "+"⇒"%2B", 空格⇒"%20", "@"⇒"%40", "&"⇒"%26", "."⇒"\.", ","⇒"%2C"
  

1️⃣ ⟦𝐬𝐞𝐫𝐯𝐞𝐫 节点⟧ ➠ 参数说明:

⦿ emoji=1(国行设备用2)/-1, 添加/删除节点名内地区旗帜;

⦿ udp=1/-1, tfo=1/-1, 分别强制开启(关闭) 𝐮𝐝𝐩-𝐫𝐞𝐥𝐚𝐲/𝐟𝐚𝐬𝐭-𝐨𝐩𝐞𝐧;

⦿ uot=1, 开启 udp-over-tcp=true选项（仅限SS(R)）

⦿ cert=1/-1, 分别开启/关闭 𝐭𝐥𝐬 证书验证(默认关闭);

  ❖ csha/psha, tls-cert-sha256 以及 tls-pubkey-sha256 参数
  
  ❖ alpn, 指定over-tls类型节点的alpn参数
  
⦿ in, out, regex, regout 分别为 保留、删除、正则保留、正则删除 节点;

  ❖ in/out 仅对节点名匹配生效, 多参数(逻辑"或")用 "+", 逻辑"与"用 "." 表示;
  
  ❖ regex/regout 对节点的完整信息进行匹配(类型、端口、加密等);
  
  ❖ 示范: "in=香港.0\.2倍率+台湾&out=BGP&regex=iplc"
  
⦿ rename 重命名, "旧名@新名", "前缀@", "@后缀", 用 "+" 连接多个参数;

  ❖ 删除字段: "字段1.字段2☠️", 想删除 "." 时用 "\." 替代
  
  ❖ 示范: "rename=香港@𝐇𝐊+[𝐒𝐒]@+@[1𝐗]+流量.0\.2☠️"
  
  ❖ 默认 emoji 先生效, 如想调换顺序, 请用 rrname 参数
  
⦿ replace 正则替换节点中字段, 可用于重命名/更改加密方式等

  ❖ replace=regex1@𝘀𝘁𝗿1+regex2@𝘀𝘁𝗿2
  
⦿ ptn/npt=1-8, 将节点名英文/数字替换成样式 ⇒ 🅰/🄰/𝐀/𝗮/𝔸/𝕒/ᵃ/ᴬ, ①\❶\⓵\𝟙\¹\₁\𝟏\𝟷

⦿ delreg, 利用正则表达式来删除 "节点名" 中的字段(⚠️ 慎用)

⦿ aead=-1, 关闭 Vmess 的 AEAD 参数

⦿ host=xxx, 修改已有 host , 如要增加host，请用☠️结尾

⦿ obfs=vhttp/shttp, 指定 obfs=shadowsocks-http 或 obfs=vmess-http 的特殊需求

⦿ tsession=0/1/2, 0/1 代表关闭 tls-session-ticket/reuse，2 表示全部关闭

⦿ checkurl=xxx , 指定 server_check_url 参数

⦿ sort=1/-1/x/参数规则, 按节点名 正/逆/随机/参数规则 排序

  ❖ 参数规则是正则表达式或简单关键词, 用"<" 或 ">" 连接
  
  ❖ sort=🇭🇰>🇸🇬>🇯🇵>🇺🇸 , 靠前排序
  
  ❖ sort=IEPL<IPLC<BGP , 靠后排序
  
⦿ info=1, 开启通知提示机场 ✈️ 流量信息(如有提供);

⦿ flow=2022-06-02:1000:54, 订阅到期时间:总流量:已用流量

⦿ 占位符，可用于 rename/replace 等操作

  ❖ $type0/1/2/3/4/5/6/7 占位符，将节点类型(ss/ssr/vmess 等)作为可操作参数，如
  
    ∎ rename=@|$type2
    
    ∎ 样式分别为 "𝐬𝐬","𝐒𝐒","🅢🅢","🆂🆂","ⓢⓢ","🅂🅂","𝕊𝕊","ˢˢ"
    
  ❖ $index0/1/2/3/4/5/6/7/8 占位符，将节点的序号作为可操作参数，如
  
    ∎ rename=@「$index1」
    
    ∎ 样式分别为 1\①\❶\⓵\𝟙\¹\₁\𝟏\𝟷
    
  ❖ $emoji1/2 占位符, 将emoji(🇭🇰 等)作为可操作参数
  
    ∎ rename=@「$emoji1」
    
  ❖ $tag 占位符，将订阅的 tag 作为可操作参数，如
  
    ∎ 可接数字以单独给 tag 添加字母/数字样式
    
    ∎ rename=@「$tag34」, 样式同下边的 ptn/npt
    
⦿ ⟦进阶参数⟧: 𝘀𝗳𝗶𝗹𝘁𝗲𝗿/𝘀𝗿𝗲𝗻𝗮𝗺𝗲, 传入一段 base64 编码的脚本, 可用于更为复杂的[过滤/重命名] 需求

  ❖ 说明: https://github.com/KOP-XIAO/QuantumultX/pull/9
  

2⃣️ ⟦𝐫𝐞𝐰𝐫𝐢𝐭𝐞 重写⟧/⟦𝐟𝐢𝐥𝐭𝐞𝐫 分流⟧ ➠ 参数说明:

⦿ in, out, 根据关键词 保留/禁用 相关分流、重写规则;

⦿ inhn, outhn, “保留/删除”主机名(𝒉𝒐𝒔𝒕𝒏𝒂𝒎𝒆);

  ❖ 示范: 禁用 "淘宝比价" 及 "weibo" 的 js 同主机名
  
  𝐡𝐭𝐭𝐩𝐬://𝐦𝐲𝐥𝐢𝐬𝐭#out=tb_price.js+wb_ad.js&outhn=weibo
  
⦿ regex/regout, 正则保留/删除, 请自行折腾正则表达式;

  ❖ 可与 in(hn)/out(hn) 一起使用，in(hn)/out(hn) 会优先执行;
  
  ❖ 对 𝒉𝒐𝒔𝒕𝒏𝒂𝒎𝒆 & 𝐫𝐞𝐰𝐫𝐢𝐭𝐞/𝐟𝐢𝐥𝐭𝐞𝐫 同时生效(⚠️ 慎用)
  
⦿ policy 参数, 用于直接指定策略组，或为 𝐒𝐮𝐫𝐠𝐞 类型 𝗿𝘂𝗹𝗲-𝘀𝗲𝘁 生成策略组(默认"𝐒𝐡𝐚𝐰𝐧"策略组);

⦿ pset=regex1@policy1+regex2@policy2, 为同一分流规则中不同关键词(允许正则表达式)指定不同策略组;

⦿ replace 参数, 正则替换 𝐟𝐢𝐥𝐭𝐞𝐫/𝐫𝐞𝐰𝐫𝐢𝐭𝐞 内容, regex@newregex;

  ❖ 将淘宝比价中脚本替换成 lite 版本(如有此版本的脚本)
  
    ∎ replace=(price)(.*)@$1_lite$2
    
⦿ dst=rewrite/filter，分别为将 𝐦𝐨𝐝𝐮𝐥𝐞&𝗿𝘂𝗹𝗲-𝘀𝗲𝘁 转换成 重写/分流;

  ❖ ⚠️ 默认将 𝐦𝐨𝐝𝐮𝐥𝐞 转换到重写, 𝗿𝘂𝗹𝗲-𝘀𝗲𝘁 转成分流
  
  ❖ ⚠️ 把 𝗿𝘂𝗹𝗲-𝘀𝗲𝘁 中 url-regex 转成重写时, 必须要加 dst=rewrite;
  
  ❖ ⚠️ 把 𝐦𝐨𝐝𝐮𝐥𝐞 中的分流规则转换时, 必须要加 dst=filter
  
⦿ cdn=1, 将 github 脚本的地址转换成免翻墙 fastly.jsdelivr.net/gh

⦿ fcr=1/2/3, 为分流规则添加 force-cellular/multi-interface/multi-interface-balance 参数，强制移动数据/混合数据/负载均衡

⦿ via=接口, 为分流规则添加 via-interface 参数, 0 表示 via-interface=%TUN%

⦿ relay=目标策略名, 批量将节点订阅转换为ip/host规则，用于实现代理链


3⃣️ 其他参数

⦿ 通知参数 ntf=0/1, 用于 关闭/打开 资源解析器的提示通知

  ❖ 𝗿𝗲𝘄𝗿𝗶𝘁𝗲/𝗳𝗶𝗹𝘁𝗲𝗿 默认“开启”通知提示, 以防规则误删除
  
  ❖ 𝘀𝗲𝗿𝘃𝗲𝗿 资源解析则默认”关闭“通知提示
  
⦿ 类型参数 type=domain-set/rule/module/list/nodes


  ❖ 当解析器未能正确识别类型时, 可尝试使用此参数强制指定
⦿ 隐藏参数 hide=0, 禁用筛除的分流/重写，默认方式为删除
⦿ profile=111 , URL-Scheme 添加 QuanX 类型配置中远程资源
