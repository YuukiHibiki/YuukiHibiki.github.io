---
layout: home

hero:
  name: YuukiHibiki
  text: 使用githubPages和VitePress构建
  tagline: 
  actions:
    - theme: brand
      text: 进入站点
      link: /about
    - theme: alt
      text: 访问VitePress项目文档
      link: https://vitepress.dev/
---

<style scoped>
.container {
  display: flex;
  position: relative;
  margin: 0 auto;
  padding: 0 24px;
  /**
   * same as VPHero.vue
   * https://github.com/vuejs/vitepress/blob/v1.0.0-beta.5/src/client/theme-default/components/VPHero.vue#L83
   */
  max-width: 1280px;
}

@media (min-width: 640px) {
  .container {
    padding-inline: 48px;
  }
}

@media (min-width: 960px) {
  .container {
    padding-inline: 64px;
  }
}


.contributors-avatar {
  width: 600px;
}
</style>
