import { PublicMenuItem } from '../model/public-menu.model';

export class PublicMenu {
  public static pages: PublicMenuItem[] = [
    {
      group: 'Fonctionnalités',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Utilisateurs',
          route: '/publics',
          children: [
            { label: 'Liste des utilisateur', route: '/public/dashboard/publics' },
            { label: 'Google', route: 'google.fr' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Images',
          route: '/images',
          children: [
            { label: 'Liste des images', route: '/public/dashboard/images' },
            { label: 'Google', route: 'google.fr' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Video',
          route: '/videos',
          children: [
            { label: 'Liste des vidéos', route: '/public/dashboard/videos' },
            { label: 'Google', route: 'google.fr' },
          ],
        },
      ],
    },
    {
      group: 'Collaboration',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/download.svg',
          label: 'Download',
          route: '/download',
        },
        {
          icon: 'assets/icons/heroicons/outline/gift.svg',
          label: 'Gift Card',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/publics.svg',
          label: 'Publics',
          route: '/publics',
        },
      ],
    },
    {
      group: 'Config',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/cog.svg',
          label: 'Settings',
          route: '/settings',
        },
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notifications',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/folder.svg',
          label: 'Folders',
          route: '/folders',
          children: [
            { label: 'Current Files', route: '/folders/current-files' },
            { label: 'Downloads', route: '/folders/download' },
            { label: 'Trash', route: '/folders/trash' },
          ],
        },
      ],
    },
  ];
}


