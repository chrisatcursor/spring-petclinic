interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'date';
}

export function FormField({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
}: FormFieldProps) {
  const hasError = Boolean(error);

  return (
    <div className={`form-group${hasError ? ' has-error' : ''}`}>
      <label htmlFor={name} className="col-sm-2 control-label">
        {label}
      </label>
      <div className="col-sm-10">
        <input
          id={name}
          name={name}
          className="form-control"
          type={type}
          value={value}
          aria-label={label}
          onChange={(event) => onChange(event.target.value)}
        />
        {hasError ? (
          <>
            <span className="fa fa-remove form-control-feedback" aria-hidden="true" />
            <span className="help-inline">{error}</span>
          </>
        ) : (
          <span className="fa fa-ok form-control-feedback" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
