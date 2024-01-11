import { DocumentFilters } from './document-filters.model'

describe('DocumentFilters', () => {
  it('should create an instance', () => {
    const instance: DocumentFilters = {
      category_id: '',
      title: '',
      description: '',
      is_validated: false,
      author_id: ''
    };
    expect(instance).toBeTruthy();
  });
});
