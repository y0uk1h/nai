import { forwardRef, useImperativeHandle, useRef } from "react";

export const TextArea = forwardRef(({ id, name, rows = 3 }, ref) => {
  const innerRef = useRef();
  useImperativeHandle(ref, () => (value) => {
    if (value === undefined) return innerRef.current?.value;
    else if (innerRef?.current) innerRef.current.value = value;
  });
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {name}
      </label>
      <textarea
        ref={innerRef}
        className="form-control"
        id={id}
        rows={rows}
      ></textarea>
    </div>
  );
});
