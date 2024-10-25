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
      { icon: 'steam', link: 'https://steamcommunity.com/id/YuukiHibiki'},
      // {
      //   icon: {
      //     svg:
      //         '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"><title>Steam</title><path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm-1.96 17.434a2.97 2.97 0 0 0 2.97 2.971 2.97 2.97 0 0 0 2.971-2.97 2.97 2.97 0 0 0-2.971-2.97 2.97 2.97 0 0 0-2.97 2.97zm7.104-9.455a4.387 4.387 0 0 0-1.55-.294c-2.43 0-4.394 1.963-4.394 4.392 0 1.35.603 2.61 1.643 3.428-.163.015-.327.023-.49.023a5.53 5.53 0 0 1-5.528-5.527 5.53 5.53 0 0 1 5.528-5.528c1.77 0 3.387.885 4.34 2.236l-1.539 1.47zm-5.744 6.55a1.648 1.648 0 1 1 0-3.296 1.648 1.648 0 0 1 0 3.296z"/></svg>'
      //   },
      //   link: 'https://steamcommunity.com/id/YuukiHibiki',
      // },
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
      {
        text: 'About',
        items: [
          { text: 'About', link: '/about' },
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
