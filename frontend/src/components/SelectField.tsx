interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
}

export function SelectField({ label, name, value, onChange, options, error }: SelectFieldProps) {
  const invalid = Boolean(error);
  return (
    <div className={`form-group${invalid ? ' has-error' : ''}`}>
      <label htmlFor={name} className="col-sm-2 control-label">
        {label}
      </label>
      <div className="col-sm-10">
        <select
          id={name}
          name={name}
          className="form-control"
          value={value}
          aria-label={label}
          title={label}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value=""> </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {!invalid ? (
          <span className="fa fa-ok form-control-feedback" aria-hidden="true" />
        ) : (
          <>
            <span className="fa fa-remove form-control-feedback" aria-hidden="true" />
            <span className="help-inline">{error}</span>
          </>
        )}
      </div>
    </div>
  );
}
