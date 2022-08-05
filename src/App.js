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
  { id: 312, value: "subTodo312", isVisible: "false", parentId: 3, sort: 1 }
];

function App() {
  const [isAddSublist, setIsAddSublist] = useState(1);
  const inputRef = useRef("");
  const [arr, setArr] = useState(() => {
    const savedTodos = localStorage.getItem("arr");
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return DUMMY__ARR;
    }
  });

  useEffect(() => {
    localStorage.setItem("arr", JSON.stringify(arr));
  }, [arr]);

  arr.sort((a, b) => (a.sort < b.sort ? 1 : b.sort < a.sort ? -1 : 0));

  const getArrInID = (id) => {
    let arrIdd = arr.filter((i) => i.id === id);
    let arrParentId = arr.filter((i) => i.parentId === id);

    return arrIdd.concat(arrParentId);
  };

  const addToArr = (e) => {
    let data = {
      id: Math.random(),
      value: inputRef.current.value,
      isVisible: "false",
      parentId: 0,
      sort: arr.length + 1
    };
    setArr([data, ...arr]);
    inputRef.current.value = "";
    e.preventDefault();
  };

  const clickButton = (e) => {
    setIsAddSublist((prev) => prev + 1);
    for (let i = 0; arr.length > i; i++) {
      if (arr[i].value === e.target.className && +arr[i].id === +e.target.id) {
        let myNewData = {
          ...arr[i],
          isVisible: true
        };
        arr[i] = myNewData;
        setArr(arr);
      }
    }
  };

  return (
    <div className="App">
      <ul className="ul">
        <label for="input" className="elements-add__todos">
          Add ToDos
        </label>
        <form className="elements-form">
          <input id="input" className="elements-input" ref={inputRef} />
          <button className="elements-button" onClick={addToArr}>
            Add
          </button>
        </form>
        <ul>
          {arr.map((i) => {
            let arrId = getArrInID(i.id);
            console.log(arrId);
            if (i.parentId == 0) {
              return arrId.map((i) => (
                <li key={i.id} className={`li-element${i.parentId}`}>
                  {i.value}{" "}
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
                    <button
                      // className="button-add__sublist"
                      onClick={clickButton}
                      className={i.value}
                      id={i.id}
                    >
                      Add Sublist
                    </button>
                  )}
                  {i.parentId === 0 && arr.indexOf(i) !== 0 && (
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
                          { ...firstElem2, sort: firstElem.sort }
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
                  {i.parentId === 0 && i.sort !== 1 && (
                    <button
                      className="button-down"
                      onClick={() => {
                        console.log(arrId);
                        let idSort = i.sort;
                        console.log(getArrInID(i.id));

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
                        let firstElem2 = newArr[+positionInArray + 1];
                        let arrSortChange = [
                          { ...firstElem, sort: firstElem2.sort },
                          { ...firstElem2, sort: firstElem.sort }
                        ];
                        let arrWithoutElements = arr.filter(
                          (i) => i !== firstElem && i !== firstElem2
                        );
                        console.log([...arrWithoutElements, ...arrSortChange]);
                        console.log(newArr);
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
    </div>
  );
}
export default App;
