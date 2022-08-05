import React, { useRef } from "react";

export default function Sublist(props) {
  let sublistRef = useRef("");
  const sublistRefHandler = (e) => {
    let data = {
      id: Math.random(),
      value: sublistRef.current.value,
      parentId: props.id
    };

    props.setArr([...props.arr, data]);
    sublistRef.current.value = "";
    e.preventDefault();
  };

  return (
    <form className="sublist-form">
      <input className="sublist-input" ref={sublistRef} />
      <button className="sublist-button" onClick={sublistRefHandler}>
        Add
      </button>
    </form>
  );
}
