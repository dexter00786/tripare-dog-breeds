import {
  API_BASE_URL,
  BREEDS_PAGE_SIZE,
  EXPECTED_BREED_PAGES,
} from '../config';
import type {
  Breed,
  BreedAttributes,
  Group,
  JsonApiResource,
  PaginatedResponse,
} from '../types/dog';
import {fetchJson} from './http';

type BreedResource = JsonApiResource<BreedAttributes, 'breed'>;
type GroupResource = JsonApiResource<{name: string}, 'group'>;

function mapBreed(resource: BreedResource): Breed {
  return {
    id: resource.id,
    type: 'breed',
    attributes: resource.attributes,
    groupId: resource.relationships?.group?.data?.id ?? null,
  };
}

function mapGroup(resource: GroupResource): Group {
  return {
    id: resource.id,
    type: 'group',
    name: resource.attributes.name,
  };
}

export async function fetchBreedPage(page: number): Promise<Breed[]> {
  const url = `${API_BASE_URL}/breeds?page[number]=${page}&page[size]=${BREEDS_PAGE_SIZE}`;
  const json = await fetchJson<PaginatedResponse<BreedResource>>(url);
  return json.data.map(mapBreed);
}

/**
 * Fetches all breed pages (expected 6 × 48) and merges into one dataset.
 * Pages are requested sequentially with early stop when `next` is null,
 * keeping memory predictable while assembling the full catalog.
 */
export async function fetchAllBreeds(): Promise<Breed[]> {
  const breeds: Breed[] = [];
  let page = 1;

  while (page <= EXPECTED_BREED_PAGES + 2) {
    const url = `${API_BASE_URL}/breeds?page[number]=${page}&page[size]=${BREEDS_PAGE_SIZE}`;
    const json = await fetchJson<PaginatedResponse<BreedResource>>(url);
    breeds.push(...json.data.map(mapBreed));

    const next = json.meta?.pagination?.next ?? null;
    if (next == null) {
      break;
    }
    page = next;
  }

  const byId = new Map<string, Breed>();
  for (const breed of breeds) {
    byId.set(breed.id, breed);
  }
  return Array.from(byId.values()).sort((a, b) =>
    a.attributes.name.localeCompare(b.attributes.name),
  );
}

export async function fetchBreedById(id: string): Promise<Breed> {
  const url = `${API_BASE_URL}/breeds/${id}`;
  const json = await fetchJson<{data: BreedResource}>(url);
  return mapBreed(json.data);
}

export async function fetchGroups(): Promise<Group[]> {
  const url = `${API_BASE_URL}/groups`;
  const json = await fetchJson<PaginatedResponse<GroupResource>>(url);
  return json.data.map(mapGroup).sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchCatalog(): Promise<{
  breeds: Breed[];
  groups: Group[];
}> {
  const [breeds, groups] = await Promise.all([fetchAllBreeds(), fetchGroups()]);
  return {breeds, groups};
}
