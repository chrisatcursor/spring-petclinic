import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FlashMessage } from '../components/FlashMessage.tsx';
import { Owner, getOwner } from '../services/petclinicApi.ts';

function toDisplayDate(value: string): string {
  return value ? value.split('T')[0] : '';
}

function renderPetType(type: unknown): string {
  if (!type) {
    return '';
  }
  if (typeof type === 'string') {
    return type;
  }
  if (typeof type === 'object' && 'name' in type) {
    const name = (type as { name?: string }).name;
    return name ?? '';
  }
  return '';
}

export function OwnerDetailsPage() {
  const { ownerId } = useParams();
  const location = useLocation();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const successMessage = useMemo(() => {
    const state = location.state as { message?: string } | null;
    return state?.message ?? '';
  }, [location.state]);

  useEffect(() => {
    if (!ownerId) {
      setError('Owner not found');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    getOwner(Number(ownerId))
      .then((result) => {
        if (cancelled) {
          return;
        }
        if (!result) {
          setError('Owner not found');
          return;
        }
        setOwner(result);
        setError('');
      })
      .catch(() => {
        if (!cancelled) {
          setError('An unexpected error occurred.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !owner) {
    return (
      <>
        <h2>Owner Information</h2>
        <p>{error || 'Owner not found'}</p>
      </>
    );
  }

  return (
    <>
      <h2>Owner Information</h2>

      <FlashMessage type="success" message={successMessage} />

      <table className="table table-striped" data-testid="owner-information">
        <tbody>
          <tr>
            <th>Name</th>
            <td>
              <b>
                {owner.firstName} {owner.lastName}
              </b>
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
      <Link to={`/owners/${owner.id}/pets/new`} className="btn btn-primary" data-testid="add-pet-link">
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
                  <dd>{toDisplayDate(pet.birthDate)}</dd>
                  <dt>Type</dt>
                  <dd>{renderPetType(pet.type)}</dd>
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
                        <td>{toDisplayDate(visit.date)}</td>
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
