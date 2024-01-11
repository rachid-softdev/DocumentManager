import { UserMenuItem } from '../model/user-menu.model';

export class UserMenu {
  public static pages: UserMenuItem[] = [
    {
      group: 'Fonctionnalités',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Accueil',
          route: '/home',
        },
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Documents',
          route: '/user/dashboard/documents',
          children: [
            { label: 'Liste des catégories', route: '/user/dashboard/categories' },
            { label: 'Liste des documents', route: '/user/dashboard/documents' },
            { label: 'Documents en attente', route: '/user/dashboard/documents-validation' },
            { label: 'Google', route: 'google.fr' },
          ],
        },
      ],
    },
  ];
}
