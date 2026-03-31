import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

type Specialty = {
  id: number;
  name: string;
};

type Vet = {
  id: number;
  firstName: string;
  lastName: string;
  specialties: Specialty[];
};

type PetType = {
  id: number;
  name: string;
};

type Visit = {
  id: number;
  date?: string;
  description: string;
  petId?: number;
};

type Pet = {
  id: number;
  name: string;
  birthDate: string;
  type: PetType;
  visits: Visit[];
};

type Owner = {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
  pets: Pet[];
};

type OwnerFormState = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
};

type PetFormState = {
  name: string;
  birthDate: string;
  typeName: string;
};

type VisitFormState = {
  date: string;
  description: string;
};

type FieldErrors = Record<string, string>;

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:9966/petclinic/api'
).replace(/\/$/, '');
const PAGE_SIZE = 5;

class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, payload: unknown) {
    super(`API request failed with status ${status}`);
    this.status = status;
    this.payload = payload;
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
  const contentType = response.headers.get('content-type') ?? '';
  const hasJson = contentType.includes('application/json');
  const payload = hasJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(response.status, payload);
  }

  return payload as T;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (
      typeof error.payload === 'object' &&
      error.payload !== null &&
      'detail' in error.payload &&
      typeof error.payload.detail === 'string'
    ) {
      return error.payload.detail;
    }
    return `Request failed (${error.status}).`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

function formatDate(dateValue?: string): string {
  if (!dateValue) {
    return '';
  }
  return dateValue.slice(0, 10);
}

function todayDateValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function ownerFullName(owner: Pick<Owner, 'firstName' | 'lastName'>): string {
  return `${owner.firstName} ${owner.lastName}`;
}

function menuForPath(pathname: string): 'home' | 'owners' | 'vets' | 'error' {
  if (pathname === '/') {
    return 'home';
  }
  if (pathname.startsWith('/owners')) {
    return 'owners';
  }
  if (pathname.startsWith('/vets.html')) {
    return 'vets';
  }
  return 'error';
}

type ProblemDetail = {
  detail?: string;
};

function isProblemDetail(value: unknown): value is ProblemDetail {
  return typeof value === 'object' && value !== null && 'detail' in value;
}

function NavItem(props: {
  to: string;
  icon: string;
  text: string;
  testId: string;
  isActive: boolean;
}) {
  return (
    <li className="nav-item">
      <Link
        className={props.isActive ? 'nav-link active' : 'nav-link'}
        to={props.to}
        data-testid={props.testId}
      >
        <span className={`fa fa-${props.icon}`} aria-hidden="true"></span>{' '}
        <span>{props.text}</span>
      </Link>
    </li>
  );
}

function Layout() {
  const location = useLocation();
  const activeMenu = menuForPath(location.pathname);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark" role="navigation">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <span></span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#main-navbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="main-navbar">
            <ul className="nav navbar-nav me-auto">
              <NavItem
                to="/"
                icon="home"
                text="Home"
                testId="nav-home"
                isActive={activeMenu === 'home'}
              />
              <NavItem
                to="/owners/find"
                icon="search"
                text="Find Owners"
                testId="nav-owners"
                isActive={activeMenu === 'owners'}
              />
              <NavItem
                to="/vets.html"
                icon="th-list"
                text="Veterinarians"
                testId="nav-vets"
                isActive={activeMenu === 'vets'}
              />
              <NavItem
                to="/oups"
                icon="exclamation-triangle"
                text="Error"
                testId="nav-error"
                isActive={activeMenu === 'error'}
              />
            </ul>
          </div>
        </div>
      </nav>
      <div className="container-fluid">
        <div className="container xd-container">
          <Outlet />
          <br />
          <br />
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <img
                  src="/resources/images/spring-logo.svg"
                  alt="VMware Tanzu Logo"
                  className="logo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function HomePage() {
  return (
    <>
      <h2>Welcome</h2>
      <div className="row">
        <div className="col-md-12">
          <img
            className="img-responsive"
            src="/resources/images/pets.png"
            alt="Pets"
          />
        </div>
      </div>
    </>
  );
}

function ErrorPage(props: { status: 404 | 500 }) {
  const statusMessage =
    props.status === 404
      ? 'The requested page was not found.'
      : 'An internal server error occurred.';

  return (
    <>
      <img src="/resources/images/pets.png" alt="Pets" />
      <h2>Something happened...</h2>
      <p>{statusMessage}</p>
    </>
  );
}

function FindOwnersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [lastName, setLastName] = useState(searchParams.get('lastName') ?? '');

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = lastName.trim();
    const query = trimmed.length > 0 ? `?lastName=${encodeURIComponent(trimmed)}` : '';
    navigate(`/owners${query}`);
  }

  return (
    <>
      <h2>Find Owners</h2>
      <form
        className="form-horizontal"
        id="search-owner-form"
        data-testid="search-owner-form"
        onSubmit={onSubmit}
      >
        <div className="form-group">
          <div className="control-group" id="lastNameGroup">
            <label className="col-sm-2 control-label" htmlFor="lastName">
              Last Name
            </label>
            <div className="col-sm-10">
              <input
                id="lastName"
                className="form-control"
                size={30}
                maxLength={80}
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button type="submit" className="btn btn-primary">
              Find Owner
            </button>
          </div>
        </div>
        <Link className="btn btn-primary" to="/owners/new">
          Add Owner
        </Link>
      </form>
    </>
  );
}

function Pagination(props: {
  totalPages: number;
  currentPage: number;
  basePath: string;
  extraParams?: Record<string, string>;
}) {
  if (props.totalPages <= 1) {
    return null;
  }

  function buildLink(page: number): string {
    const params = new URLSearchParams();
    Object.entries(props.extraParams ?? {}).forEach(([key, value]) => {
      if (value.length > 0) {
        params.set(key, value);
      }
    });
    if (page > 1) {
      params.set('page', String(page));
    }
    const query = params.toString();
    return query.length > 0 ? `${props.basePath}?${query}` : props.basePath;
  }

  return (
    <div>
      <span>Pages:</span>
      <span>[</span>
      {Array.from({ length: props.totalPages }, (_, index) => index + 1).map((page) =>
        page === props.currentPage ? (
          <span key={page}>{page}</span>
        ) : (
          <Link key={page} to={buildLink(page)}>
            {page}
          </Link>
        ),
      )}
      <span>]&nbsp;</span>
      <span>
        {props.currentPage > 1 ? (
          <Link
            to={buildLink(1)}
            title="First"
            className="fa fa-fast-backward"
            aria-label="First"
          />
        ) : (
          <span title="First" className="fa fa-fast-backward" />
        )}
      </span>
      <span>
        {props.currentPage > 1 ? (
          <Link
            to={buildLink(props.currentPage - 1)}
            title="Previous"
            className="fa fa-step-backward"
            aria-label="Previous"
          />
        ) : (
          <span title="Previous" className="fa fa-step-backward" />
        )}
      </span>
      <span>
        {props.currentPage < props.totalPages ? (
          <Link
            to={buildLink(props.currentPage + 1)}
            title="Next"
            className="fa fa-step-forward"
            aria-label="Next"
          />
        ) : (
          <span title="Next" className="fa fa-step-forward" />
        )}
      </span>
      <span>
        {props.currentPage < props.totalPages ? (
          <Link
            to={buildLink(props.totalPages)}
            title="Last"
            className="fa fa-fast-forward"
            aria-label="Last"
          />
        ) : (
          <span title="Last" className="fa fa-fast-forward" />
        )}
      </span>
    </div>
  );
}

function OwnersListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lastName = searchParams.get('lastName')?.trim() ?? '';
  const rawPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const requestedPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadOwners() {
      setLoading(true);
      setErrorMessage('');
      try {
        const query = lastName.length > 0 ? `?lastName=${encodeURIComponent(lastName)}` : '';
        const response = await apiRequest<Owner[]>(`/owners${query}`);
        if (!cancelled) {
          setOwners(response);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof ApiError && error.status === 404) {
            setOwners([]);
          } else {
            setErrorMessage(toErrorMessage(error));
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOwners();

    return () => {
      cancelled = true;
    };
  }, [lastName]);

  useEffect(() => {
    if (!loading && owners.length === 1) {
      navigate(`/owners/${owners[0].id}`, { replace: true });
    }
  }, [loading, navigate, owners]);

  const totalPages = Math.max(1, Math.ceil(owners.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageOwners = owners.slice(pageStart, pageStart + PAGE_SIZE);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (errorMessage.length > 0) {
    return (
      <>
        <h2>Owners</h2>
        <p>{errorMessage}</p>
      </>
    );
  }

  if (owners.length === 0) {
    return (
      <>
        <h2>Find Owners</h2>
        <p>{`${
          lastName.length > 0 ? `Owner Last Name '${lastName}'` : 'Owner'
        } has not been found`}</p>
      </>
    );
  }

  return (
    <>
      <h2>Owners</h2>
      <table id="owners" className="table table-striped" data-testid="owners-table">
        <thead>
          <tr>
            <th style={{ width: '150px' }}>Name</th>
            <th style={{ width: '200px' }}>Address</th>
            <th>City</th>
            <th style={{ width: '120px' }}>Telephone</th>
            <th>Pets</th>
          </tr>
        </thead>
        <tbody>
          {pageOwners.map((owner) => (
            <tr key={owner.id} data-testid="owner-row">
              <td>
                <Link to={`/owners/${owner.id}`} data-testid="owner-name">
                  {ownerFullName(owner)}
                </Link>
              </td>
              <td>{owner.address}</td>
              <td>{owner.city}</td>
              <td>{owner.telephone}</td>
              <td>{owner.pets.map((pet) => pet.name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        basePath="/owners"
        extraParams={lastName.length > 0 ? { lastName } : undefined}
      />
    </>
  );
}

function OwnerDetailsPage() {
  const { ownerId } = useParams();
  const [searchParams] = useSearchParams();
  const successMessage = searchParams.get('message') ?? '';

  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadOwner() {
      if (!ownerId) {
        setErrorMessage('Owner not found.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setErrorMessage('');
      try {
        const response = await apiRequest<Owner>(`/owners/${ownerId}`);
        if (!cancelled) {
          setOwner(response);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(toErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOwner();
    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!owner) {
    return (
      <>
        <h2>Owner Information</h2>
        <p>{errorMessage || 'Owner not found.'}</p>
      </>
    );
  }

  return (
    <>
      <h2>Owner Information</h2>
      {successMessage.length > 0 ? (
        <div className="alert alert-success" id="success-message">
          <span>{successMessage}</span>
        </div>
      ) : null}
      {errorMessage.length > 0 ? (
        <div className="alert alert-danger" id="error-message">
          <span>{errorMessage}</span>
        </div>
      ) : null}
      <table className="table table-striped" data-testid="owner-information">
        <tbody>
          <tr>
            <th>Name</th>
            <td>
              <b>{ownerFullName(owner)}</b>
            </td>
          </tr>
          <tr>
            <th>Address</th>
            <td>{owner.address}</td>
          </tr>
          <tr>
            <th>City</th>
            <td>{owner.city}</td>
          </tr>
          <tr>
            <th>Telephone</th>
            <td>{owner.telephone}</td>
          </tr>
        </tbody>
      </table>

      <Link
        to={`/owners/${owner.id}/edit`}
        className="btn btn-primary"
        data-testid="edit-owner-link"
      >
        Edit Owner
      </Link>{' '}
      <Link
        to={`/owners/${owner.id}/pets/new`}
        className="btn btn-primary"
        data-testid="add-pet-link"
      >
        Add New Pet
      </Link>

      <br />
      <br />
      <br />
      <h2>Pets and Visits</h2>

      <table className="table table-striped" data-testid="pets-and-visits">
        <tbody>
          {owner.pets.map((pet) => (
            <tr key={pet.id}>
              <td valign="top">
                <dl className="dl-horizontal">
                  <dt>Name</dt>
                  <dd>{pet.name}</dd>
                  <dt>Birth Date</dt>
                  <dd>{formatDate(pet.birthDate)}</dd>
                  <dt>Type</dt>
                  <dd>{pet.type?.name}</dd>
                </dl>
              </td>
              <td valign="top">
                <table className="table-condensed" data-testid="visits-table">
                  <thead>
                    <tr>
                      <th>Visit Date</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pet.visits.map((visit) => (
                      <tr key={visit.id}>
                        <td>{formatDate(visit.date)}</td>
                        <td>{visit.description}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        <Link to={`/owners/${owner.id}/pets/${pet.id}/edit`}>Edit Pet</Link>
                      </td>
                      <td>
                        <Link to={`/owners/${owner.id}/pets/${pet.id}/visits/new`}>Add Visit</Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function OwnerFormPage() {
  const navigate = useNavigate();
  const { ownerId } = useParams();
  const isCreate = !ownerId;
  const [loading, setLoading] = useState(!isCreate);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState<OwnerFormState>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    telephone: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    let cancelled = false;

    async function loadOwner() {
      if (isCreate || !ownerId) {
        return;
      }

      setLoading(true);
      setErrorMessage('');
      try {
        const owner = await apiRequest<Owner>(`/owners/${ownerId}`);
        if (!cancelled) {
          setForm({
            firstName: owner.firstName,
            lastName: owner.lastName,
            address: owner.address,
            city: owner.city,
            telephone: owner.telephone,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(toErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOwner();
    return () => {
      cancelled = true;
    };
  }, [isCreate, ownerId]);

  function validateOwnerForm(values: OwnerFormState): FieldErrors {
    const errors: FieldErrors = {};

    if (!values.firstName.trim()) {
      errors.firstName = 'is required';
    }
    if (!values.lastName.trim()) {
      errors.lastName = 'is required';
    }
    if (!values.address.trim()) {
      errors.address = 'is required';
    }
    if (!values.city.trim()) {
      errors.city = 'is required';
    }
    if (!values.telephone.trim()) {
      errors.telephone = 'is required';
    } else if (!/^\d+$/.test(values.telephone.trim())) {
      errors.telephone = 'must be all numeric';
    } else if (!/^\d{10}$/.test(values.telephone.trim())) {
      errors.telephone = 'must be a 10-digit number';
    }

    return errors;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateOwnerForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      telephone: form.telephone.trim(),
    };

    try {
      if (isCreate) {
        const createdOwner = await apiRequest<Owner>('/owners', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        navigate(
          `/owners/${createdOwner.id}?message=${encodeURIComponent('New Owner Created')}`,
        );
      } else if (ownerId) {
        await apiRequest<unknown>(`/owners/${ownerId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        navigate(
          `/owners/${ownerId}?message=${encodeURIComponent('Owner Values Updated')}`,
        );
      }
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
  }

  function updateField(name: keyof OwnerFormState, value: string) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  const submitText = isCreate ? 'Add Owner' : 'Update Owner';

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>Owner</h2>
      {errorMessage.length > 0 ? (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <form
        className="form-horizontal"
        id="add-owner-form"
        data-testid="owner-form"
        onSubmit={onSubmit}
      >
        <div className="form-group has-feedback">
          {(
            [
              ['firstName', 'First Name'],
              ['lastName', 'Last Name'],
              ['address', 'Address'],
              ['city', 'City'],
              ['telephone', 'Telephone'],
            ] as Array<[keyof OwnerFormState, string]>
          ).map(([field, label]) => (
            <div
              key={field}
              className={`form-group ${fieldErrors[field] ? 'has-error' : ''}`}
            >
              <label className="col-sm-2 control-label" htmlFor={field}>
                {label}
              </label>
              <div className="col-sm-10">
                <input
                  id={field}
                  className="form-control"
                  value={form[field]}
                  onChange={(event) => {
                    updateField(field, event.target.value);
                  }}
                />
                {fieldErrors[field] ? (
                  <span className="help-inline">
                    <p>{fieldErrors[field]}</p>
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button className="btn btn-primary" type="submit">
              {submitText}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

function PetFormPage() {
  const navigate = useNavigate();
  const { ownerId, petId } = useParams();
  const isCreate = !petId;

  const [owner, setOwner] = useState<Owner | null>(null);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<PetFormState>({
    name: '',
    birthDate: '',
    typeName: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!ownerId) {
        setErrorMessage('Owner not found.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');
      try {
        const [ownerResponse, petTypeResponse] = await Promise.all([
          apiRequest<Owner>(`/owners/${ownerId}`),
          apiRequest<PetType[]>('/pettypes'),
        ]);

        if (cancelled) {
          return;
        }

        setOwner(ownerResponse);
        setPetTypes(petTypeResponse);
        setForm((previous) => ({
          ...previous,
          typeName: petTypeResponse[0]?.name ?? '',
        }));

        if (!isCreate && petId) {
          const pet = ownerResponse.pets.find((candidate) => String(candidate.id) === petId);
          if (!pet) {
            setErrorMessage('Pet not found.');
          } else {
            setForm({
              name: pet.name,
              birthDate: formatDate(pet.birthDate),
              typeName: pet.type.name,
            });
          }
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(toErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadData();
    return () => {
      cancelled = true;
    };
  }, [isCreate, ownerId, petId]);

  const duplicatePetName = useMemo(() => {
    if (!owner) {
      return false;
    }
    return owner.pets.some((pet) => {
      const sameName = pet.name.trim().toLowerCase() === form.name.trim().toLowerCase();
      if (!sameName) {
        return false;
      }
      if (isCreate) {
        return true;
      }
      return String(pet.id) !== petId;
    });
  }, [form.name, isCreate, owner, petId]);

  function validatePetForm(values: PetFormState): FieldErrors {
    const errors: FieldErrors = {};

    if (!values.name.trim()) {
      errors.name = 'is required';
    } else if (duplicatePetName) {
      errors.name = 'is already in use';
    }

    if (!values.birthDate.trim()) {
      errors.birthDate = 'is required';
    } else if (values.birthDate > todayDateValue()) {
      errors.birthDate = 'invalid date';
    }

    if (!values.typeName.trim()) {
      errors.type = 'is required';
    }

    return errors;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ownerId || !owner) {
      setErrorMessage('Owner not found.');
      return;
    }

    const errors = validatePetForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const selectedType = petTypes.find((type) => type.name === form.typeName);
    if (!selectedType) {
      setErrorMessage('Pet type is required.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      birthDate: form.birthDate,
      type: {
        id: selectedType.id,
        name: selectedType.name,
      },
    };

    try {
      if (isCreate) {
        await apiRequest<unknown>(`/owners/${ownerId}/pets`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        navigate(
          `/owners/${ownerId}?message=${encodeURIComponent('New Pet has been Added')}`,
        );
      } else if (petId) {
        await apiRequest<unknown>(`/owners/${ownerId}/pets/${petId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        navigate(
          `/owners/${ownerId}?message=${encodeURIComponent('Pet details has been edited')}`,
        );
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 400 && isProblemDetail(error.payload)) {
        setErrorMessage(error.payload.detail ?? 'Request failed (400).');
      } else {
        setErrorMessage(toErrorMessage(error));
      }
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>
        {isCreate ? 'New ' : ''}
        <span>Pet</span>
      </h2>
      {errorMessage.length > 0 ? (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <form className="form-horizontal" data-testid="pet-form" onSubmit={onSubmit}>
        <div className="form-group has-feedback">
          <div className="form-group">
            <label className="col-sm-2 control-label">Owner</label>
            <div className="col-sm-10">
              <span>{owner ? ownerFullName(owner) : ''}</span>
            </div>
          </div>

          <div className={`form-group ${fieldErrors.name ? 'has-error' : ''}`}>
            <label className="col-sm-2 control-label" htmlFor="pet-name">
              Name
            </label>
            <div className="col-sm-10">
              <input
                id="pet-name"
                className="form-control"
                value={form.name}
                onChange={(event) => {
                  setForm((previous) => ({ ...previous, name: event.target.value }));
                }}
              />
              {fieldErrors.name ? (
                <span className="help-inline">
                  <p>{fieldErrors.name}</p>
                </span>
              ) : null}
            </div>
          </div>

          <div className={`form-group ${fieldErrors.birthDate ? 'has-error' : ''}`}>
            <label className="col-sm-2 control-label" htmlFor="pet-birth-date">
              Birth Date
            </label>
            <div className="col-sm-10">
              <input
                id="pet-birth-date"
                type="date"
                className="form-control"
                value={form.birthDate}
                onChange={(event) => {
                  setForm((previous) => ({
                    ...previous,
                    birthDate: event.target.value,
                  }));
                }}
              />
              {fieldErrors.birthDate ? (
                <span className="help-inline">
                  <p>{fieldErrors.birthDate}</p>
                </span>
              ) : null}
            </div>
          </div>

          <div className={`form-group ${fieldErrors.type ? 'has-error' : ''}`}>
            <label className="col-sm-2 control-label" htmlFor="pet-type">
              Type
            </label>
            <div className="col-sm-10">
              <select
                id="pet-type"
                className="form-control"
                value={form.typeName}
                onChange={(event) => {
                  setForm((previous) => ({
                    ...previous,
                    typeName: event.target.value,
                  }));
                }}
              >
                {petTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
              {fieldErrors.type ? (
                <span className="help-inline">
                  <p>{fieldErrors.type}</p>
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button className="btn btn-primary" type="submit">
              {isCreate ? 'Add Pet' : 'Update Pet'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

function VisitFormPage() {
  const navigate = useNavigate();
  const { ownerId, petId } = useParams();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<VisitFormState>({
    date: '',
    description: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!ownerId || !petId) {
        setErrorMessage('Owner or pet not found.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');
      try {
        const ownerResponse = await apiRequest<Owner>(`/owners/${ownerId}`);
        const petResponse = ownerResponse.pets.find(
          (candidate) => String(candidate.id) === petId,
        );
        if (!cancelled) {
          setOwner(ownerResponse);
          setPet(petResponse ?? null);
          if (!petResponse) {
            setErrorMessage('Pet not found.');
          }
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(toErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadData();
    return () => {
      cancelled = true;
    };
  }, [ownerId, petId]);

  function validateVisitForm(values: VisitFormState): FieldErrors {
    const errors: FieldErrors = {};
    if (!values.date.trim()) {
      errors.date = 'is required';
    }
    if (!values.description.trim()) {
      errors.description = 'is required';
    }
    return errors;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ownerId || !petId) {
      setErrorMessage('Owner or pet not found.');
      return;
    }

    const errors = validateVisitForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = {
      date: form.date || undefined,
      description: form.description.trim(),
    };

    try {
      await apiRequest<unknown>(`/owners/${ownerId}/pets/${petId}/visits`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      navigate(
        `/owners/${ownerId}?message=${encodeURIComponent('Your visit has been booked')}`,
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 400 && isProblemDetail(error.payload)) {
        setErrorMessage(error.payload.detail ?? 'Request failed (400).');
      } else {
        setErrorMessage(toErrorMessage(error));
      }
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>New Visit</h2>
      {errorMessage.length > 0 ? (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <b>Pet</b>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Birth Date</th>
            <th>Type</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{pet?.name}</td>
            <td>{formatDate(pet?.birthDate)}</td>
            <td>{pet?.type?.name}</td>
            <td>{owner ? ownerFullName(owner) : ''}</td>
          </tr>
        </tbody>
      </table>

      <form className="form-horizontal" data-testid="visit-form" onSubmit={onSubmit}>
        <div className="form-group has-feedback">
          <div className={`form-group ${fieldErrors.date ? 'has-error' : ''}`}>
            <label className="col-sm-2 control-label" htmlFor="visit-date">
              Date
            </label>
            <div className="col-sm-10">
              <input
                id="visit-date"
                type="date"
                className="form-control"
                value={form.date}
                onChange={(event) => {
                  setForm((previous) => ({ ...previous, date: event.target.value }));
                }}
              />
            </div>
          </div>
          <div className={`form-group ${fieldErrors.description ? 'has-error' : ''}`}>
            <label className="col-sm-2 control-label" htmlFor="visit-description">
              Description
            </label>
            <div className="col-sm-10">
              <input
                id="visit-description"
                className="form-control"
                value={form.description}
                onChange={(event) => {
                  setForm((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }));
                }}
              />
              {fieldErrors.description ? (
                <span className="help-inline">
                  <p>{fieldErrors.description}</p>
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button className="btn btn-primary" type="submit">
              Add Visit
            </button>
          </div>
        </div>
      </form>

      <br />
      <b>Previous Visits</b>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {(pet?.visits ?? []).map((visit) => (
            <tr key={visit.id}>
              <td>{formatDate(visit.date)}</td>
              <td>{visit.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function VetsPage() {
  const [searchParams] = useSearchParams();
  const rawPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const requestedPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadVets() {
      setLoading(true);
      setErrorMessage('');
      try {
        const response = await apiRequest<Vet[]>('/vets');
        if (!cancelled) {
          setVets(response);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(toErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadVets();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(vets.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageVets = vets.slice(pageStart, pageStart + PAGE_SIZE);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (errorMessage.length > 0) {
    return (
      <>
        <h2>Veterinarians</h2>
        <p>{errorMessage}</p>
      </>
    );
  }

  return (
    <>
      <h2>Veterinarians</h2>
      <table id="vets" className="table table-striped" data-testid="vets-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialties</th>
          </tr>
        </thead>
        <tbody>
          {pageVets.map((vet) => (
            <tr key={vet.id} data-testid="vet-row">
              <td>{`${vet.firstName} ${vet.lastName}`}</td>
              <td>
                {vet.specialties.length > 0
                  ? vet.specialties.map((specialty) => specialty.name).join(' ')
                  : 'none'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination totalPages={totalPages} currentPage={currentPage} basePath="/vets.html" />
    </>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="owners/find" element={<FindOwnersPage />} />
          <Route path="owners" element={<OwnersListPage />} />
          <Route path="owners/new" element={<OwnerFormPage />} />
          <Route path="owners/:ownerId" element={<OwnerDetailsPage />} />
          <Route path="owners/:ownerId/edit" element={<OwnerFormPage />} />
          <Route path="owners/:ownerId/pets/new" element={<PetFormPage />} />
          <Route path="owners/:ownerId/pets/:petId/edit" element={<PetFormPage />} />
          <Route
            path="owners/:ownerId/pets/:petId/visits/new"
            element={<VisitFormPage />}
          />
          <Route path="vets.html" element={<VetsPage />} />
          <Route path="oups" element={<ErrorPage status={500} />} />
          <Route path="*" element={<ErrorPage status={404} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppRouter />;
}
