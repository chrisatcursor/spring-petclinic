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

class ApiHttpError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, payload: unknown) {
    super(`Request failed with status ${status}`);
    this.status = status;
    this.payload = payload;
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

const PAGE_SIZE = 5;

function defaultApiBase(): string {
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:9966/petclinic/api`;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

const API_BASE = trimTrailingSlash(
  import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_API_BASE_URL ?? defaultApiBase(),
);

function parseErrorPayload(payload: unknown): ValidationErrors {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const fromArray = (payload as { errors?: Array<{ field?: string; defaultMessage?: string; message?: string }> })
    .errors;
  if (Array.isArray(fromArray)) {
    const errors: ValidationErrors = {};
    fromArray.forEach((error) => {
      if (error.field) {
        errors[error.field] = error.defaultMessage ?? error.message ?? 'Error';
      }
    });
    return errors;
  }

  const fromMap = (payload as { fieldErrors?: Record<string, string> }).fieldErrors;
  if (fromMap && typeof fromMap === 'object') {
    return fromMap;
  }

  const message = (payload as { message?: string }).message;
  return message ? { form: message } : {};
}

async function readPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = await readPayload(response);
    }
    catch {
      payload = null;
    }

    if (response.status === 400 || response.status === 422) {
      throw new ApiValidationError(parseErrorPayload(payload));
    }
    throw new ApiHttpError(response.status, payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function sortById<T extends { id: number }>(rows: T[]): T[] {
  return rows.toSorted((a, b) => a.id - b.id);
}

function toDateOnly(value: unknown): string {
  return String(value ?? '').split('T')[0];
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

function mapPetType(raw: unknown): PetType {
  if (raw && typeof raw === 'object') {
    const value = raw as { id?: number; name?: string };
    return {
      id: Number(value.id ?? 0),
      name: String(value.name ?? ''),
    };
  }
  return {
    id: 0,
    name: String(raw ?? ''),
  };
}

function mapVisit(raw: unknown): Visit {
  const value = raw as { id?: number; date?: string; description?: string };
  return {
    id: Number(value.id ?? 0),
    date: toDateOnly(value.date),
    description: String(value.description ?? ''),
  };
}

function mapPet(raw: unknown): Pet {
  const value = raw as {
    id?: number;
    name?: string;
    birthDate?: string;
    type?: unknown;
    visits?: unknown[];
  };

  return {
    id: Number(value.id ?? 0),
    name: String(value.name ?? ''),
    birthDate: toDateOnly(value.birthDate),
    type: mapPetType(value.type),
    visits: Array.isArray(value.visits)
      ? value.visits.map(mapVisit).toSorted((a, b) => a.date.localeCompare(b.date))
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
    pets: Array.isArray(value.pets)
      ? value.pets.map(mapPet).toSorted((a, b) => a.name.localeCompare(b.name))
      : [],
  };
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

function paginate<T>(rows: T[], page: number): { items: T[]; currentPage: number; totalPages: number; totalItems: number } {
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  return {
    items: rows.slice(start, start + PAGE_SIZE),
    currentPage,
    totalPages,
    totalItems,
  };
}

function ownerErrors(payload: OwnerPayload): ValidationErrors {
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

function petErrors(owner: Owner, payload: PetPayload, currentPetId?: number): ValidationErrors {
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

function visitErrors(payload: VisitPayload): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!payload.date.trim()) {
    errors.date = 'is required';
  }
  if (!payload.description.trim()) {
    errors.description = 'is required';
  }
  return errors;
}

function throwIfInvalid(errors: ValidationErrors): void {
  if (Object.keys(errors).length > 0) {
    throw new ApiValidationError(errors);
  }
}

function cleanOwnerPayload(payload: OwnerPayload): OwnerPayload {
  return {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    address: payload.address.trim(),
    city: payload.city.trim(),
    telephone: payload.telephone.trim(),
  };
}

async function petPayloadForRest(payload: PetPayload) {
  const selectedType = (await getPetTypes()).find((entry) => entry.id === payload.typeId);
  if (!selectedType) {
    throw new ApiValidationError({ type: 'is required' });
  }
  return {
    name: payload.name.trim(),
    birthDate: payload.birthDate,
    type: {
      id: selectedType.id,
      name: selectedType.name,
    },
  };
}

export async function getOwners(lastName: string, page: number): Promise<PaginatedOwners> {
  const query = new URLSearchParams();
  const trimmedLastName = lastName.trim();
  if (trimmedLastName) {
    query.set('lastName', trimmedLastName);
  }

  try {
    const payload = await requestJson<unknown>(`/owners${query.toString() ? `?${query.toString()}` : ''}`);
    const rows = Array.isArray(payload) ? payload.map(mapOwner) : [];
    const paged = paginate(sortById(rows), page);
    return {
      owners: paged.items,
      currentPage: paged.currentPage,
      totalPages: paged.totalPages,
      totalItems: paged.totalItems,
    };
  }
  catch (error) {
    if (error instanceof ApiHttpError && error.status === 404) {
      return {
        owners: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      };
    }
    throw error;
  }
}

export async function getOwner(ownerId: number): Promise<Owner | null> {
  try {
    return mapOwner(await requestJson<unknown>(`/owners/${ownerId}`));
  }
  catch (error) {
    if (error instanceof ApiHttpError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createOwner(payload: OwnerPayload): Promise<Owner> {
  throwIfInvalid(ownerErrors(payload));
  return mapOwner(
    await requestJson<unknown>('/owners', {
      method: 'POST',
      body: JSON.stringify(cleanOwnerPayload(payload)),
    }),
  );
}

export async function updateOwner(ownerId: number, payload: OwnerPayload): Promise<Owner> {
  throwIfInvalid(ownerErrors(payload));
  await requestJson<void>(`/owners/${ownerId}`, {
    method: 'PUT',
    body: JSON.stringify(cleanOwnerPayload(payload)),
  });
  const updatedOwner = await getOwner(ownerId);
  if (!updatedOwner) {
    throw new Error('Owner not found');
  }
  return updatedOwner;
}

export async function getPetTypes(): Promise<PetType[]> {
  const payload = await requestJson<unknown>('/pettypes');
  if (!Array.isArray(payload)) {
    return [];
  }
  return sortById(payload.map(mapPetType)).filter((type) => type.name);
}

export async function createPet(ownerId: number, payload: PetPayload): Promise<Owner> {
  const owner = await getOwner(ownerId);
  if (!owner) {
    throw new Error('Owner not found');
  }
  throwIfInvalid(petErrors(owner, payload));

  await requestJson<unknown>(`/owners/${ownerId}/pets`, {
    method: 'POST',
    body: JSON.stringify(await petPayloadForRest(payload)),
  });

  const updatedOwner = await getOwner(ownerId);
  if (!updatedOwner) {
    throw new Error('Owner not found');
  }
  return updatedOwner;
}

export async function updatePet(ownerId: number, petId: number, payload: PetPayload): Promise<Owner> {
  const owner = await getOwner(ownerId);
  if (!owner) {
    throw new Error('Owner not found');
  }
  if (!owner.pets.some((entry) => entry.id === petId)) {
    throw new Error('Pet not found');
  }
  throwIfInvalid(petErrors(owner, payload, petId));

  await requestJson<void>(`/owners/${ownerId}/pets/${petId}`, {
    method: 'PUT',
    body: JSON.stringify(await petPayloadForRest(payload)),
  });

  const updatedOwner = await getOwner(ownerId);
  if (!updatedOwner) {
    throw new Error('Owner not found');
  }
  return updatedOwner;
}

export async function createVisit(
  ownerId: number,
  petId: number,
  payload: VisitPayload,
): Promise<Owner> {
  throwIfInvalid(visitErrors(payload));

  await requestJson<unknown>(`/owners/${ownerId}/pets/${petId}/visits`, {
    method: 'POST',
    body: JSON.stringify({
      date: payload.date,
      description: payload.description.trim(),
    }),
  });

  const updatedOwner = await getOwner(ownerId);
  if (!updatedOwner) {
    throw new Error('Owner not found');
  }
  return updatedOwner;
}

export async function getVets(page: number): Promise<PaginatedVets> {
  const payload = await requestJson<unknown>('/vets');
  const rows = Array.isArray(payload) ? payload.map(mapVet) : [];
  const paged = paginate(sortById(rows), page);
  return {
    vets: paged.items,
    currentPage: paged.currentPage,
    totalPages: paged.totalPages,
    totalItems: paged.totalItems,
  };
}
