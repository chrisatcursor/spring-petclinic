export interface Specialty {
  id: number;
  name: string;
}

export interface Vet {
  id: number;
  firstName: string;
  lastName: string;
  specialties: Specialty[];
}

export interface Visit {
  id: number;
  date: string;
  description: string;
}

export interface PetType {
  id: number;
  name: string;
}

export interface Pet {
  id: number;
  name: string;
  birthDate: string;
  type: PetType;
  visits: Visit[];
}

export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
  pets: Pet[];
}

export interface OwnerPayload {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
}

export interface PetPayload {
  name: string;
  birthDate: string;
  typeId: number;
}

export interface VisitPayload {
  date: string;
  description: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

export class ApiValidationError extends Error {
  fieldErrors: ValidationErrors;

  constructor(fieldErrors: ValidationErrors) {
    super('Validation failed');
    this.fieldErrors = fieldErrors;
  }
}

export interface PaginatedOwners {
  owners: Owner[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedVets {
  vets: Vet[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '/petclinic/api';
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 1500);
const PAGE_SIZE = 5;

let restAvailability: 'unknown' | 'available' | 'unavailable' = 'unknown';

const clone = <T>(value: T): T => structuredClone(value);

const petTypes: PetType[] = [
  { id: 1, name: 'cat' },
  { id: 2, name: 'dog' },
  { id: 3, name: 'lizard' },
  { id: 4, name: 'snake' },
  { id: 5, name: 'bird' },
  { id: 6, name: 'hamster' },
];

const localState: { owners: Owner[]; vets: Vet[] } = {
  owners: [
    {
      id: 1,
      firstName: 'George',
      lastName: 'Franklin',
      address: '110 W. Liberty St.',
      city: 'Madison',
      telephone: '6085551023',
      pets: [
        {
          id: 1,
          name: 'Leo',
          birthDate: '2010-09-07',
          type: petTypes[0],
          visits: [],
        },
      ],
    },
    {
      id: 2,
      firstName: 'Betty',
      lastName: 'Davis',
      address: '638 Cardinal Ave.',
      city: 'Sun Prairie',
      telephone: '6085551749',
      pets: [
        {
          id: 2,
          name: 'Basil',
          birthDate: '2012-08-06',
          type: petTypes[5],
          visits: [],
        },
      ],
    },
    {
      id: 3,
      firstName: 'Eduardo',
      lastName: 'Rodriquez',
      address: '2693 Commerce St.',
      city: 'McFarland',
      telephone: '6085558763',
      pets: [
        {
          id: 3,
          name: 'Rosy',
          birthDate: '2011-04-17',
          type: petTypes[1],
          visits: [],
        },
        {
          id: 4,
          name: 'Jewel',
          birthDate: '2010-03-07',
          type: petTypes[1],
          visits: [],
        },
      ],
    },
    {
      id: 4,
      firstName: 'Harold',
      lastName: 'Davis',
      address: '563 Friendly St.',
      city: 'Windsor',
      telephone: '6085553198',
      pets: [
        {
          id: 5,
          name: 'Iggy',
          birthDate: '2010-11-30',
          type: petTypes[2],
          visits: [],
        },
      ],
    },
    {
      id: 5,
      firstName: 'Peter',
      lastName: 'McTavish',
      address: '2387 S. Fair Way',
      city: 'Madison',
      telephone: '6085552765',
      pets: [
        {
          id: 6,
          name: 'George',
          birthDate: '2010-01-20',
          type: petTypes[3],
          visits: [],
        },
      ],
    },
    {
      id: 6,
      firstName: 'Jean',
      lastName: 'Coleman',
      address: '105 N. Lake St.',
      city: 'Monona',
      telephone: '6085552654',
      pets: [
        {
          id: 7,
          name: 'Samantha',
          birthDate: '2012-09-04',
          type: petTypes[0],
          visits: [
            {
              id: 1,
              date: '2013-01-01',
              description: 'rabies shot',
            },
            {
              id: 4,
              date: '2013-01-04',
              description: 'spayed',
            },
          ],
        },
        {
          id: 8,
          name: 'Max',
          birthDate: '2012-09-04',
          type: petTypes[0],
          visits: [
            {
              id: 2,
              date: '2013-01-02',
              description: 'rabies shot',
            },
            {
              id: 3,
              date: '2013-01-03',
              description: 'neutered',
            },
          ],
        },
      ],
    },
    {
      id: 7,
      firstName: 'Jeff',
      lastName: 'Black',
      address: '1450 Oak Blvd.',
      city: 'Monona',
      telephone: '6085555387',
      pets: [
        {
          id: 9,
          name: 'Lucky',
          birthDate: '2011-08-06',
          type: petTypes[4],
          visits: [],
        },
      ],
    },
    {
      id: 8,
      firstName: 'Maria',
      lastName: 'Escobito',
      address: '345 Maple St.',
      city: 'Madison',
      telephone: '6085557683',
      pets: [
        {
          id: 10,
          name: 'Mulligan',
          birthDate: '2007-02-24',
          type: petTypes[1],
          visits: [],
        },
      ],
    },
    {
      id: 9,
      firstName: 'David',
      lastName: 'Schroeder',
      address: '2749 Blackhawk Trail',
      city: 'Madison',
      telephone: '6085559435',
      pets: [
        {
          id: 11,
          name: 'Freddy',
          birthDate: '2010-03-09',
          type: petTypes[4],
          visits: [],
        },
      ],
    },
    {
      id: 10,
      firstName: 'Carlos',
      lastName: 'Estaban',
      address: '2335 Independence La.',
      city: 'Waunakee',
      telephone: '6085555487',
      pets: [
        {
          id: 12,
          name: 'Lucky',
          birthDate: '2010-06-24',
          type: petTypes[1],
          visits: [],
        },
        {
          id: 13,
          name: 'Sly',
          birthDate: '2012-06-08',
          type: petTypes[0],
          visits: [],
        },
      ],
    },
  ],
  vets: [
    { id: 1, firstName: 'James', lastName: 'Carter', specialties: [] },
    {
      id: 2,
      firstName: 'Helen',
      lastName: 'Leary',
      specialties: [{ id: 1, name: 'radiology' }],
    },
    {
      id: 3,
      firstName: 'Linda',
      lastName: 'Douglas',
      specialties: [
        { id: 2, name: 'surgery' },
        { id: 3, name: 'dentistry' },
      ],
    },
    {
      id: 4,
      firstName: 'Rafael',
      lastName: 'Ortega',
      specialties: [{ id: 2, name: 'surgery' }],
    },
    {
      id: 5,
      firstName: 'Henry',
      lastName: 'Stevens',
      specialties: [{ id: 1, name: 'radiology' }],
    },
    { id: 6, firstName: 'Sharon', lastName: 'Jenkins', specialties: [] },
  ],
};

let nextOwnerId = 11;
let nextPetId = 14;
let nextVisitId = 5;

function sortOwnersById(owners: Owner[]): Owner[] {
  return owners.toSorted((a, b) => a.id - b.id);
}

function parseErrorPayload(payload: unknown): ValidationErrors {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const fromArray = (payload as { errors?: Array<{ field?: string; defaultMessage?: string }> }).errors;
  if (Array.isArray(fromArray)) {
    const errors: ValidationErrors = {};
    fromArray.forEach((error) => {
      if (error.field) {
        errors[error.field] = error.defaultMessage ?? 'Error';
      }
    });
    return errors;
  }

  const fromMap = (payload as { fieldErrors?: Record<string, string> }).fieldErrors;
  if (fromMap && typeof fromMap === 'object') {
    return fromMap;
  }

  return {};
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
    ...init,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId);
  });

  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = await response.json();
    }
    catch {
      payload = null;
    }
    if (response.status === 400 || response.status === 422) {
      throw new ApiValidationError(parseErrorPayload(payload));
    }
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

async function withFallback<T>(remote: () => Promise<T>, local: () => T | Promise<T>): Promise<T> {
  if (restAvailability !== 'unavailable') {
    try {
      const value = await remote();
      restAvailability = 'available';
      return value;
    }
    catch (error) {
      if (error instanceof ApiValidationError) {
        throw error;
      }
      restAvailability = 'unavailable';
    }
  }
  return await local();
}

function mapSpecialties(raw: unknown): Specialty[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map((specialty) => {
      if (!specialty || typeof specialty !== 'object') {
        return null;
      }
      const item = specialty as { id?: number; name?: string };
      return {
        id: Number(item.id ?? 0),
        name: String(item.name ?? ''),
      };
    })
    .filter((value): value is Specialty => Boolean(value && value.name));
}

function mapPet(raw: unknown): Pet {
  const value = raw as {
    id?: number;
    name?: string;
    birthDate?: string;
    type?: { id?: number; name?: string } | string;
    visits?: unknown[];
  };

  const typeObject =
    value.type && typeof value.type === 'object'
      ? {
          id: Number((value.type as { id?: number }).id ?? 0),
          name: String((value.type as { name?: string }).name ?? ''),
        }
      : {
          id: 0,
          name: String(value.type ?? ''),
        };

  const safeType = petTypes.find((item) => item.name === typeObject.name) ?? typeObject;

  return {
    id: Number(value.id ?? 0),
    name: String(value.name ?? ''),
    birthDate: String(value.birthDate ?? ''),
    type: safeType,
    visits: Array.isArray(value.visits)
      ? value.visits.map((visit) => {
          const entry = visit as { id?: number; date?: string; description?: string };
          return {
            id: Number(entry.id ?? 0),
            date: String(entry.date ?? ''),
            description: String(entry.description ?? ''),
          };
        })
      : [],
  };
}

function mapOwner(raw: unknown): Owner {
  const value = raw as {
    id?: number;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    telephone?: string;
    pets?: unknown[];
  };
  return {
    id: Number(value.id ?? 0),
    firstName: String(value.firstName ?? ''),
    lastName: String(value.lastName ?? ''),
    address: String(value.address ?? ''),
    city: String(value.city ?? ''),
    telephone: String(value.telephone ?? ''),
    pets: Array.isArray(value.pets) ? value.pets.map(mapPet) : [],
  };
}

function ownerRouteId(owner: Owner): number {
  return Number(owner.id) || 0;
}

function mapVet(raw: unknown): Vet {
  const value = raw as {
    id?: number;
    firstName?: string;
    lastName?: string;
    specialties?: unknown[];
  };
  return {
    id: Number(value.id ?? 0),
    firstName: String(value.firstName ?? ''),
    lastName: String(value.lastName ?? ''),
    specialties: mapSpecialties(value.specialties),
  };
}

function paginate<T>(rows: T[], page: number): { items: T[]; totalPages: number; totalItems: number } {
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const pageIndex = Math.min(Math.max(page, 1), totalPages);
  const start = (pageIndex - 1) * PAGE_SIZE;
  return {
    items: rows.slice(start, start + PAGE_SIZE),
    totalPages,
    totalItems,
  };
}

function requiredOwnerErrors(payload: OwnerPayload): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!payload.firstName.trim()) {
    errors.firstName = 'is required';
  }
  if (!payload.lastName.trim()) {
    errors.lastName = 'is required';
  }
  if (!payload.address.trim()) {
    errors.address = 'is required';
  }
  if (!payload.city.trim()) {
    errors.city = 'is required';
  }
  if (!payload.telephone.trim()) {
    errors.telephone = 'is required';
  }
  else if (!/^\d{10}$/.test(payload.telephone.trim())) {
    errors.telephone = 'Telephone must be a 10-digit number';
  }
  return errors;
}

function requiredPetErrors(
  owner: Owner,
  payload: PetPayload,
  currentPetId?: number,
): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!payload.name.trim()) {
    errors.name = 'is required';
  }
  if (!payload.birthDate.trim()) {
    errors.birthDate = 'is required';
  }
  else {
    const parsedDate = new Date(`${payload.birthDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate > today) {
      errors.birthDate = 'invalid date';
    }
  }
  if (!payload.typeId) {
    errors.type = 'is required';
  }

  const duplicatePet = owner.pets.find(
    (pet) =>
      pet.name.toLowerCase() === payload.name.trim().toLowerCase() &&
      pet.id !== currentPetId,
  );
  if (duplicatePet) {
    errors.name = 'is already in use';
  }

  return errors;
}

function petPayloadForRest(payload: PetPayload, availableTypes: PetType[]) {
  const selectedType = availableTypes.find((entry) => entry.id === payload.typeId);
  return {
    name: payload.name.trim(),
    birthDate: payload.birthDate,
    type: selectedType
      ? { id: selectedType.id, name: selectedType.name }
      : { id: payload.typeId, name: '' },
  };
}

function requiredVisitErrors(payload: VisitPayload): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!payload.date.trim()) {
    errors.date = 'is required';
  }
  if (!payload.description.trim()) {
    errors.description = 'is required';
  }
  return errors;
}

export async function getOwners(lastName: string, page: number): Promise<PaginatedOwners> {
  return withFallback(
    async () => {
      const query = new URLSearchParams();
      query.set('lastName', lastName);
      query.set('page', String(page));
      const payload = await requestJson<unknown>(`/owners?${query.toString()}`);

      if (Array.isArray(payload)) {
        const owners = payload.map(mapOwner);
        const paged = paginate(sortOwnersById(owners), page);
        return {
          owners: paged.items,
          currentPage: page,
          totalPages: paged.totalPages,
          totalItems: paged.totalItems,
        };
      }

      const objectPayload = payload as {
        content?: unknown[];
        owners?: unknown[];
        totalPages?: number;
        totalElements?: number;
        number?: number;
      };
      const rows = objectPayload.content ?? objectPayload.owners ?? [];
      const owners = Array.isArray(rows) ? rows.map(mapOwner) : [];
      return {
        owners,
        currentPage: (objectPayload.number ?? page - 1) + 1,
        totalPages: Number(objectPayload.totalPages ?? 1),
        totalItems: Number(objectPayload.totalElements ?? owners.length),
      };
    },
    () => {
      const filtered = sortOwnersById(localState.owners).filter((owner) =>
        owner.lastName.toLowerCase().startsWith(lastName.trim().toLowerCase()),
      );
      const paged = paginate(filtered, page);
      return {
        owners: clone(paged.items),
        currentPage: page,
        totalPages: paged.totalPages,
        totalItems: paged.totalItems,
      };
    },
  );
}

export async function getOwner(ownerId: number): Promise<Owner | null> {
  return withFallback(
    async () => {
      const owner = await requestJson<unknown>(`/owners/${ownerId}`);
      return mapOwner(owner);
    },
    () => {
      const owner = localState.owners.find((entry) => entry.id === ownerId);
      return owner ? clone(owner) : null;
    },
  );
}

export async function createOwner(payload: OwnerPayload): Promise<Owner> {
  const localErrors = requiredOwnerErrors(payload);
  if (Object.keys(localErrors).length > 0) {
    throw new ApiValidationError(localErrors);
  }

  return withFallback(
    async () => {
      const owner = await requestJson<unknown>('/owners', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const createdOwner = mapOwner(owner);
      localState.owners.push(clone(createdOwner));
      nextOwnerId = Math.max(nextOwnerId, ownerRouteId(createdOwner) + 1);
      return createdOwner;
    },
    () => {
      const owner: Owner = {
        id: nextOwnerId++,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        address: payload.address.trim(),
        city: payload.city.trim(),
        telephone: payload.telephone.trim(),
        pets: [],
      };
      localState.owners.push(owner);
      return clone(owner);
    },
  );
}

export async function updateOwner(ownerId: number, payload: OwnerPayload): Promise<Owner> {
  const localErrors = requiredOwnerErrors(payload);
  if (Object.keys(localErrors).length > 0) {
    throw new ApiValidationError(localErrors);
  }

  return withFallback(
    async () => {
      const owner = await requestJson<unknown>(`/owners/${ownerId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...payload, id: ownerId }),
      });
      const updatedOwner = mapOwner(owner);
      const index = localState.owners.findIndex((entry) => entry.id === ownerId);
      if (index >= 0) {
        localState.owners[index] = clone(updatedOwner);
      }
      return updatedOwner;
    },
    () => {
      const owner = localState.owners.find((entry) => entry.id === ownerId);
      if (!owner) {
        throw new Error('Owner not found');
      }

      owner.firstName = payload.firstName.trim();
      owner.lastName = payload.lastName.trim();
      owner.address = payload.address.trim();
      owner.city = payload.city.trim();
      owner.telephone = payload.telephone.trim();
      return clone(owner);
    },
  );
}

export async function getPetTypes(): Promise<PetType[]> {
  return withFallback(
    async () => {
      const payload = await requestJson<unknown>('/pettypes');
      if (!Array.isArray(payload)) {
        return [];
      }
      return payload.map((entry) => {
        const row = entry as { id?: number; name?: string };
        return {
          id: Number(row.id ?? 0),
          name: String(row.name ?? ''),
        };
      });
    },
    () => clone(petTypes),
  );
}

export async function createPet(ownerId: number, payload: PetPayload): Promise<Owner> {
  const owner = localState.owners.find((entry) => entry.id === ownerId);
  if (!owner) {
    throw new Error('Owner not found');
  }

  const localErrors = requiredPetErrors(owner, payload);
  if (Object.keys(localErrors).length > 0) {
    throw new ApiValidationError(localErrors);
  }

  return withFallback(
    async () => {
      const restPayload = petPayloadForRest(payload, petTypes);
      const createdPet = await requestJson<unknown>(`/owners/${ownerId}/pets`, {
        method: 'POST',
        body: JSON.stringify(restPayload),
      });
      if (createdPet) {
        const created = mapPet(createdPet);
        const stateOwner = localState.owners.find((entry) => entry.id === ownerId);
        if (stateOwner) {
          const existingIndex = stateOwner.pets.findIndex((entry) => entry.id === created.id);
          if (existingIndex >= 0) {
            stateOwner.pets[existingIndex] = created;
          }
          else {
            stateOwner.pets.push(created);
          }
          nextPetId = Math.max(nextPetId, created.id + 1);
        }
      }
      const updated = await getOwner(ownerId);
      if (!updated) {
        throw new Error('Owner not found');
      }
      return updated;
    },
    () => {
      const type = petTypes.find((entry) => entry.id === payload.typeId);
      if (!type) {
        throw new ApiValidationError({ type: 'is required' });
      }
      owner.pets.push({
        id: nextPetId++,
        name: payload.name.trim(),
        birthDate: payload.birthDate,
        type,
        visits: [],
      });
      return clone(owner);
    },
  );
}

export async function updatePet(ownerId: number, petId: number, payload: PetPayload): Promise<Owner> {
  const owner = localState.owners.find((entry) => entry.id === ownerId);
  if (!owner) {
    throw new Error('Owner not found');
  }
  const pet = owner.pets.find((entry) => entry.id === petId);
  if (!pet) {
    throw new Error('Pet not found');
  }

  const localErrors = requiredPetErrors(owner, payload, petId);
  if (Object.keys(localErrors).length > 0) {
    throw new ApiValidationError(localErrors);
  }

  return withFallback(
    async () => {
      const restPayload = petPayloadForRest(payload, petTypes);
      const updatedRemotePet = await requestJson<unknown>(`/owners/${ownerId}/pets/${petId}`, {
        method: 'PUT',
        body: JSON.stringify(restPayload),
      });
      if (updatedRemotePet) {
        const updatedPet = mapPet(updatedRemotePet);
        const stateOwner = localState.owners.find((entry) => entry.id === ownerId);
        if (stateOwner) {
          const existingIndex = stateOwner.pets.findIndex((entry) => entry.id === petId);
          if (existingIndex >= 0) {
            stateOwner.pets[existingIndex] = updatedPet;
          }
        }
      }
      const updated = await getOwner(ownerId);
      if (!updated) {
        throw new Error('Owner not found');
      }
      return updated;
    },
    () => {
      const type = petTypes.find((entry) => entry.id === payload.typeId);
      if (!type) {
        throw new ApiValidationError({ type: 'is required' });
      }
      pet.name = payload.name.trim();
      pet.birthDate = payload.birthDate;
      pet.type = type;
      return clone(owner);
    },
  );
}

export async function createVisit(
  ownerId: number,
  petId: number,
  payload: VisitPayload,
): Promise<Owner> {
  const owner = localState.owners.find((entry) => entry.id === ownerId);
  const pet = owner?.pets.find((entry) => entry.id === petId);
  if (!owner || !pet) {
    throw new Error('Owner or pet not found');
  }

  const localErrors = requiredVisitErrors(payload);
  if (Object.keys(localErrors).length > 0) {
    throw new ApiValidationError(localErrors);
  }

  return withFallback(
    async () => {
      const createdVisit = await requestJson<unknown>(`/owners/${ownerId}/pets/${petId}/visits`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (createdVisit) {
        const stateOwner = localState.owners.find((entry) => entry.id === ownerId);
        const statePet = stateOwner?.pets.find((entry) => entry.id === petId);
        if (statePet) {
          const visit = createdVisit as { id?: number; date?: string; description?: string };
          statePet.visits.push({
            id: Number(visit.id ?? nextVisitId++),
            date: String(visit.date ?? payload.date),
            description: String(visit.description ?? payload.description),
          });
          statePet.visits.sort((a, b) => a.date.localeCompare(b.date));
        }
      }
      const updated = await getOwner(ownerId);
      if (!updated) {
        throw new Error('Owner not found');
      }
      return updated;
    },
    () => {
      pet.visits.push({
        id: nextVisitId++,
        date: payload.date,
        description: payload.description.trim(),
      });
      pet.visits.sort((a, b) => a.date.localeCompare(b.date));
      return clone(owner);
    },
  );
}

export async function getVets(page: number): Promise<PaginatedVets> {
  return withFallback(
    async () => {
      const query = new URLSearchParams();
      query.set('page', String(page));
      const payload = await requestJson<unknown>(`/vets?${query.toString()}`);
      if (Array.isArray(payload)) {
        const vets = payload.map(mapVet);
        const paged = paginate(vets, page);
        return {
          vets: paged.items,
          currentPage: page,
          totalPages: paged.totalPages,
          totalItems: paged.totalItems,
        };
      }
      const objectPayload = payload as {
        content?: unknown[];
        vets?: unknown[] | { vetList?: unknown[] };
        totalPages?: number;
        totalElements?: number;
        number?: number;
      };
      let rows: unknown[] = [];
      if (Array.isArray(objectPayload.content)) {
        rows = objectPayload.content;
      }
      else if (Array.isArray(objectPayload.vets)) {
        rows = objectPayload.vets;
      }
      else if (
        objectPayload.vets &&
        typeof objectPayload.vets === 'object' &&
        Array.isArray((objectPayload.vets as { vetList?: unknown[] }).vetList)
      ) {
        rows = (objectPayload.vets as { vetList: unknown[] }).vetList;
      }
      const vets = rows.map(mapVet);
      return {
        vets,
        currentPage: (objectPayload.number ?? page - 1) + 1,
        totalPages: Number(objectPayload.totalPages ?? 1),
        totalItems: Number(objectPayload.totalElements ?? vets.length),
      };
    },
    () => {
      const paged = paginate(localState.vets, page);
      return {
        vets: clone(paged.items),
        currentPage: page,
        totalPages: paged.totalPages,
        totalItems: paged.totalItems,
      };
    },
  );
}
