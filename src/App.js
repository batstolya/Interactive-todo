import "./App.css";
import { useEffect, useRef, useState } from "react";
import Sublist from "./Sublist";
const DUMMY__ARR = [
  { id: 1, value: "todo1", isVisible: "false", parentId: 0, sort: 1 },
  { id: 2, value: "todo2", isVisible: "false", parentId: 0, sort: 2 },
  { id: 104, value: "subTodo104", isVisible: "false", parentId: 1, sort: 1 },
  { id: 106, value: "subTodo106", isVisible: "false", parentId: 1, sort: 1 },
  { id: 105, value: "subTodo105", isVisible: "false", parentId: 1, sort: 1 },
  { id: 3, value: "todo3", isVisible: "false", parentId: 0, sort: 3 },
  { id: 322, value: "subTodo322", isVisible: "false", parentId: 3, sort: 1 },
  { id: 312, value: "subTodo312", isVisible: "false", parentId: 3, sort: 1 },
];

function App() {
  const [isAddSublist, setIsAddSublist] = useState(1);
  const [value, setValue] = useState(0);
  const [style, setStyle] = useState({});
  const [styleBtn, setStyleBtn] = useState({});
  const inputRef = useRef("");

  const [arr, setArr] = useState(() => {
    const savedTodos = localStorage.getItem("arr");

    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });
  useEffect(() => {
    if (value.length <= 2) {
      let stylesObj = {
        border: "1px solid red",
        outline: "none",
        error: "Error: text >= 3 letters",
      };
      let stylesBtn = {
        backgroundColor: "grey",
        color: "white",
        border: "1px solid grey",
      };
      setStyle(stylesObj);
      setStyleBtn(stylesBtn);
    } else {
      setStyle({ error: "Put something ..." });
      setStyleBtn({});
    }
  }, [value]);

  useEffect(() => {
    localStorage.setItem("arr", JSON.stringify(arr));
  }, [arr]);

  arr.sort((a, b) => (a.sort < b.sort ? 1 : b.sort < a.sort ? -1 : 0));

  const getArrInID = (id) => {
    let arrIdd = arr.filter((i) => i.id === id);
    let arrParentId = arr.filter((i) => i.parentId === id);
    return arrIdd.concat(arrParentId);
  };
  const getFirstElementIDInListTodo = (i) => {
    let result = arr.filter((i) => i.parentId === 0);
    return result[0].id;
  };
  const getLastElementIDInListTodo = (i) => {
    let result = arr.filter((i) => i.parentId === 0);

    return result[result.length - 1].id;
  };
  const lengthOfTodos = () => {
    return arr.filter((i) => i.parentId === 0).length;
  };

  const addToArr = (e) => {
    if (inputRef.current.value === "" || value.length <= 2) {
      setValue("");
    } else {
      let data = {
        id: Math.random(),
        value: inputRef.current.value,
        isVisible: "false",
        parentId: 0,
        sort: arr.length + Math.random(),
      };
      setArr([data, ...arr]);
      inputRef.current.value = "";
    }
    e.preventDefault();
  };

  const clickButton = (e) => {
    setIsAddSublist((prev) => prev + 1);
    for (let i = 0; arr.length > i; i++) {
      if (arr[i].value === e.target.className && +arr[i].id === +e.target.id) {
        let myNewData = {
          ...arr[i],
          isVisible: true,
        };
        arr[i] = myNewData;
        setArr(arr);
      }
    }
  };


  return (
    <div className="App">
      <ul className="ul">
        <label className="elements-add__todos">Add ToDos</label>
        <form className="elements-form">
          <input
            placeholder={style.error}
            className="elements-input"
            style={style}
            ref={inputRef}
            onChange={() => setValue(inputRef.current.value)}
          />
          <button
            style={styleBtn}
            className="elements-button"
            onClick={addToArr}
          >
            Add
          </button>
        </form>

        <ul>
          {arr.map((i) => {
            let arrId = getArrInID(i.id);
            if (i.parentId == 0) {
              return arrId.map((i) => (
                <li key={i.id} className={`li-element${i.parentId}`}>
                  <span>{i.value}</span>
                  <span
                    className={`${i.parentId === 0 ? "hidden" : "visible"}`}
                    onClick={()=> {
                      let filterArr = arr.filter(e => e.id !== i.id);
                      setArr(filterArr)                      

                      
                    }}
                  >
                    X
                  </span>

                  {i.parentId === 0 && (
                    <button
                      className="button-remove"
                      onClick={() => {
                        let id = i.id;
                        let result = arr.filter((i) => {
                          if (i.parentId !== id && i.id !== id) {
                            return i;
                          }
                        });
                        setArr(result);
                      }}
                    >
                      remove
                    </button>
                  )}
                  {i.parentId === 0 && getArrInID(i.id).length > 1 && (
                    <button
                      className="button-remove__sublist"
                      onClick={(e) => {
                        let id = i.id;
                        let result = arr.filter((i) => {
                          if (i.parentId !== id) {
                            return i;
                          }
                        });
                        setArr(result);
                      }}
                    >
                      Remove Sublist
                    </button>
                  )}
                  {i.parentId === 0 && (
                    <button onClick={clickButton} className={i.value} id={i.id}>
                      Add Sublist
                    </button>
                  )}
                  {i.parentId === 0 &&
                    getFirstElementIDInListTodo() !== i.id &&
                    lengthOfTodos() !== 1 && (
                      <button
                        className="button-up"
                        onClick={() => {
                          let idSort = i.sort;

                          let positionInArray = [];
                          let newArr = arr.filter((i) => {
                            if (+i.parentId === 0) {
                              return i;
                            }
                          });

                          let filterArrTo = newArr.filter((i) => {
                            if (+i.parentId === 0) {
                              if (+i.sort === idSort) {
                                positionInArray.push(newArr.indexOf(i));
                              }
                            }
                          });

                          let firstElem = newArr[+positionInArray];
                          let firstElem2 = newArr[+positionInArray - 1];

                          let arrSortChange = [
                            { ...firstElem, sort: firstElem2.sort },
                            { ...firstElem2, sort: firstElem.sort },
                          ];
                          let arrWithoutElements = arr.filter(
                            (i) => i !== firstElem && i !== firstElem2
                          );
                          setArr([...arrWithoutElements, ...arrSortChange]);
                        }}
                      >
                        UP
                      </button>
                    )}
                  {i.parentId === 0 && getLastElementIDInListTodo(i) !== i.id && (
                    <button
                      className="button-down"
                      onClick={() => {
                        let idSort = i.sort;

                        let positionInArray = [];
                        let newArr = arr.filter((i) => {
                          if (+i.parentId === 0) {
                            return i;
                          }
                        });
                        let filterArrTo = newArr.filter((i) => {
                          if (+i.parentId === 0) {
                            if (+i.sort === +idSort) {
                              positionInArray.push(newArr.indexOf(i));
                            }
                          }
                        });

                        let firstElem = newArr[+positionInArray];
                        let secondElem = newArr[+positionInArray + 1];

                        let arrSortChange = [
                          { ...firstElem, sort: secondElem.sort },
                          { ...secondElem, sort: firstElem.sort },
                        ];

                        let arrWithoutElements = arr.filter(
                          (i) => i !== firstElem && i !== secondElem
                        );
                        setArr([...arrWithoutElements, ...arrSortChange]);
                      }}
                    >
                      DOWN
                    </button>
                  )}
                  {i.parentId === 0 &&
                    i.isVisible === true &&
                    isAddSublist > 0 && (
                      <div>
                        <Sublist id={i.id} arr={arr} setArr={setArr} />
                      </div>
                    )}
                </li>
              ));
            }
          })}
        </ul>
      </ul>
      <div className="count-todos">You have: {lengthOfTodos()} todo</div>
    </div>
  );
}
export default App;
