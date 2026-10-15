<template>
  <!-- 彩色插画图标（64x64 画布） -->
  <svg
    :viewBox="vb"
    :width="size"
    :height="size"
    class="cn-art"
    v-html="art[name] || ''"
  />
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 28 },
  vb: { type: String, default: '0 0 64 64' },
})

const art = {
  // 红苹果头像
  apple:
    '<path d="M32 16c-5.5 0-9 2.8-11 2.8S13.5 18 10.8 22.6 7.5 36 13.5 44.5c2.6 3.6 4.8 3.8 7.5 2s5.8-2 8.4 0 5.4 2.4 8.2-1.2C44 38 47.5 27 44.8 22.6S42.5 18.8 40 18.8 37.5 16 32 16z" fill="#ea3a34"/>' +
    '<path d="M32.4 16.5c-.3-4.6 2.6-8.2 7-9.4.2 4.4-2.7 8.4-7 9.4z" fill="#5bbf5f"/>' +
    '<path d="M33 13.6c2.2-1.6 4-1.4 6.4-.3" fill="none" stroke="#c98a4b" stroke-width="1.6" stroke-linecap="round"/>' +
    '<ellipse cx="23" cy="30" rx="4.6" ry="8" fill="#fff" opacity=".18" transform="rotate(-14 23 30)"/>',

  // 紫色勾选方块
  check:
    '<rect x="5" y="5" width="54" height="54" rx="13" fill="#8b7cf6"/>' +
    '<path d="M18 33l9 9 19-20" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',

  // 口红 + 彩妆盘
  makeup:
    '<g transform="rotate(-18 25 20)"><rect x="21" y="8" width="8" height="15" rx="3" fill="#e8414f"/><rect x="20" y="22" width="10" height="17" rx="2.5" fill="#d9a441"/><rect x="20" y="27" width="10" height="3" fill="#b9852f"/></g>' +
    '<rect x="11" y="33" width="32" height="21" rx="4" fill="#f6c2d3"/>' +
    '<rect x="11" y="33" width="32" height="6" rx="3" fill="#ef9bba"/>' +
    '<circle cx="20" cy="44" r="2.7" fill="#ff7da0"/><circle cx="31" cy="44" r="2.7" fill="#caa06b"/>' +
    '<circle cx="20" cy="50" r="2.7" fill="#e06a96"/><circle cx="31" cy="50" r="2.7" fill="#b98fd6"/>',

  // 盲盒
  blindbox:
    '<defs><linearGradient id="bbox" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b794f6"/><stop offset="1" stop-color="#60a5fa"/></linearGradient></defs>' +
    '<rect x="10" y="19" width="44" height="10" rx="4" fill="#8b5cf6"/>' +
    '<rect x="12" y="27" width="40" height="28" rx="5" fill="url(#bbox)"/>' +
    '<text x="32" y="49" text-anchor="middle" font-size="22" font-weight="bold" fill="#fff" font-family="sans-serif">?</text>' +
    '<ellipse cx="32" cy="57" rx="16" ry="2.4" fill="#000" opacity=".12"/>',

  // 粉饼盒
  compact:
    '<path d="M14 27a18 7.5 0 0 1 36 0z" fill="#f472a6"/>' +
    '<rect x="14" y="26" width="36" height="22" rx="8" fill="#f9b1cd"/>' +
    '<ellipse cx="32" cy="27" rx="11" ry="4" fill="#ef7cab"/>' +
    '<circle cx="32" cy="26" r="2.6" fill="#fff" opacity=".85"/>' +
    '<rect x="22" y="36" width="20" height="3" rx="1.5" fill="#e87fb0" opacity=".7"/>',

  // 星星小怪
  starpet:
    '<defs><linearGradient id="spt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c4b0fd"/><stop offset="1" stop-color="#8b7cf6"/></linearGradient></defs>' +
    '<path d="M32 8l5.9 15.9L54.8 24.6 41.5 35.1l4.6 16.3L32 42l-14.1 9.4 4.6-16.3L9.2 24.6l16.9-.7z" fill="url(#spt)"/>' +
    '<circle cx="26.5" cy="30" r="4.8" fill="#fff"/><circle cx="37.5" cy="30" r="4.8" fill="#fff"/>' +
    '<circle cx="27.4" cy="30.8" r="2.3" fill="#2b2440"/><circle cx="36.6" cy="30.8" r="2.3" fill="#2b2440"/>' +
    '<circle cx="28.3" cy="29.9" r=".8" fill="#fff"/><circle cx="37.5" cy="29.9" r=".8" fill="#fff"/>' +
    '<circle cx="23" cy="34.5" r="1.9" fill="#ff9ecf" opacity=".85"/><circle cx="41" cy="34.5" r="1.9" fill="#ff9ecf" opacity=".85"/>' +
    '<path d="M29 36.5q3 2.6 6 0" fill="none" stroke="#2b2440" stroke-width="1.8" stroke-linecap="round"/>',

  // 选中 tab 下的紫色波浪
  wave:
    '<path d="M6 32 C 18 16, 26 48, 38 32 S 54 20, 60 28" fill="none" stroke="#9d7df0" stroke-width="6" stroke-linecap="round"/>',

  // 礼物盒
  gift:
    '<ellipse cx="32" cy="57" rx="18" ry="3" fill="#000" opacity=".12"/>' +
    '<rect x="12" y="27" width="40" height="28" rx="3" fill="#5aa9e6"/>' +
    '<rect x="12" y="27" width="40" height="7" fill="#4191d1"/>' +
    '<rect x="29" y="27" width="6" height="28" fill="#ffd166"/>' +
    '<rect x="9" y="21" width="46" height="8" rx="2.5" fill="#3f86c4"/>' +
    '<ellipse cx="27" cy="18" rx="7" ry="5" fill="#ffd166" transform="rotate(-18 27 18)"/>' +
    '<ellipse cx="37" cy="18" rx="7" ry="5" fill="#ffd166" transform="rotate(18 37 18)"/>' +
    '<rect x="29" y="13" width="6" height="9" rx="2" fill="#f4b942"/>',

  // 沙发熊 + 白熊 + 黄色斗柜
  sofaBear:
    '<ellipse cx="36" cy="56" rx="27" ry="4.6" fill="#f2c9dd" opacity=".85"/>' +
    '<rect x="5" y="30" width="13" height="23" rx="2" fill="#f7d27a"/>' +
    '<rect x="5" y="37" width="13" height="2.4" fill="#e3b558"/><rect x="5" y="44.5" width="13" height="2.4" fill="#e3b558"/>' +
    '<circle cx="11.5" cy="34.5" r="1" fill="#b8862f"/><circle cx="11.5" cy="42" r="1" fill="#b8862f"/><circle cx="11.5" cy="49.5" r="1" fill="#b8862f"/>' +
    '<circle cx="28" cy="24" r="5" fill="#c98246"/><circle cx="46" cy="24" r="5" fill="#c98246"/>' +
    '<rect x="22" y="24" width="30" height="28" rx="11" fill="#c98246"/>' +
    '<ellipse cx="37" cy="36" rx="11" ry="9" fill="#e3b183"/>' +
    '<circle cx="33" cy="34" r="1.7" fill="#4a2c17"/><circle cx="41" cy="34" r="1.7" fill="#4a2c17"/>' +
    '<path d="M35 39q2 1.8 4 0" stroke="#4a2c17" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
    '<rect x="20" y="47" width="34" height="8" rx="4" fill="#b8703a"/>' +
    '<circle cx="32.4" cy="42.5" r="2.4" fill="#fff"/><circle cx="41.6" cy="42.5" r="2.4" fill="#fff"/>' +
    '<circle cx="37" cy="48" r="6.8" fill="#fff"/>' +
    '<circle cx="34.7" cy="47" r="1" fill="#333"/><circle cx="39.3" cy="47" r="1" fill="#333"/>' +
    '<ellipse cx="37" cy="49.8" rx="1.5" ry="1.1" fill="#333"/>',

  // 仙人掌盆栽
  plant:
    '<rect x="27" y="11" width="9" height="32" rx="4.5" fill="#5fbf6f"/>' +
    '<rect x="16" y="24" width="7" height="12" rx="3.5" fill="#56b466"/><rect x="41" y="22" width="7" height="13" rx="3.5" fill="#56b466"/>' +
    '<g fill="#d8f0db"><circle cx="31.5" cy="18" r=".8"/><circle cx="31.5" cy="26" r=".8"/><circle cx="31.5" cy="34" r=".8"/><circle cx="19.5" cy="29" r=".7"/><circle cx="44.5" cy="28" r=".7"/></g>' +
    '<rect x="22" y="42" width="20" height="13" rx="2.5" fill="#e8853a"/>' +
    '<ellipse cx="32" cy="42" rx="10" ry="3.2" fill="#f4a55c"/>',

  // 橙子头像
  orange:
    '<circle cx="32" cy="35" r="21" fill="#ff9f29"/>' +
    '<circle cx="25" cy="29" r="6" fill="#ffc168" opacity=".7"/>' +
    '<path d="M32 14c0-3 2-5 5-6" fill="none" stroke="#8d6e2f" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M33 13c3-3 7-3 10-1-2 3-6 4-10 3z" fill="#5fbf6f"/>',
}
</script>
