import { statusMessages } from '../styles.ts';

interface ErrorPageProps {
  status?: number;
  message?: string;
}

function statusMessage(status?: number): string {
  if (status === 404) {
    return statusMessages.notFound404;
  }
  if (status === 500) {
    return statusMessages.error500;
  }
  return statusMessages.generalError;
}

export function ErrorPage({ status = 500, message = '' }: ErrorPageProps) {
  return (
    <>
      <img src="/resources/images/pets.png" alt="" />
      <h2>Something happened...</h2>
      <p>{statusMessage(status)}</p>
      <p>{message}</p>
    </>
  );
}
