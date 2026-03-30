import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormField } from '../components/FormField.tsx';
import { SelectField } from '../components/SelectField.tsx';
import {
  ApiValidationError,
  Owner,
  PetPayload,
  PetType,
  ValidationErrors,
  createPet,
  getOwner,
  getPetTypes,
  updatePet,
} from '../services/petclinicApi.ts';

const emptyPet: PetPayload = {
  name: '',
  birthDate: '',
  typeId: 0,
};

export function PetFormPage() {
  const { ownerId, petId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(petId);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [types, setTypes] = useState<PetType[]>([]);
  const [formValues, setFormValues] = useState<PetPayload>(emptyPet);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) {
      setSubmitError('Owner not found');
      setLoading(false);
      return;
    }

    let cancelled = false;
    Promise.all([getOwner(Number(ownerId)), getPetTypes()])
      .then(([loadedOwner, loadedTypes]) => {
        if (cancelled) {
          return;
        }
        if (!loadedOwner) {
          setSubmitError('Owner not found');
          return;
        }
        setOwner(loadedOwner);
        setTypes(loadedTypes);

        if (isEdit && petId) {
          const pet = loadedOwner.pets.find((entry) => entry.id === Number(petId));
          if (!pet) {
            setSubmitError('Pet not found');
            return;
          }
          setFormValues({
            name: pet.name,
            birthDate: pet.birthDate.split('T')[0],
            typeId: Number(
              loadedTypes.find((type) => type.name === pet.type.name)?.id ?? pet.type.id ?? 0,
            ),
          });
        }
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
  }, [isEdit, ownerId, petId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ownerId) {
      return;
    }
    setErrors({});
    setSubmitError('');
    try {
      if (isEdit && petId) {
        await updatePet(Number(ownerId), Number(petId), formValues);
        navigate(`/owners/${ownerId}`, { state: { message: 'Pet details has been edited' } });
      }
      else {
        await createPet(Number(ownerId), formValues);
        navigate(`/owners/${ownerId}`, { state: { message: 'New Pet has been Added' } });
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

  if (!owner) {
    return <p>{submitError || 'Owner not found'}</p>;
  }

  const headingPrefix = isEdit ? '' : 'New ';

  return (
    <>
      <h2>
        {headingPrefix}
        <span>Pet</span>
      </h2>
      {submitError ? <p>{submitError}</p> : null}
      <form className="form-horizontal" method="post" data-testid="pet-form" onSubmit={onSubmit}>
        <input type="hidden" name="id" value={petId ?? ''} />
        <div className="form-group has-feedback">
          <div className="form-group">
            <label className="col-sm-2 control-label">Owner</label>
            <div className="col-sm-10">
              <span>
                {owner.firstName} {owner.lastName}
              </span>
            </div>
          </div>

          <FormField
            label="Name"
            name="name"
            value={formValues.name}
            onChange={(value) => setFormValues((prev) => ({ ...prev, name: value }))}
            error={errors.name}
          />
          <FormField
            label="Birth Date"
            name="birthDate"
            type="date"
            value={formValues.birthDate}
            onChange={(value) => setFormValues((prev) => ({ ...prev, birthDate: value }))}
            error={errors.birthDate}
          />
          <SelectField
            label="Type"
            name="type"
            value={formValues.typeId ? types.find((type) => type.id === formValues.typeId)?.name ?? '' : ''}
            options={types.map((type) => ({ value: type.name, label: type.name }))}
            onChange={(value) =>
              setFormValues((prev) => ({
                ...prev,
                typeId: types.find((type) => type.name === value)?.id ?? 0,
              }))
            }
            error={errors.type}
          />
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button className="btn btn-primary" type="submit">
              {isEdit ? 'Update Pet' : 'Add Pet'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
