interface FlashMessageProps {
  message?: string | null;
  error?: string | null;
  type?: 'success' | 'error';
}

export function FlashMessage({ message, error }: FlashMessageProps) {
  return (
    <>
      {message ? (
        <div className="alert alert-success" id="success-message">
          <span>{message}</span>
        </div>
      ) : null}
      {error ? (
        <div className="alert alert-danger" id="error-message">
          <span>{error}</span>
        </div>
      ) : null}
    </>
  );
}
