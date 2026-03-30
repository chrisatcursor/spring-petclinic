import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FormField } from '../components/FormField.tsx';
import {
  ApiValidationError,
  OwnerPayload,
  ValidationErrors,
  createOwner,
  getOwner,
  updateOwner,
} from '../services/petclinicApi.ts';

const emptyOwner: OwnerPayload = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  telephone: '',
};

export function OwnerFormPage() {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(ownerId);
  const [formValues, setFormValues] = useState<OwnerPayload>(emptyOwner);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!isEdit || !ownerId || location.pathname.startsWith('/owners/new')) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    getOwner(Number(ownerId))
      .then((owner) => {
        if (cancelled) {
          return;
        }
        if (!owner) {
          setSubmitError('Owner not found');
          return;
        }
        setFormValues({
          firstName: owner.firstName,
          lastName: owner.lastName,
          address: owner.address,
          city: owner.city,
          telephone: owner.telephone,
        });
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
  }, [isEdit, location.pathname, ownerId]);

  useEffect(() => {
    if (location.pathname.startsWith('/owners/new')) {
      setFormValues(emptyOwner);
      setErrors({});
      setSubmitError('');
    }
  }, [location.pathname]);

  const hasFieldErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setSubmitError('');
    try {
      if (isEdit && ownerId) {
        const owner = await updateOwner(Number(ownerId), formValues);
        navigate(`/owners/${owner.id}`, { state: { message: 'Owner Values Updated' } });
      }
      else {
        const owner = await createOwner(formValues);
        navigate(`/owners/${owner.id}`, { state: { message: 'New Owner Created' } });
      }
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

  return (
    <>
      <h2>Owner</h2>
      {submitError ? <p>{submitError}</p> : null}
      <form className="form-horizontal" id="add-owner-form" method="post" data-testid="owner-form" onSubmit={onSubmit}>
        <div className={`form-group has-feedback${hasFieldErrors ? ' has-error' : ''}`}>
          <FormField
            label="First Name"
            name="firstName"
            value={formValues.firstName}
            onChange={(value) => setFormValues((prev) => ({ ...prev, firstName: value }))}
            error={errors.firstName}
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={formValues.lastName}
            onChange={(value) => setFormValues((prev) => ({ ...prev, lastName: value }))}
            error={errors.lastName}
          />
          <FormField
            label="Address"
            name="address"
            value={formValues.address}
            onChange={(value) => setFormValues((prev) => ({ ...prev, address: value }))}
            error={errors.address}
          />
          <FormField
            label="City"
            name="city"
            value={formValues.city}
            onChange={(value) => setFormValues((prev) => ({ ...prev, city: value }))}
            error={errors.city}
          />
          <FormField
            label="Telephone"
            name="telephone"
            value={formValues.telephone}
            onChange={(value) => setFormValues((prev) => ({ ...prev, telephone: value }))}
            error={errors.telephone}
          />
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button className="btn btn-primary" type="submit">
              {isEdit ? 'Update Owner' : 'Add Owner'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
