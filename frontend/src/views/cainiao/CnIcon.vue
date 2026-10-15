<template>
  <!-- 单色线性图标，颜色由 CSS color 控制 -->
  <svg
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    fill="none"
    stroke="currentColor"
    :stroke-width="sw"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cn-icon"
    v-html="icons[name] || ''"
  />
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
  sw: { type: [Number, String], default: 2 },
})

const icons = {
  // 返回 <
  back: '<path d="M15 4.5l-7.5 7.5 7.5 7.5"/>',
  // 对话气泡
  chat:
    '<path d="M21 11.6a8.4 8.4 0 0 1-8.6 8.4 8.6 8.6 0 0 1-3.7-.9L3 20.5l1.8-5a8.2 8.2 0 0 1-.8-3.6A8.4 8.4 0 0 1 12.4 3.5 8.4 8.4 0 0 1 21 11.6z"/>' +
    '<circle cx="9.4" cy="11.6" r="0.9" fill="currentColor" stroke="none"/>' +
    '<circle cx="14.6" cy="11.6" r="0.9" fill="currentColor" stroke="none"/>',
  // 搜索
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="M20.5 20.5l-5-5"/>',
  // 更多 ···
  more:
    '<circle cx="5.5" cy="12" r="1.7" fill="currentColor" stroke="none"/>' +
    '<circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/>' +
    '<circle cx="18.5" cy="12" r="1.7" fill="currentColor" stroke="none"/>',
  // 加号
  plus: '<path d="M12 5v14M5 12h14"/>',
  // 点赞
  thumb:
    '<path d="M7.2 10.5v9.6M7.2 10.5l3.8-6.1c.9-1.4 3.2-.8 3 1.1l-.4 5h5.1c1.5 0 2.7 1.4 2.3 2.9l-1.6 6.4c-.3 1.2-1.4 2-2.6 2H7.2c-1.2 0-2.2-1-2.2-2.2v-7c0-1.2 1-2.1 2.2-2.1z"/>',
}
</script>
