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

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
