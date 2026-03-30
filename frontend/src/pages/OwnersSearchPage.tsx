import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ApiValidationError, getOwners } from '../services/petclinicApi.ts';

export function OwnersSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lastName, setLastName] = useState(searchParams.get('lastName') ?? '');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const result = await getOwners(lastName, 1);
      setSearchParams(lastName ? { lastName } : {}, { replace: true });
      if (result.totalItems === 0) {
        setErrors(['has not been found']);
        return;
      }
      if (result.totalItems === 1 && result.owners[0]) {
        navigate(`/owners/${result.owners[0].id}`);
        return;
      }
      navigate(`/owners${lastName ? `?lastName=${encodeURIComponent(lastName)}` : ''}`);
    }
    catch (error) {
      if (error instanceof ApiValidationError) {
        setErrors(Object.values(error.fieldErrors));
      }
      else {
        setErrors(['An unexpected error occurred.']);
      }
    }
    finally {
      setLoading(false);
    }
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
                className="form-control"
                id="lastName"
                name="lastName"
                size={30}
                maxLength={80}
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
              <span className="help-inline">
                <div>
                  {errors.map((message) => (
                    <p key={message}>{message}</p>
                  ))}
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button type="submit" className="btn btn-primary" disabled={loading}>
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
