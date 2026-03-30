import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pagination } from '../components/Pagination.tsx';
import { getVets } from '../services/petclinicApi.ts';
import type { Vet } from '../services/petclinicApi.ts';

export function VetsPage() {
  const [searchParams] = useSearchParams();
  const [vets, setVets] = useState<Vet[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const page = Number(searchParams.get('page') ?? '1') || 1;

  useEffect(() => {
    let cancelled = false;
    getVets(page)
      .then((result) => {
        if (cancelled) {
          return;
        }
        setVets(result.vets);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
        setError('');
      })
      .catch(() => {
        if (!cancelled) {
          setVets([]);
          setCurrentPage(1);
          setTotalPages(1);
          setError('An unexpected error occurred.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  if (error) {
    return <p>{error}</p>;
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
          {vets.map((vet) => (
            <tr key={vet.id} data-testid="vet-row">
              <td>
                {vet.firstName} {vet.lastName}
              </td>
              <td>
                {vet.specialties.length > 0
                  ? vet.specialties.map((specialty) => specialty.name).join(' ')
                  : 'none'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} pageBasePath="/vets.html" query={{}} />
    </>
  );
}
