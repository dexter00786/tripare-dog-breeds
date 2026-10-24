import type {Breed, FilterState, Group} from '../types/dog';
import {getSizeBand} from './sizeBand';

export function createDefaultFilters(): FilterState {
  return {
    query: '',
    groupIds: [],
    sizeBands: [],
    coatLengths: [],
    hypoallergenic: 'any',
    traitKey: null,
    traitThreshold: 4,
  };
}

export function filterBreeds(
  breeds: Breed[],
  filters: FilterState,
): Breed[] {
  const q = filters.query.trim().toLowerCase();

  return breeds.filter(breed => {
    const {attributes} = breed;

    if (q.length > 0) {
      const nameMatch = attributes.name.toLowerCase().includes(q);
      const otherMatch = attributes.other_names.some(n =>
        n.toLowerCase().includes(q),
      );
      if (!nameMatch && !otherMatch) {
        return false;
      }
    }

    if (
      filters.groupIds.length > 0 &&
      (breed.groupId == null || !filters.groupIds.includes(breed.groupId))
    ) {
      return false;
    }

    if (filters.sizeBands.length > 0) {
      if (!filters.sizeBands.includes(getSizeBand(breed))) {
        return false;
      }
    }

    if (filters.coatLengths.length > 0) {
      const length = attributes.coat?.length?.toLowerCase() ?? '';
      if (!filters.coatLengths.includes(length)) {
        return false;
      }
    }

    if (filters.hypoallergenic === 'yes' && !attributes.hypoallergenic) {
      return false;
    }
    if (filters.hypoallergenic === 'no' && attributes.hypoallergenic) {
      return false;
    }

    if (filters.traitKey != null) {
      const score = attributes.traits[filters.traitKey];
      if (typeof score !== 'number' || score < filters.traitThreshold) {
        return false;
      }
    }

    return true;
  });
}

export type ListRow =
  | {type: 'header'; key: string; title: string}
  | {type: 'breed'; key: string; breed: Breed};

export function groupBreedsForList(
  breeds: Breed[],
  groupsById: Record<string, Group>,
): ListRow[] {
  const buckets = new Map<string, Breed[]>();

  for (const breed of breeds) {
    const groupName =
      breed.groupId != null
        ? groupsById[breed.groupId]?.name ?? 'Ungrouped'
        : 'Ungrouped';
    const list = buckets.get(groupName) ?? [];
    list.push(breed);
    buckets.set(groupName, list);
  }

  const titles = Array.from(buckets.keys()).sort((a, b) => a.localeCompare(b));
  const rows: ListRow[] = [];

  for (const title of titles) {
    rows.push({type: 'header', key: `h:${title}`, title});
    const items = buckets.get(title) ?? [];
    for (const breed of items) {
      rows.push({type: 'breed', key: breed.id, breed});
    }
  }

  return rows;
}

export function activeFilterCount(filters: FilterState): number {
  let count = 0;
  if (filters.groupIds.length) {
    count += 1;
  }
  if (filters.sizeBands.length) {
    count += 1;
  }
  if (filters.coatLengths.length) {
    count += 1;
  }
  if (filters.hypoallergenic !== 'any') {
    count += 1;
  }
  if (filters.traitKey != null) {
    count += 1;
  }
  return count;
}
