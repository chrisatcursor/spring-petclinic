import { Link } from 'react-router-dom';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageBasePath: string;
  query?: Record<string, string>;
}

function pageHref(path: string, page: number, query: Record<string, string>): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  params.set('page', String(page));
  return `${path}?${params.toString()}`;
}

export function Pagination({
  currentPage,
  totalPages,
  pageBasePath,
  query = {},
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div>
      <span>pages</span>
      <span>[</span>
      <span>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) =>
          page === currentPage ? (
            <span key={page}>{page}</span>
          ) : (
            <Link key={page} to={pageHref(pageBasePath, page, query)}>
              {page}
            </Link>
          ),
        )}
      </span>
      <span>]&nbsp;</span>
      <span>
        {currentPage > 1 ? (
          <Link to={pageHref(pageBasePath, 1, query)} title="First" className="fa fa-fast-backward" />
        ) : (
          <span title="First" className="fa fa-fast-backward" />
        )}
      </span>
      <span>
        {currentPage > 1 ? (
          <Link
            to={pageHref(pageBasePath, currentPage - 1, query)}
            title="Previous"
            className="fa fa-step-backward"
          />
        ) : (
          <span title="Previous" className="fa fa-step-backward" />
        )}
      </span>
      <span>
        {currentPage < totalPages ? (
          <Link
            to={pageHref(pageBasePath, currentPage + 1, query)}
            title="Next"
            className="fa fa-step-forward"
          />
        ) : (
          <span title="Next" className="fa fa-step-forward" />
        )}
      </span>
      <span>
        {currentPage < totalPages ? (
          <Link
            to={pageHref(pageBasePath, totalPages, query)}
            title="Last"
            className="fa fa-fast-forward"
          />
        ) : (
          <span title="Last" className="fa fa-fast-forward" />
        )}
      </span>
    </div>
  );
}
