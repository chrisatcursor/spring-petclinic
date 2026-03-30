import { ErrorPage } from './ErrorPage.tsx';

export function NotFoundPage() {
  return <ErrorPage status={404} />;
}
