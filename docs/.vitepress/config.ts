import { defineConfig } from 'vitepress';

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: 'en-US',
  title: 'VitePress',
  description: 'Vite & Vue powered static site generator.',

  themeConfig: {
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
        text: 'NAS',
        items: [
          {
            text: 'VLAN',
            collapsed: true,
            items: [
                { text: 'Tailscale', link: '/nas/tailscale' },
                // { },
            ],
          },
          // ...
        ],
      },
      {
        text: 'Linux',
        items: [
          { text: 'Example', link: '/example' },
          { 
            text: 'Kubernetes',
            collapsed: true,
            items: [
                { text: 'Kubernetes集群部署', link: '/linux/kubernetes/kubernetes-1.28.0-install.md' },
                // { },
            ]
          }    
        ]
      }
    ]
  }
});
