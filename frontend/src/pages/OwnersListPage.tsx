import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Pagination } from '../components/Pagination.tsx';
import { Owner, getOwners } from '../services/petclinicApi.ts';

export function OwnersListPage() {
  const [searchParams] = useSearchParams();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const lastName = searchParams.get('lastName') ?? '';
  const page = Number(searchParams.get('page') ?? '1') || 1;

  useEffect(() => {
    let cancelled = false;
    getOwners(lastName, page)
      .then((result) => {
        if (cancelled) {
          return;
        }
        setOwners(result.owners);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
        setError('');
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setOwners([]);
        setCurrentPage(1);
        setTotalPages(1);
        setError('An unexpected error occurred.');
      });
    return () => {
      cancelled = true;
    };
  }, [lastName, page]);

  if (error) {
    return <p>{error}</p>;
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
          {owners.map((owner) => (
            <tr key={owner.id} data-testid="owner-row">
              <td>
                <Link to={`/owners/${owner.id}`} data-testid="owner-name">
                  {owner.firstName} {owner.lastName}
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
        currentPage={currentPage}
        totalPages={totalPages}
        path="/owners"
        query={{ lastName }}
      />
    </>
  );
}

