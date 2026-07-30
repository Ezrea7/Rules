// 通用工具函数和环境检测
const isLoon = typeof $persistentStore !== "undefined";
const isQuanX = typeof $prefs !== "undefined";
const isSurge = !isLoon && !isQuanX; // 其他环境按Surge处理
// 统一存储方法
const storage = { get: e => { let r = null; (isLoon || isSurge) && (r = $persistentStore.read(e)), isQuanX && (r = $prefs.valueForKey(e)); try { return r ? JSON.parse(r) : null } catch (e) { return r } }, set: (e, r) => { const t = "object" == typeof r ? JSON.stringify(r) : r; return isLoon || isSurge ? $persistentStore.write(t, e) : !!isQuanX && $prefs.setValueForKey(t, e) } };
// 统一通知方法
const notify = (title, subtitle, message) => {
    if (isLoon || isSurge) {
        $notification.post(title, subtitle, message);
    } else if (isQuanX) {
        $notify(title, subtitle, message);
    }
};
// 统一 HTTP 请求方法
function fetchWithCallback(options, callback) {
    if (isLoon || isSurge) {
        if (options.method === "POST") {
            $httpClient.post(options, callback);
        } else {
            $httpClient.get(options, callback);
        }
    } else if (isQuanX) {
        $task.fetch(options).then(response => {
            callback(null, response, response.body);
        }).catch(error => {
            notify("获取失败", "切换网络重试或者问问作者吧～", JSON.stringify(error));
            callback(error, null, null);
        });
    }
}
// 统一返回状态
function responseStatus(success, data, array) {
    return {
        status: "HTTP/1.1 200 OK",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            success: `${success}`,
            data: {
                information: `${data}`,
                array: array, // 直接传递数组，不使用模板字符串

            }
        })
    }
}

//时间戳函数getCurrent,addMinutes(timestamp, minutes),isValid(currentTimestamp, oldTimestamp)
const TimestampUtil = {
    // 获取当前时间戳
    getCurrent: function () {
        return new Date().getTime();
    },

    // 获取当前时间戳加 n 分钟后的时间戳
    addMinutes: function (timestamp, minutes) {
        return timestamp + minutes * 60 * 1000;
    },

    // 比较时间戳，如果当前时间大于旧时间戳，返回 true 确认修改壁纸
    isValid: function (currentTimestamp, oldTimestamp) {
        return currentTimestamp >= oldTimestamp;
    }
};

//api参数获取函数
function URLSearchParamsApi(queryString) {
    const params = {};
    if (!queryString) return {
        get: (key) => params[key] || null
    };
    const pairs = queryString.split('&');
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        const key = decodeURIComponent(pair[0]);
        const value = pair.length > 1 ? decodeURIComponent(pair[1]) : '';
        params[key] = value;
    }
    return {
        get: (key) => params[key] || null
    };
}

// api解构函数
function parseUrlToParams(url, keys = []) { const queryString = url.split('?')[1]; const params = URLSearchParamsApi(queryString); const result = {}; keys.forEach(key => { result[key] = params.get(key) }); return result }

//初始化存储数据
function initializeStorage(key, defaultValue, description, options = {}) {
    let data = storage.get(key);

    if (options.checkField) {
        if (data && data[options.checkField]) {
            console.log(`已初始化${description}`);
        } else {
            console.log(`未初始化${description}`);
            if (!defaultValue[options.checkField]) {
                defaultValue[options.checkField] = true;
            }
            storage.set(key, defaultValue);
            data = defaultValue;
        }
    } else {
        if (data) {
            console.log(`已初始化${description}`);
        } else {
            console.log(`未初始化${description}`);
            storage.set(key, defaultValue);
            data = defaultValue;
        }
    }

    return data;
}

//初始化各存储数据

//初始用户数据定义
let vidSheepUserinfo = {
    BGimage: "https://img-new-cdn.whalean.com/wallpaper-material/HWzogN5Z55fJ_1748415952311.jpg", // 图片地址
    BG_brightness: "", //背景明度
    auto_change_BG: true, //自动更换壁纸,24小时更换一次   
    current_timestamp: 0, //当前时间戳
    old_timestamp: 0, //上次更换时间戳
    default_source: 2, //默认搜索来源
    announcement: 1, //	用于是否展示公告
    initialization: false, //f表示未初始化,t表示已初始化
    tripartiteplayer: "SenPlayer://x-callback-url/play?url=", //三方播放器
    searchkeywords: ["小猪佩奇", "熊出没", "海绵宝宝", "奥特曼", "哆啦A梦", "名侦探柯南", "喜羊羊与灰太狼"], //搜索历史
    apiSources: {
        "0": "https://caiji.moduapi.cc/api.php/provide/vod?ac=detail&t=&pg=",
        "1": "https://jszyapi.com/api.php/provide/vod?ac=detail&wd=",//急速资源
        "2": "https://caiji.moduapi.cc/api.php/provide/vod?ac=detail&wd=",//魔都资源
        "3": "https://suoniapi.com/api.php/provide/vod?ac=detail&wd=",//索尼资源
        "4": "https://subocaiji.com/api.php/provide/vod?ac=detail&wd=",//速播资源
        "5": "https://cj.lziapi.com/api.php/provide/vod?ac=detail&wd=",//量子资源
        "6": "https://cj.lziapi.com/api.php/provide/vod/from/lzm3u8/?ac=detail&wd=",//量子资源1
        "7": "https://p2100.net/api.php/provide/vod?ac=detail&wd=",//飘零资源
        "8": "https://img.smdyw.top/api.php/provide/vod?ac=detail&wd=",//苹果资源
        "9": "https://360zy.com/api.php/seaxml/vod?ac=detail&wd=",//360资源
        "10": "https://api.guangsuapi.com/api.php/provide/vod/from/gsm3u8/?ac=detail&wd=",//光束资源
        "11": "https://collect.wolongzyw.com/api.php/provide/vod?ac=detail&wd=",//卧龙资源
        "12": "https://bfzyapi.com/api.php/provide/vod?ac=detail&wd=",//暴风资源
        "13": "https://api.zuidapi.com/api.php/provide/vod/?ac=detail&wd=",//最大资源
    },  //搜索源
    spare_01: "20250605",
    spare_02: { "1": 1 },
    spare_03: ["1", "2", "3"],
}

// 收藏数据定义
let vidSheepCollection = {
    vidlist: []
}

// 最近搜索影视定义
let vidSheepRecent = {
    vidlist: []
}

// 搜索的结果数据存储
let vidSheepSearch = {
    vidlist: []
}


// 进行数据初始化
let vidSheepUserinfoData = initializeStorage("vidSheepUserinfo", vidSheepUserinfo, "用户信息", { checkField: "initialization" });
let vidSheepSearchData = initializeStorage("vidSheepSearch", vidSheepSearch, "搜索结果");
let vidSheepCollectionData = initializeStorage("vidSheepCollection", vidSheepCollection, "收藏");
let vidSheepRecentData = initializeStorage("vidSheepRecent", vidSheepRecent, "影视搜索");







const url = $request.url;
// 路由处理器映射表
const routeHandlers = {
    // 主页面路由
    main: {
        match: (url) => url.includes('/sheep/VidSheep/main'),
        handle: handleMain
    },
    // API路由
    api: {
        match: (url) => url.includes('/sheep/VidSheep/api/'),
        handlers: {
            // 用户信息
            userinfo: {
                match: (url) => url.includes('/?userinfo'),
                handle: handleUserInfo
            },
            // 公告信息
            announcement: {
                match: (url) => url.includes('/?announcement'),
                handle: handleUserInfo
            },
            // 影视搜索
            search: {
                match: (url) => url.includes('/?search'),
                handle: handleSearch
            },
            // 获取历史搜索关键词
            searchkeywords: {
                match: (url) => url.includes('/?keywords'),
                handle: handleSearchKeywords
            },
            // AI推荐
            AI: {
                match: (url) => url.includes('/?clearAI'),
                handle: handleClearAI
            },
            // 获取最近搜索数据
            recent: {
                match: (url) => url.includes('/?recent'),
                handle: handleRecent
            },
            // 删除最近搜索数据
            deleteRecent: {
                match: (url) => url.includes('/?deleteRecent'),
                handle: handleDeleteRecent
            },
            // 获取收藏数据
            collect: {
                match: (url) => url.includes('/?collect'),
                handle: handleCollect
            },
            // 获取壁纸数据
            wallpaper: {
                match: (url) => url.includes('/?wallpaper'),
                handle: handleWallpaper
            },
            // 获取默认源
            defaultSource: {
                match: (url) => url.includes('/?defaultSource'),
                handle: handleDefaultSource
            },
            // 获取更新信息
            update: {
                match: (url) => url.includes('/?update'),
                handle: handleUpdate
            }
        },
        defaultHandler: () => $done(responseStatus("失败", "没有这个路由路径"))

    }
};

// 路由分发函数
function routeRequest(url, routeMap) {
    // 遍历所有主路由
    for (const routeKey in routeMap) {
        const route = routeMap[routeKey];
        // 检查URL是否匹配当前主路由
        if (route.match(url)) {
            // 如果路由包含子路由处理器
            if (route.handlers) {
                // 遍历所有子路由
                for (const subRouteKey in route.handlers) {
                    const subRoute = route.handlers[subRouteKey];
                    // 检查URL是否匹配当前子路由
                    if (subRoute.match(url)) {
                        // 执行匹配的子路由处理函数
                        return subRoute.handle();
                    }
                }
                // 如果没有匹配的子路由，使用默认处理器或返回空响应
                return route.defaultHandler ? route.defaultHandler() : $done({});
            }

            // 如果是主路由且没有子路由，直接执行主路由处理函数
            if (route.handle) {
                return route.handle();
            }
        }
    }

    // 如果没有匹配的路由，返回404
    return $done({
        status: "HTTP/1.1 404 Not Found",
        headers: { "Content-Type": "text/html" },
        body: "<h1>路径地址不一致</h1>"
    });
}

function handleMain() {


    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="icon" href="https://img.picgo.net/2025/04/24/IMG_2250359d907d7ba34f51.jpeg" type="image/x-icon">
    <link rel="apple-touch-icon" href="https://img.picgo.net/2025/04/24/IMG_2250359d907d7ba34f51.jpeg">
    <meta name="apple-mobile-web-app-title" content="VidSheep">
    <title>VidSheep</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ezrea7/Rules/JS/Video-Play/JS/CSS/Iconfont.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ezrea7/Rules/JS/Video-Play/JS/CSS/VideoPlay.css">
</head>
<style>
    #background {
        background-image: url('${vidSheepUserinfoData.BGimage}');
    }
</style>
<body>
    <!-- 背景 -->
    <div id="background"></div>

    <!--更新区域@000001-->
    <div class="vidSheep-update-area-display">
    <div id="vidSheep-update-area" >
        <span id="vidSheep-update-title" class="vidSheep-update-title">更新至：VidSheep3.0.1</span>
        <span id="vidSheep-update-time" class="vidSheep-update-time">更新于：2025-06-05</span>
        <ul class="vidSheep-update-list" style="text-align:center;">
            <li>提升响应速度,更流畅的UI</li>
            <li>加入更多个性化设置</li>
            <li>解决进度条的问题</li>
            <li>解决不同设备UI适配问题</li>
            <li> <a href="https://github.com/SheepFJ/VidSheep" target="_blank">Stars</a> 支持一下作者～</li>
        </ul>
        
        <button id="vidSheep-update-button">点击更新</button>
    </div>
    </div>

    <!-- 占顶 -->
    <div style="height: 5%;"></div>


    <!-- 公告 -->
    <div class="announcement announcement_active stickyNotes math-notebook">
        <div class="stickyNotes_nail"></div>
        <div class="stickyNotes_nail_zhen"></div>
        <span style="margin-left:35%">VidSheep3.0</span>
        <ul style="margin-left:5%">
            <li>提升响应速度,更流畅的UI</li>
            <li>加入更多个性化设置</li>
            <li>解决进度条的问题</li>
            <li>解决不同设备UI适配问题</li>
            <li> <a href="https://github.com/SheepFJ/VidSheep" target="_blank">Stars</a> 支持一下作者～</li>
        </ul>
        <button id="announcementNO" class="announcementButton">不再提醒</button>
    </div>

    <!-- 灰色遮挡 -->
    <div id="iframe-popup-overlay" class="iframe-popup-overlay"></div>
    <!--iframe播放弹出框@000002-->
    <div id="iframe-popup" class="iframe-popup-active">
        <div class="iframe-popup-header">
            <!-- 当前播放集数 -->
            <span id="iframe-popup-current-episode" class="iframe-popup-current-episode"></span>
            <!-- 关闭按钮 -->
            <button id="iframe-popup-close" class="iframe-popup-close-button">×</button>
        </div>
        <iframe src="" id="iframe-popup-iframe"></iframe>
        <div class="iframe-popup-buttons">
            <button class="iframe-popup-button iframe-popup-button-share">分享</button>
            <button class="iframe-popup-button iframe-popup-button-third">SenPlayer</button>
        </div>
    </div>

    <!-- 灰色遮罩层--主体区域 -->
    <div id="popup-overlay" class="popup-overlay"></div>

    <!-- 公共弹出框@000005 -->
    <div id="public-popup" class="public-popup-active">
        <div class="public-popup-content">

            <!-- clear-AI-popup-->
            <div id="clear-AI-popup" class="popup-content">
                <h2>AI推荐</h2>
                <span class="genre-list-span">选择0—3个标签</span>
                <ul class="genre-list">
                    <li>任意</li>
                    <li>喜剧</li>
                    <li>爱情</li>
                    <li>科幻</li>
                    <li>动作</li>
                    <li>悬疑</li>
                    <li>恐怖</li>
                    <li>剧情</li>
                    <li>动画</li>
                    <li>纪录片</li>
                    <li>犯罪</li>
                    <li>战争</li>
                    <li>历史</li>
                    <li>传记</li>
                    <li>音乐</li>
                    <li>歌舞</li>
                    <li>电视剧</li>
                    <li>电影</li>
                    <li>动漫</li>
                    <li>综艺</li>
                    <li>纪录片</li>
                    <li>知识</li>
                    <li>中国</li>
                    <li>美国</li>
                    <li>日本</li>
                    <li>韩国</li>
                    <li>泰国</li>
                    <li>印度</li>
                </ul>
            </div>

            <!-- play-popup 播放器展开-->
            <div id="play-popup" class="popup-content">
                <h2 id=""></h2>
                <img class="play-popup-img" src=""  alt="">
                <span></span>
                <!-- 工具栏-分享-收藏-追更-三方 -->
                <div class="play-toolbar">
                    <input type="text" class="play-toolbar-input" placeholder="数字序号">
                    <button class="play-toolbar-button play-toolbar-button-search">跳转</button>
                    <button class="play-toolbar-button play-toolbar-button-collect">收藏</button>
                    <button class="play-toolbar-button play-toolbar-button-follow" style="display: none;">追更</button>
                    <button class="play-toolbar-button play-toolbar-button-reverse">倒转</button>
                </div>
                <ul class="play-list"></ul>
            </div>

            <!-- 修改壁纸@000003 -->
            <div id="modify-wallpaper" class="popup-content">
                <h2>修改壁纸</h2>
                <span style="margin-left: 35%;">壁纸随机更新</span>
                <!-- 壁纸列表容器 -->
                <div class="modify-wallpaper-content"></div>
            </div>

            <!-- 选择默认源@000004 -->
            <div id="default-source" class="popup-content">
                <h2>选择默认源</h2>
                <ul>
                    <li value="1">急速资源 </li>
                    <li value="2">魔都资源 </li>
                    <li value="3">索尼资源 </li>
                    <li value="4">速播资源 </li>
                    <li value="5">量子资源 </li>
                    <li value="6">量子资源1</li>
                    <li value="7">飘零资源 </li>
                    <li value="8">苹果资源 </li>
                    <li value="9">360资源 </li>
                    <li value="10">光束资源</li>
                    <li value="11">卧龙资源</li>
                    <li value="12">暴风资源</li>
                    <li value="13">最大资源</li>
                </ul>
            </div>

            <!-- 关于 -->
            <div id="about" class="popup-content">
                <h2>关于</h2>
                <span class="app-name">VidSheep</span>
                <span class="app-version">版本号：3.0.1</span>
                <span class="update-title">当前版本优化的内容如下⬇</span>
                <ul>
                    <li>
                        <span class="update-item">1. 修改壁纸更符合逻辑</span>
                        <span class="update-item">2. 新增搜索历史，新增AI推荐</span>
                        <span class="update-item">3. 搜索结果点击的剧才会进入最近</span>
                        <span class="update-item">4. 一键或单独删除历史</span>
                        <span class="update-item">5. 更快的响应速度</span>
                        <span class="update-item">6.<a href="https://github.com/SheepFJ/VidSheep" target="_blank">Stars</a> 支持一下作者～感谢感谢🙏</span>
                    </li>
                </ul>
                <span class="disclaimer">声明：资源来源于互联网，仅供个人学习使用，请勿用于商业用途，否则后果自负。</span>
                <span class="contact-link">Github：<a href="https://github.com/SheepFJ">Sheep</a></span>
                <span class="contact-link">TG群组：<a href="https://t.me/sheep_007_xiaoyang">Sheep交流反馈</a></span>
                <span class="contact-link">TG频道：<a href="https://t.me/sheep_007xiaoyang" target="_blank">Sheep资源备份分享</a></span>
            </div>

            <!-- 关闭 -->
            <button id="close-popup" class="close-popup">关闭</button>
           <button id="confirm-popup" class="confirm-popup">确认</button>
        </div>
    </div>

    <div id="main-container">
        <!-- 占顶 -->
        <div style="height: 6%;"></div>

        <!-- 搜索@000006     -->
        <div id="search-section" class="content-section active">
            <div class="search-container">
                <input type="text" placeholder="搜索影视资源..." class="search-input">
                <button class="search-button"><i class="iconfont icon-sousuo1"></i></button>
            </div>
            <select class="source-select">
                <option value="999" disabled selected>默认搜索源</option>
                <option value="999">默认</option>
                <option value="1">急速资源</option>
                <option value="2">魔都资源</option>
                <option value="3">索尼资源</option>
                <option value="4">速播资源</option>
                <option value="5">量子资源</option>
                <option value="6">量子资源1</option>
                <option value="7">飘零资源</option>
                <option value="8">苹果资源</option>
                <option value="9">360资源</option>
                <option value="10">光束资源</option>
                <option value="11">卧龙资源</option>
                <option value="12">暴风资源</option>
                <option value="13">最大资源</option>
            </select>

            <!-- 最近搜索关键词 -->
            <div class="recent-search">
                <div class="recent-search-header">
                    <span class="recent-search-title">搜索历史</span>
                    <button class="clear-AI">AI推荐</button>
                    <button class="refresh-history">刷新</button>
                    <button class="clear-history">删除历史</button>
                </div>
                <div class="recent-keywords"></div>
            </div>

            <!-- 搜索结果 -->
            <div class="search-results">
                <!-- 搜索展示 -->
                <div class="media-grid player-unity"></div>
                <!-- 无搜索结果 -->
                <div class="no-results">没有找到相关结果,请尝试切换源</div>
            </div>
        </div>

        <!-- 最近@000007 @000008 -->
        <div id="list-section" class="content-section">
            <div class="search-results-list-header">
                <span class="search-results-list-title">最近列表</span>
            </div>
             <div class="buttons-container-list">
                    <button class="my-collect-list">我的收藏</button>
                    <button class="clear-history-list">清空最近</button>
            </div>
            <!-- 最近影视列表 -->
            <div class="search-results-list">
                <div class="media-grid-list player-unity"></div>
            </div>
            <!-- 我的收藏 -->
            <div class="search-collect-list">
                <!-- 我的收藏列表 -->
                <div class="media-grid-collect-list player-unity"></div>
            </div>
        </div>

        <!-- 发现@000009 -->
        <div id="discover-section" class="content-section ">
            <!-- 修改壁纸 -->
            <div class="discover-item discover-wallpaper" >
                <div class="discover-icon">
                    <i class="iconfont icon-bizhishezhi"></i>
                </div>
                <div class="discover-title">
                    <span>修改壁纸</span>
                </div>
            </div>
            <!-- 选择默认源 -->
            <div class="discover-item discover-default-source" >
                <div class="discover-icon">
                    <i class="iconfont icon-moren"></i>
                </div>
                <div class="discover-title">
                    <span>选择默认源</span>
                </div>
            </div>
            
            <!-- 关于 -->
            <div class="discover-item discover-about" >
                <div class="discover-icon">
                    <i class="iconfont icon-guanyu"></i>
                </div>
                <div class="discover-title">
                    <span>关于</span>
                </div>
            </div>
        </div>

        <!-- 占顶 -->
        <div style=" height: 35%;"></div>
    </div>

    <!-- 底部导航栏@000010 -->
    <footer>
        <div id="bottom-nav">
            <div class="nav-button nav-active" id="searchBtn" onclick="showSection('search')">
                <i class="iconfont icon-sousuo"></i>
                <span>搜索</span>
            </div>
            <div class="nav-button" id="listBtn" onclick="showSection('list')">
                <i class="iconfont icon-zuijin"></i>
                <span>最近</span>
            </div>
            <div class="nav-button" id="discoverBtn" onclick="showSection('discover')">
                <i class="iconfont icon-faxian"></i>
                <span>发现</span>
            </div>
        </div>
    </footer>


    <script>
    let  version = ${vidSheepUserinfoData.spare_01 || 123};
    let defaultSource = ${vidSheepUserinfoData.default_source};
    const announcement = ${vidSheepUserinfoData.announcement}; //1的时候显示公告,0则隐藏
    let currentPopup = null;
    let selectedCount = [];
    let searchData = {};
    let wallpaperData = [];
    let collectData = [];
    let playType = 'resultslist';
    let mediaTag = 'locationsearch';
    let searchResult = {data: {array: {vidlist: []}}};
    let searchHistoryArray = [];
    </script>
    <script src="https://cdn.jsdelivr.net/gh/Ezrea7/Rules/JS/Video-Play/JS/JS/VideoPlay.js"></script>

</body>
</html>`;

    return $done({
        status: "HTTP/1.1 200 OK",
        headers: { "Content-Type": "text/html" },
        body: html
    });
}

// 公告等用户信息处理
function handleUserInfo() {
    const { announcement } = parseUrlToParams(url, ['announcement']);

    // 永久关闭公告
    if (announcement) {
        vidSheepUserinfoData.announcement = 0
        storage.set("vidSheepUserinfo", vidSheepUserinfoData)
        return $done(responseStatus("成功", "不再展示公告123"));
    }

    return $done(responseStatus("成功", "用户信息获取到了"));
}


function handleSearch() {
    const urlParams = URLSearchParamsApi(url.split('?')[1])
    const searchword = urlParams.get('searchword')
    const source = urlParams.get('search')
    console.log(`Search source: ${source}, Searchword: ${searchword}`);
    // 只有当搜索词不是1-2000范围内的数字时才添加到本地存储
    const searchNumber = parseInt(searchword);
    const isRandomNumber = !isNaN(searchNumber) && searchNumber >= 1 && searchNumber <= 2000;

    if (!isRandomNumber) {
        // 将搜索词加入vidSheepUserinfoData
        // 检查搜索词是否已存在
        const existingIndex = vidSheepUserinfoData.searchkeywords.indexOf(searchword);
        if (existingIndex !== -1) {
            // 如果存在，先从原位置删除
            vidSheepUserinfoData.searchkeywords.splice(existingIndex, 1);
        }
        // 将搜索词添加到数组最前方
        vidSheepUserinfoData.searchkeywords.unshift(searchword);
        storage.set("vidSheepUserinfo", vidSheepUserinfoData);
    }

    // 获取搜索源
    const baseUrl = vidSheepUserinfoData.apiSources[source];
    if (!baseUrl) {
        return $done(responseStatus("失败", "不支持的搜索源"));
    }
    const requestUrl = baseUrl + encodeURIComponent(searchword);
    console.log(requestUrl);
    // 使用 return 语句确保函数在获取到响应前不会继续执行
    return new Promise((resolve) => {
        // 发送搜索请求
        fetchWithCallback({
            url: requestUrl,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1",
                "Accept": "application/json",
                "Accept-Language": "zh-CN,zh-Hans;q=0.9"
            }
        }, (error, response, body) => {
            if (error) {
                resolve($done(responseStatus("失败", "搜索请求出错")));
                return;
            }
            try {
                // 将body转换为json
                const jsonBody = JSON.parse(body);
                //记录本次搜索结果的json
                let searchResult = {
                    listlength: jsonBody.list.length,//搜索到了多少条数据
                    vidlist: []
                };
                // 将jsonBody中的list中的数据添加到vidSheepRecentData.vidlist中
                jsonBody.list.forEach(item => {
                    // 处理vod_content，移除<p>和</p>标签
                    // 清理内容并创建符合格式的对象
                    const cleanContent = item.vod_content ? item.vod_content.replace(/<\/?p>/g, '') : "";
                    const vidItem = {
                        vid_id: item.vod_id || "",
                        vid_name: item.vod_name || "",
                        vid_img: item.vod_pic || "",
                        vid_source: source,
                        vid_content: cleanContent,
                        vid_actor: item.vod_actor || "",
                        vid_time_final: item.vod_time || "",
                        vid_last_record: item.vod_last_record || "1"
                    };
                    // 定义播放地址和集数
                    const vid_play_url = [];
                    const vid_play_name = [];
                    //处理播放地址和集数
                    if (item.vod_play_url) {
                        if (item.vod_play_url.includes('$$$')) {
                            // 如果包含$$$，先以$$$划分不同播放源
                            const sources = item.vod_play_url.split('$$$');
                            // 使用第一个播放源
                            const episodes = sources[0].split('#');
                            episodes.forEach(episode => {
                                // 再以$符号划分集数名称和URL
                                const parts = episode.split('$');
                                if (parts.length === 2) {
                                    vid_play_name.push(parts[0]);
                                    vid_play_url.push(parts[1]);
                                }
                            });
                        } else {
                            // 原来的处理方式
                            // 先以#划分不同集数
                            const episodes = item.vod_play_url.split('#');
                            episodes.forEach(episode => {
                                // 再以$符号划分集数名称和URL
                                const parts = episode.split('$');
                                if (parts.length === 2) {
                                    vid_play_name.push(parts[0]);
                                    vid_play_url.push(parts[1]);
                                }
                            });
                        }
                    }
                    vidItem.vid_play_url = vid_play_url;
                    vidItem.vid_play_name = vid_play_name;
                    // 将处理好的数据添加到vidSheepRecentData.vidlist中
                    // 检查vidlist数组长度，如果超过24，则删除最后一部
                    if (vidSheepSearchData.vidlist.length >= 25) {
                        vidSheepSearchData.vidlist.pop(); // 删除最后一部
                    }
                    vidSheepSearchData.vidlist.unshift(vidItem); // 在头部添加新数据
                    searchResult.vidlist.push(vidItem);
                });
                // 将vidSheepSearchData存储到storage中
                storage.set("vidSheepSearch", vidSheepSearchData);
                resolve($done(responseStatus("成功", "搜索请求成功008", searchResult)));
            } catch (error) {
                resolve($done(responseStatus("失败", "搜索请求失败123")));
            }
        });
    });
}


// 获取最近搜索数据
function handleRecent() {
    const { recent } = parseUrlToParams(url, ['recent']);
    if (recent == "all") {
        return $done(responseStatus("成功获取最近列表", "获取最近搜索数据成功", vidSheepRecentData));
    }
    if (recent == "clear") {
        vidSheepRecentData.vidlist = []
        storage.set("vidSheepRecent", vidSheepRecentData)
        return $done(responseStatus("成功", "最近搜索数据清空了"));
    }
    //从vidSheepSearchData中找到对应的vid_id然后加入vidSheepRecentData的头部
    const item = vidSheepSearchData.vidlist.find(item => item.vid_id == recent)
    if (item) {
        //如果vidSheepRecentData也存在recent，则删除
        const itemIndex = vidSheepRecentData.vidlist.findIndex(i => i.vid_id == recent)
        if (itemIndex != -1) {
            vidSheepRecentData.vidlist.splice(itemIndex, 1)
        }
        // 检查vidlist数组长度，如果超过24，则删除最后一部
        if (vidSheepRecentData.vidlist.length >= 25) {
            vidSheepRecentData.vidlist.pop(); // 删除最后一部
        }
        vidSheepRecentData.vidlist.unshift(item)
        storage.set("vidSheepRecent", vidSheepRecentData)
        return $done(responseStatus("成功", "最近搜索数据添加成功", vidSheepRecentData));
    }



}


// 删除最近搜索数据
function handleDeleteRecent() {
    const { deleteRecent } = parseUrlToParams(url, ['deleteRecent']);

    if (deleteRecent == "all") {
        vidSheepRecentData.vidlist = []
        storage.set("vidSheepRecent", vidSheepRecentData)
        return $done(responseStatus("成功", "最近搜索数据全部清空了"));
    }


    vidSheepRecentData.vidlist.forEach(item => {
        if (item.vid_id == deleteRecent) {
            vidSheepRecentData.vidlist.splice(vidSheepRecentData.vidlist.indexOf(item), 1);
            storage.set("vidSheepRecent", vidSheepRecentData)
            return $done(responseStatus("成功", "最近搜索数据单项清空了"));
        }
    });





}


// 处理收藏数据
function handleCollect() {
    const { collect, state } = parseUrlToParams(url, ['collect', 'state']);

    if (collect == "all") {
        return $done(responseStatus("成功获取收藏列表", "获取收藏数据成功", vidSheepCollectionData));
    }


    if (state == 'add') {

        //根据collect的vid_id在vidSheepRecent找到数据然后加入收藏的前面
        const collectDataItem = vidSheepRecentData.vidlist.find(item => item.vid_id == collect)
        if (collectDataItem) {
            //如果vidSheepCollectionData.vidlist中存在collectDataItem，则删除
            const collectDataItemIndex = vidSheepCollectionData.vidlist.findIndex(item => item.vid_id == collect)
            if (collectDataItemIndex != -1) {
                vidSheepCollectionData.vidlist.splice(collectDataItemIndex, 1)
            }
            //将collectDataItem加入收藏的前面
            vidSheepCollectionData.vidlist.unshift(collectDataItem)
            storage.set("vidSheepCollection", vidSheepCollectionData)

            return $done(responseStatus("成功", "收藏数据添加成功"));
        }
    } else {
        vidSheepCollectionData.vidlist.forEach(item => {
            if (item.vid_id == collect) {
                vidSheepCollectionData.vidlist.splice(vidSheepCollectionData.vidlist.indexOf(item), 1);
                storage.set("vidSheepCollection", vidSheepCollectionData)
                return $done(responseStatus("成功", "收藏数据单项清空了"));
            }
        });
    }




}


// 获取壁纸数据
function handleWallpaper() {
    const { wallpaper } = parseUrlToParams(url, ['wallpaper']);
    console.log(wallpaper);

    if (wallpaper == 'get') {
        const url = `https://mars-prod.whalean.com/poseidon-service/api/pubContent/getPublishContentRecommend?channelId=3&channelLabels=%E5%A3%81%E7%BA%B8%20%E9%A3%8E%E6%99%AF&channelName=%E9%A3%8E%E6%99%AF&needFindCollectStatus=1&needFindFollowStatus=1&needFindLikeStatus=1&needUserHeadSculpture=1&pageNo=1&pageSize=4&parentChannelId=1&parentChannelName=%E5%A3%81%E7%BA%B8&refresh_type=xl&scene=category&sortMode=new&userId=57934497`;
        const method = `GET`;
        const headers = {
            'Accept': `application/json`,
            'userId': `57934497`,
            'Connection': `keep-alive`,
            'extendedFields': `{"$os_version":"18.3.1","$device_id":"18B5AA5256AAA70E9032BA4C882AB4FF","distinct_id":"57934497","$os":"iOS","$screen_height":844,"$is_first_day":true,"$carrier":"unknow","$screen_width":390,"$model":"iPhone14,2","$wifi":false,"$network_type":"5G","$app_version":"6.9.35","$manufacturer":"Apple","channel_number":"","$project":"yaowang","appId":"1000","platform_type":"iOS","ab_param":""}`,
            'Content-Type': `application/json`,
            'Host': `mars-prod.whalean.com`,
            'appkey': `mobile`,
            'User-Agent': `YaoWang/6.9.35 (iPhone; iOS 18.3.1; Scale/3.00)`,
            'Accept-Language': `zh-Hans-CN;q=1, en-CN;q=0.9`,
            'token': `q/8K/5f371pUglqYLKgoqQ==`,
            'Accept-Encoding': `gzip, deflate, br`
        };
        const body = ``;
        const myRequest = {
            url: url,
            method: method,
            headers: headers,
            body: body
        };
        return new Promise((resolve) => {
            fetchWithCallback(myRequest, (error, response, body) => {
                if (error) {
                    console.log("获取壁纸数据失败: " + error);
                    resolve($done(responseStatus("失败", "获取壁纸数据失败")));
                    return;
                }
                try {
                    const data = JSON.parse(body);
                    const wallpaperUrls = [];
                    data.data.forEach(item => {
                        if (item.photos && item.photos.length > 0) {
                            item.photos.forEach(photo => {
                                if (photo.sourcePhoto && photo.sourcePhoto.url) {
                                    wallpaperUrls.push(photo.sourcePhoto.url);
                                }
                            });
                        }
                    });
                    console.log(wallpaperUrls);
                    resolve($done(responseStatus("成功", "获取壁纸数据成功", wallpaperUrls)));
                } catch (e) {
                    console.log("解析壁纸数据出错: " + e.message);
                    resolve($done(responseStatus("失败", "解析壁纸数据出错")));
                }
            });
        });
    }
    //修改本地数据
    vidSheepUserinfoData.BGimage = wallpaper;
    storage.set("vidSheepUserinfo", vidSheepUserinfoData);
    return $done(responseStatus("成功", "修改壁纸数据成功"));

}


// 设置默认源
function handleDefaultSource() {
    const { defaultSource } = parseUrlToParams(url, ['defaultSource'])
    console.log(defaultSource);
    //修改本地数据
    vidSheepUserinfoData.default_source = defaultSource;
    storage.set("vidSheepUserinfo", vidSheepUserinfoData);

    return $done(responseStatus("成功", "修改默认源数据成功"));
}

// 更新版本
function handleUpdate() {
    const { update } = parseUrlToParams(url, ['update'])
    console.log(update);
    //对于20250608版本的处理
    if (update == 20250608) {
        //显示更新区域
        vidSheepUserinfoData.spare_01 = "20250608"; //更新版本号
        vidSheepUserinfoData.apiSource = vidSheepUserinfo.apiSources; //更新源
        vidSheepUserinfoData.BGimage = "https://img-new-cdn.whalean.com/wallpaper-material/HWzogN5Z55fJ_1748415952311.jpg"; //更新默认源
        storage.set("vidSheepUserinfo", vidSheepUserinfoData);
        return $done(responseStatus("成功", "更新版本成功"));
    }
    return $done(responseStatus("成功", "获取更新信息成功"));
}

// 获取最近搜索关键词
function handleSearchKeywords() {
    const { keywords } = parseUrlToParams(url, ['keywords']);

    if (keywords == "all") {
        const userSearchKeywords = vidSheepUserinfoData.searchkeywords
        return $done(responseStatus("成功", userSearchKeywords, userSearchKeywords));
    }

    if (keywords == "clear") {
        vidSheepUserinfoData.searchkeywords = []
        storage.set("vidSheepUserinfo", vidSheepUserinfoData)
        return $done(responseStatus("成功", "搜索历史清空了"));
    }
}

// AI推荐
function handleClearAI() {
    const { clearAI } = parseUrlToParams(url, ['clearAI']);

    return new Promise((resolve) => {
        const requestUrl = "https://omp7djvjwc5rouckyjz3q74nt40bgpgg.lambda-url.us-east-2.on.aws/process";
        const requestHeaders = {
            'Accept': `*/*`,
            'Accept-Encoding': `gzip, deflate, br`,
            'Connection': `keep-alive`,
            'Content-Type': `application/json`,
            'Host': `omp7djvjwc5rouckyjz3q74nt40bgpgg.lambda-url.us-east-2.on.aws`,
            'User-Agent': `ChatBot%20iOS/1 CFNetwork/3826.400.120 Darwin/24.3.0`,
            'Accept-Language': `zh-CN,zh-Hans;q=0.9`
        };

        // 简化请求内容，减少数据传输量
        const requestBody = JSON.stringify({ "model": "gpt-4o", "messages": [{ "role": "system", "content": "你是一个有帮助的助手在 中文（简体） 语言" }, { "role": "user", "content": "推荐" }, { "content": "推荐4部高评分的关于" + clearAI + "的影视剧，仅列出名称，用逗号分隔，不要出现书名号《》等任何其他符号，严格按照如下格式：电视剧名称1，电视剧名称2，电视剧名称3，电视剧名称4", "role": "user" }], "temperature": 1, "stream": false });

        // 统一 HTTP 请求
        fetchWithCallback({
            url: requestUrl,
            method: "POST",
            headers: requestHeaders,
            body: requestBody
        }, (error, response, body) => {
            if (error) {
                console.log("AI推荐请求出错: " + error);
                resolve($done(responseStatus("失败", "AI推荐请求出错")));
            }

            try {
                // 使用正则表达式提取所有content值
                let combinedContent = "";
                const contentRegex = /"content":"([^"]*)"/g;
                let match;

                while ((match = contentRegex.exec(body)) !== null) {
                    combinedContent += match[1];
                }

                // 将combinedContent中的内容转换为数组
                const contentArray = combinedContent.trim().split(/[，,]/);

                console.log("AI推荐内容: " + contentArray);
                resolve($done(responseStatus("成功", "AI推荐成功", contentArray)));
            } catch (e) {
                console.log("解析AI响应出错: " + e.message);
                resolve($done(responseStatus("失败", "解析AI响应出错")));
            }
        });
    });
}
// 启动路由分发
routeRequest(url, routeHandlers);
