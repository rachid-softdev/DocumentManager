import { AdminMenuItem } from '../model/admin-menu.model';

export class AdminMenu {
  public static pages: AdminMenuItem[] = [
    {
      group: 'Fonctionnalités',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Catégories',
          route: '/admin/dashboard/categories',
          children: [
            { label: 'Liste des catégories', route: '/admin/dashboard/categories' },
            { label: 'Google', route: 'google.fr' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Documents',
          route: '/admin/dashboard/documents',
          children: [
            { label: 'Liste des documents', route: '/admin/dashboard/documents' },
            { label: 'Documents en attente', route: '/admin/dashboard/documents-validation' },
            { label: 'Modèle d\'email', route: '/admin/dashboard/email-template' },
            { label: 'Google', route: 'google.fr' },
          ],
        },
      ],
    },
  ];
}
