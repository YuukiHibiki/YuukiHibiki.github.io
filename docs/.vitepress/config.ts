import { defineConfig } from 'vitepress';

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: 'en-US',
  title: 'YuukiHibiki',
  description: 'Vite & Vue powered static site generator.',

  themeConfig: {
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/YuukiHibiki' },
      {
        icon: {
          svg:
              '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10c-4.6 0-8.45-3.08-9.64-7.27l3.83 1.58a2.84 2.84 0 0 0 2.78 2.27c1.56 0 2.83-1.27 2.83-2.83v-.13l3.4-2.43h.08c2.08 0 3.77-1.69 3.77-3.77s-1.69-3.77-3.77-3.77s-3.78 1.69-3.78 3.77v.05l-2.37 3.46l-.16-.01c-.59 0-1.14.18-1.59.49L2 11.2C2.43 6.05 6.73 2 12 2M8.28 17.17c.8.33 1.72-.04 2.05-.84s-.05-1.71-.83-2.04l-1.28-.53c.49-.18 1.04-.19 1.56.03c.53.21.94.62 1.15 1.15c.22.52.22 1.1 0 1.62c-.43 1.08-1.7 1.6-2.78 1.15c-.5-.21-.88-.59-1.09-1.04zm9.52-7.75c0 1.39-1.13 2.52-2.52 2.52a2.52 2.52 0 0 1-2.51-2.52a2.5 2.5 0 0 1 2.51-2.51a2.52 2.52 0 0 1 2.52 2.51m-4.4 0c0 1.04.84 1.89 1.89 1.89c1.04 0 1.88-.85 1.88-1.89s-.84-1.89-1.88-1.89c-1.05 0-1.89.85-1.89 1.89"/></svg>'
        },
        link: 'https://steamcommunity.com/id/YuukiHibiki',
      },
    ],
    nav: [
      // { text: 'Example', link: '/example' },
      // {
      //   text: 'Kubernetes',
      //   items: [{ text: 'Tailscale', link: '/kubernetes/kubernetes' }],
      // },

      // {
      //   text: 'Dropdown Menu',
      //   items: [
      //     { text: 'Item A', link: '/item-1' },
      //     { text: 'Item B', link: '/item-2' },
      //     { text: 'Item C', link: '/item-3' },
      //   ],
      // },

      // ...
    ],

    sidebar: [
      { text: '关于', link: '/about' },
      {
        text: '图书馆',
        items: [
          { text: '游戏', link: '/library/game' },
          { text: '动画', link: '/library/anime'}
        ]

      },
      {
        text: 'Linux',
        items: [
          { 
            text: 'Kubernetes',
            collapsed: true,
            items: [
                { text: 'Kubernetes集群部署', link: '/linux/kubernetes/kubernetes-1.28.0-install' },
                // { },
            ]
          },
          {
            text: 'VLAN',
            collapsed: true,
            items: [
                { text: 'Tailscale', link: '/linux/vlan/tailscale' },
            ]
          }
        ]
      }
    ]
  }
});
