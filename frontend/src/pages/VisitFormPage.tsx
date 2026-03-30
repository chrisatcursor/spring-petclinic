import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormField } from '../components/FormField.tsx';
import {
  ApiValidationError,
  Owner,
  ValidationErrors,
  VisitPayload,
  createVisit,
  getOwner,
} from '../services/petclinicApi.ts';

function toDisplayDate(value: string): string {
  return value ? value.split('T')[0] : '';
}

const emptyVisit: VisitPayload = {
  date: '',
  description: '',
};

export function VisitFormPage() {
  const { ownerId, petId } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formValues, setFormValues] = useState<VisitPayload>(emptyVisit);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!ownerId) {
      setSubmitError('Owner not found');
      setLoading(false);
      return;
    }

    let cancelled = false;
    getOwner(Number(ownerId))
      .then((result) => {
        if (cancelled) {
          return;
        }
        if (!result) {
          setSubmitError('Owner not found');
          return;
        }
        setOwner(result);
      })
      .catch(() => {
        if (!cancelled) {
          setSubmitError('An unexpected error occurred.');
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

  const pet = useMemo(() => {
    if (!owner || !petId) {
      return null;
    }
    return owner.pets.find((item) => item.id === Number(petId)) ?? null;
  }, [owner, petId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ownerId || !petId) {
      return;
    }

    setErrors({});
    setSubmitError('');
    try {
      const updatedOwner = await createVisit(Number(ownerId), Number(petId), formValues);
      navigate(`/owners/${updatedOwner.id}`, { state: { message: 'Your visit has been booked' } });
    }
    catch (error) {
      if (error instanceof ApiValidationError) {
        setErrors(error.fieldErrors);
      }
      else {
        setSubmitError('An unexpected error occurred.');
      }
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!owner || !pet) {
    return (
      <>
        <h2>New Visit</h2>
        <p>{submitError || 'Pet not found'}</p>
      </>
    );
  }

  return (
    <>
      <h2>New Visit</h2>

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
            <td>{pet.name}</td>
            <td>{toDisplayDate(pet.birthDate)}</td>
            <td>{pet.type.name}</td>
            <td>
              {owner.firstName} {owner.lastName}
            </td>
          </tr>
        </tbody>
      </table>

      {submitError ? <p>{submitError}</p> : null}
      <form className="form-horizontal" method="post" data-testid="visit-form" onSubmit={onSubmit}>
        <div className="form-group has-feedback">
          <FormField
            label="Date"
            name="date"
            type="date"
            value={formValues.date}
            onChange={(value) => setFormValues((prev) => ({ ...prev, date: value }))}
            error={errors.date}
          />
          <FormField
            label="Description"
            name="description"
            value={formValues.description}
            onChange={(value) => setFormValues((prev) => ({ ...prev, description: value }))}
            error={errors.description}
          />
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
          {pet.visits.map((visit) => (
            <tr key={visit.id}>
              <td>{toDisplayDate(visit.date)}</td>
              <td>{visit.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
