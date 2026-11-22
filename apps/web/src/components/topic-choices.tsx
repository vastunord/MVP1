import "./topic-choices.css";

export function TopicChoices<T extends string | number>({
  label, options, value, onChange,
}: {
  label: string;
  options: { id: T; name: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <fieldset className="vn-topic-choices">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button key={option.id} type="button" aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}>
            {option.name}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
