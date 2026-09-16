/*
 * YouTube iOS 首页 Feed Sponsored 广告补丁 v9
 * 稳定版：仅处理 /browse 中 field #49399797 下的 field #1/#32。
 */
(() => {
  const TARGET = 49399797;
  const MAX_SEARCH_DEPTH = 8;
  const ABOUT = 'www.youtube.com/aboutthisad';
  const OLD_CORE = ['googleadservices.com/pagead/aclk','www.youtube.com/pagead/adview','www.youtube.com/pagead/interaction'];
  const BROAD = ['www.youtube.com/pagead/','googleads.g.doubleclick.net/pagead/','yt3.ggpht.com/proxy'];
  const TINY_LAYOUT='video_display_button_group_layout.eml-fe', PROMINENCE='home_vertical_feed_prominence_group_key', DIVIDER='cell_divider.eml-fe', NORMAL_THUMB='i.ytimg.com/vi/';
  function ascii(s){const o=new Uint8Array(s.length);for(let i=0;i<s.length;i++)o[i]=s.charCodeAt(i)&255;return o;}
  const aboutBytes=ascii(ABOUT),oldBytes=OLD_CORE.map(ascii),broadBytes=BROAD.map(ascii),tinyLayoutBytes=ascii(TINY_LAYOUT),prominenceBytes=ascii(PROMINENCE),dividerBytes=ascii(DIVIDER),normalThumbBytes=ascii(NORMAL_THUMB);
  function readVarint(a,i,end){let v=0,shift=0;while(i<end&&shift<56){const c=a[i++];v+=(c&127)*Math.pow(2,shift);if(c<128)return[v,i];shift+=7;}throw new Error('bad varint');}
  function varintBytes(v){const r=[];while(v>=128){r.push((v%128)|128);v=Math.floor(v/128);}r.push(v);return new Uint8Array(r);}
  function containsRange(a,s,e,n){if(e-s<n.length)return false;outer:for(let i=s;i<=e-n.length;i++){for(let j=0;j<n.length;j++)if(a[i+j]!==n[j])continue outer;return true;}return false;}
  function adEvidence(a,s,e){if(containsRange(a,s,e,aboutBytes))return{ad:true,hits:4,reason:'aboutthisad'};let hits=0;for(const n of oldBytes)if(containsRange(a,s,e,n))hits++;for(const n of broadBytes)if(containsRange(a,s,e,n))hits++;return{ad:hits>=2,hits,reason:'markers'};}
  function parseFields(a,s,e){const f=[];let i=s;try{while(i<e){const fs=i,kv=readVarint(a,i,e),key=kv[0],ke=kv[1],no=Math.floor(key/8),wt=key&7;if(!no||![0,1,2,5].includes(wt))return null;let ps=ke,pe,fe;if(wt===0){const q=readVarint(a,ke,e);pe=fe=q[1];}else if(wt===1)pe=fe=ke+8;else if(wt===5)pe=fe=ke+4;else{const q=readVarint(a,ke,e);ps=q[1];pe=ps+q[0];fe=pe;}if(fe>e)return null;f.push({no,wt,start:fs,keyEnd:ke,ps,pe,end:fe});i=fe;}return i===e?f:null;}catch(_){return null;}}
  const rangeSeg=(s,e)=>({s,e}),bytesSeg=b=>({b}),segLen=x=>x.b?x.b.length:x.e-x.s;
  function totalLen(s){let n=0;for(const x of s)n+=segLen(x);return n;}
  function emit(a,segs,len){const o=new Uint8Array(len);let p=0;for(const x of segs){if(x.b){o.set(x.b,p);p+=x.b.length;}else{const v=a.subarray(x.s,x.e);o.set(v,p);p+=v.length;}}return o;}
  function isShell(a,x){const z=x.pe-x.ps;if(x.no!==1||z>8192||containsRange(a,x.ps,x.pe,normalThumbBytes))return false;return containsRange(a,x.ps,x.pe,tinyLayoutBytes)&&containsRange(a,x.ps,x.pe,prominenceBytes);}
  function rewriteFeedContainer(a,s,e){const f=parseFields(a,s,e);if(!f)return null;const drop={};let ads=0,shells=0,dividers=0;for(let i=0;i<f.length;i++){const x=f[i];if(x.wt!==2)continue;if(x.no===1||x.no===32){const ev=adEvidence(a,x.ps,x.pe);if(ev.ad){drop[i]=true;ads++;continue;}}if(isShell(a,x)){drop[i]=true;shells++;}}
    for(let i=0;i<f.length;i++){if(drop[i])continue;const x=f[i];if(x.wt===2&&x.no===1&&x.pe-x.ps<=3000&&containsRange(a,x.ps,x.pe,dividerBytes)&&drop[i-1]){drop[i]=true;dividers++;}}
    if(!ads&&!shells)return{changed:false,segs:[rangeSeg(s,e)],len:e-s,ads:0,shells:0,dividers:0};const segs=[];for(let i=0;i<f.length;i++)if(!drop[i])segs.push(rangeSeg(f[i].start,f[i].end));return{changed:true,segs,len:totalLen(segs),ads,shells,dividers};}
  function rewriteSearch(a,s,e,d){const f=parseFields(a,s,e);if(!f)return null;let changed=false,ads=0,shells=0,dividers=0;const segs=[];for(const x of f){let child=null;if(x.wt===2&&x.no===TARGET)child=rewriteFeedContainer(a,x.ps,x.pe);else if(x.wt===2&&d<MAX_SEARCH_DEPTH&&parseFields(a,x.ps,x.pe))child=rewriteSearch(a,x.ps,x.pe,d+1);if(child&&child.changed){segs.push(rangeSeg(x.start,x.keyEnd),bytesSeg(varintBytes(child.len)),...child.segs);changed=true;ads+=child.ads;shells+=child.shells;dividers+=child.dividers;}else segs.push(rangeSeg(x.start,x.end));}return{changed,segs,len:totalLen(segs),ads,shells,dividers};}
  try{const input=$response.body instanceof Uint8Array?$response.body:new Uint8Array($response.body);const plan=rewriteSearch(input,0,input.length,0);if(plan&&plan.changed){const out=emit(input,plan.segs,plan.len);console.log(`[YT HomeFeed v9] DONE ads=${plan.ads} shells=${plan.shells} ${input.length}->${out.length}`);$done({body:out});}else $done({});}catch(e){console.log(`[YT HomeFeed v9] ERROR ${e}`);$done({});}
})();
