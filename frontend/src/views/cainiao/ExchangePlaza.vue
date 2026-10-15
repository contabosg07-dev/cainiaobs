<template>
  <div class="phone plaza">
    <!-- 紫色头部 -->
    <header class="topbar">
      <span class="back"><CnIcon name="back" :size="26" :sw="2.4" /></span>
      <div class="avatar"><CnArt name="apple" :size="30" /></div>
      <div class="user">
        <div class="uname">tb898182161</div>
        <div class="ip">IP 中国</div>
      </div>
      <div class="actions">
        <span class="circle"><CnIcon name="chat" :size="19" /></span>
        <span class="circle"><CnIcon name="search" :size="18" /></span>
        <span class="circle"><CnIcon name="more" :size="20" /></span>
      </div>
    </header>

    <!-- 寻宝横幅 -->
    <div class="purple-zone">
      <div class="hi-card">
        <div class="hi-left">
          <div class="hi-row">
            <span class="hi">Hi,</span>
            <span class="badge-green">寻宝小菜鸟</span>
          </div>
          <p class="hi-sub">来找找这里藏了什么美丽密码</p>
          <div class="task done">
            <span class="tick"><CnArt name="check" :size="17" /></span>
            <span class="t-text">翻一翻！翻出1个宝藏</span>
            <span class="go">去完成</span>
          </div>
          <div class="task">
            <span class="tick"><CnArt name="check" :size="17" /></span>
            <span class="t-text">再翻翻！翻出3个宝藏</span>
            <span class="locked">未开启</span>
          </div>
        </div>
        <div class="phone3d">
          <div class="p-notch">每日10点更新</div>
          <div class="p-screen">
            <span class="mz">美妆</span>
            <div class="p-ic"><CnArt name="makeup" :size="56" /></div>
            <div class="p-title">开始寻宝 →</div>
            <div class="p-desc">变美宝物藏好啦</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模式切换 -->
    <nav class="modes">
      <div class="mode active">
        <span>广场</span>
        <span class="mode-ic wave"><CnArt name="wave" :size="30" /></span>
      </div>
      <div class="mode"><span>盲盒互换</span><span class="mode-ic"><CnArt name="blindbox" :size="32" /></span></div>
      <div class="mode"><span>小样互换</span><span class="mode-ic"><CnArt name="compact" :size="32" /></span></div>
      <div class="mode"><span>奇葩互换</span><span class="mode-ic"><CnArt name="starpet" :size="32" /></span></div>
    </nav>

    <!-- 筛选 chips -->
    <div class="chips">
      <span class="chip on">全部</span>
      <span class="chip">0元带走</span>
      <span class="chip">退坑了出</span>
      <span class="chip">出片神器</span>
      <span class="chip">宅家好物</span>
    </div>

    <!-- 瀑布流 -->
    <div class="feed">
      <!-- 左列 -->
      <div class="col">
        <div class="card poster-red">
          <div class="pr-tag">日用0元送<br />第5弹！</div>
          <div class="pr-title">日用囤多了<br /><b>送！送！</b><em>sòng</em></div>
          <div class="pr-scene">
            <span class="pr-gift"><CnArt name="gift" :size="30" /></span>
            <div class="pr-sofa"><CnArt name="sofaBear" :size="92" /></div>
            <span class="pr-plant"><CnArt name="plant" :size="32" /></span>
          </div>
          <div class="pr-btn">来这里，全部免费送 ›</div>
        </div>

        <div class="card">
          <img class="cover" :src="imgSelfie" alt="对镜自拍" />
        </div>
      </div>

      <!-- 右列 -->
      <div class="col">
        <div class="card">
          <img class="cover" :src="imgIphone" alt="iPhone关于本机" />
          <div class="card-body">
            <div class="card-title">
              <em>交换</em> AppleiPhone 16 Pro Max
            </div>
            <div class="meta">
              <span class="m-avatar"><CnArt name="orange" :size="22" /></span>
              <span class="m-user">tb847025927<br /><small>发布于 1天前</small></span>
              <span class="like"><CnIcon name="thumb" :size="16" /> 8</span>
            </div>
          </div>
        </div>

        <div class="card poster-beige">
          <div class="pb-title">市集交换</div>
          <div class="pb-sub">这<em>三条</em>记牢</div>
          <ul>
            <li>细节问明白，<b>别收网图</b></li>
            <li>脱离平台换，<b>没安好心</b></li>
            <li>让你扫码付，<b>就是骗子</b></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 悬浮发布按钮 -->
    <div class="fab">
      <span class="fab-tip">集市交换安全提示…</span>
      <span class="fab-btn"><CnIcon name="plus" :size="30" :sw="2.4" /></span>
    </div>
  </div>
</template>

<script setup>
import CnIcon from './CnIcon.vue'
import CnArt from './CnArt.vue'

const img = (p) =>
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(p) + '&image_size=portrait_4_3'
const imgIphone = img('写实照片，一只手拿着iPhone 16 Pro Max手机，屏幕显示关于本机设置页面，能看到iOS版本和序列号，室内灰色木纹桌面背景')
const imgSelfie = img('生活照，年轻长发女生在浴室镜子前用手机遮住脸自拍，穿灰色卡通T恤，墙面贴着小装饰画，毛巾挂在旁边')
</script>

<style scoped>
.phone {
  --purple: #b49bf6;
  --purple-deep: #9d7df0;
  --lavender: #e7dffd;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f3f4f8;
  position: relative;
}

/* 头部 */
.topbar {
  background: linear-gradient(135deg, #bca8fa, #a78bf3);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 12px;
  color: #fff;
}
.back {
  display: inline-flex;
  line-height: 1;
  margin-right: -2px;
}
.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #fff;
  display: grid;
  place-items: center;
  font-size: 26px;
  border: 2px solid rgba(255, 255, 255, 0.7);
}
.user { flex: 1; line-height: 1.25; }
.uname { font-size: 18px; font-weight: 700; letter-spacing: 0.3px; }
.ip { font-size: 12px; opacity: 0.85; }
.actions { display: flex; gap: 10px; }
.circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  display: grid;
  place-items: center;
}

/* 紫色区 + Hi 卡片 */
.purple-zone {
  background: linear-gradient(180deg, #a78bf3 0%, #b49bf6 85%, #f3f4f8 100%);
  padding: 0 12px 16px;
}
.hi-card {
  background: #fff;
  border-radius: 18px;
  padding: 16px 14px;
  display: flex;
  box-shadow: 0 6px 20px rgba(120, 90, 220, 0.18);
}
.hi-left { flex: 1; min-width: 0; }
.hi-row { display: flex; align-items: center; gap: 8px; }
.hi { font-size: 26px; font-weight: 800; color: #222; }
.badge-green {
  background: linear-gradient(135deg, #35d399, #14b87a);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 8px;
}
.hi-sub { margin: 10px 0 14px; font-size: 14px; color: #333; }
.task {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background: #f4f1ff;
  border-radius: 10px;
  margin-bottom: 8px;
  font-size: 13px;
}
.tick { display: inline-flex; flex-shrink: 0; }
.t-text { flex: 1; color: #444; }
.go { color: var(--purple-deep); font-weight: 700; }
.locked { color: #aaa; }

/* 3D 手机 */
.phone3d {
  width: 118px;
  flex-shrink: 0;
  transform: rotate(4deg);
}
.p-notch {
  background: #2b2b2b;
  color: #fff;
  font-size: 11px;
  text-align: center;
  padding: 4px 0;
  border-radius: 12px 12px 0 0;
}
.p-screen {
  background: linear-gradient(160deg, #ffe3dc, #ffc9d6);
  border-radius: 0 0 14px 14px;
  padding: 10px 8px 12px;
  text-align: center;
  position: relative;
  min-height: 132px;
}
.mz {
  position: absolute;
  right: -6px;
  top: 12px;
  background: #ff5d8f;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 8px 0 0 8px;
  transform: rotate(12deg);
}
.p-ic { margin: 6px 0 4px; display: flex; justify-content: center; }
.p-title { font-size: 16px; font-weight: 800; color: #333; }
.p-desc { font-size: 11px; color: #777; margin-top: 2px; }

/* 模式 tabs */
.modes {
  display: flex;
  background: var(--lavender);
  margin: 0 12px;
  border-radius: 16px 16px 0 0;
  padding: 12px 4px 8px;
}
.mode {
  flex: 1;
  text-align: center;
  font-size: 15px;
  color: #333;
}
.mode-ic {
  display: flex;
  justify-content: center;
  margin-top: 2px;
  height: 32px;
}
.mode-ic.wave { align-items: center; }
.mode.active { color: var(--purple-deep); font-weight: 800; position: relative; }

/* chips */
.chips {
  display: flex;
  gap: 8px;
  padding: 12px 12px 6px;
  overflow-x: auto;
}
.chip {
  flex-shrink: 0;
  background: #fff;
  border-radius: 16px;
  padding: 6px 14px;
  font-size: 14px;
  color: #333;
}
.chip.on { background: #222; color: #fff; font-weight: 700; }

/* 瀑布流 */
.feed {
  column-count: 2;
  column-gap: 8px;
  padding: 8px 8px 90px;
}
.col { display: flex; flex-direction: column; gap: 8px; }
.card {
  break-inside: avoid;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 8px;
}
.cover { width: 100%; display: block; }
.card-body { padding: 10px; }
.card-title { font-size: 15px; font-weight: 700; line-height: 1.35; color: #222; }
.card-title em {
  font-style: normal;
  color: var(--purple-deep);
  background: #f0eaff;
  border-radius: 4px;
  padding: 0 4px;
  margin-right: 4px;
}
.meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 12px;
  color: #888;
}
.m-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #ffe7d6;
  display: grid;
  place-items: center;
  overflow: hidden;
  flex-shrink: 0;
}
.m-user { flex: 1; line-height: 1.25; color: #555; }
.m-user small { color: #aaa; }
.like { color: #8a8f99; display: inline-flex; align-items: center; gap: 3px; }

/* 红色海报卡 */
.poster-red {
  background: #f6323a;
  padding: 14px 12px 0;
  position: relative;
}
.pr-tag {
  position: absolute;
  left: 10px;
  top: 74px;
  background: #ffe14d;
  color: #e02b2b;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
  line-height: 1.25;
  padding: 4px 6px;
  border-radius: 4px;
  z-index: 2;
}
.pr-title {
  color: #fff;
  font-size: 26px;
  font-weight: 900;
  line-height: 1.15;
  text-shadow: 0 2px 0 #c81e26;
  position: relative;
}
.pr-title b {
  font-size: 38px;
  background: #fff7d8;
  color: #f6323a;
  padding: 0 8px;
  border-radius: 6px;
  display: inline-block;
  margin-top: 4px;
}
.pr-title em {
  font-style: normal;
  font-size: 12px;
  color: #ffe14d;
  font-weight: 400;
  position: absolute;
  top: 52px;
  margin-left: 2px;
}
.pr-scene {
  background: linear-gradient(180deg, #fff8e7, #ffe9c8);
  border-radius: 12px 12px 0 0;
  margin-top: 14px;
  height: 150px;
  position: relative;
  display: grid;
  place-items: center;
}
.pr-sofa { display: flex; filter: drop-shadow(0 4px 6px rgba(180, 110, 50, 0.25)); }
.pr-gift { position: absolute; right: 8px; top: 6px; }
.pr-plant { position: absolute; left: 8px; bottom: 6px; }
.pr-btn {
  background: linear-gradient(90deg, #f8454b, #e52b32);
  color: #fff;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 0;
  border-radius: 10px 10px 0 0;
}

/* 米色提示卡 */
.poster-beige {
  background: linear-gradient(180deg, #f5ecd8, #efe2c4);
  padding: 18px 14px;
}
.pb-title { font-size: 34px; font-weight: 900; color: #2c2118; letter-spacing: 2px; }
.pb-sub { font-size: 20px; color: #6b4f33; margin: 2px 0 12px; }
.pb-sub em { font-style: normal; color: #d24b2e; font-weight: 900; font-size: 26px; }
.poster-beige ul { list-style: none; margin: 0; padding: 0; }
.poster-beige li {
  font-size: 13px;
  color: #5a4a38;
  line-height: 2;
}
.poster-beige li b { color: #c8401f; }

/* FAB */
.fab {
  position: fixed;
  bottom: 18px;
  right: calc(50% - 215px + 10px);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 20;
}
@media (max-width: 430px) {
  .fab { right: 12px; }
}
.fab-tip {
  background: rgba(40, 30, 70, 0.75);
  color: #fff;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 14px;
  white-space: nowrap;
}
.fab-btn {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 6px 16px rgba(120, 80, 220, 0.45);
}
</style>
