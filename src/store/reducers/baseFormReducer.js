import produce from "immer";
import { set, has } from "lodash";

export function baseFormReducer(state, updateArg) {
  // check if the type of update argument is a callback function
  if (updateArg.constructor === Function) {
    return { ...state, ...updateArg(state) };
  }
  if (updateArg.constructor === Object) {
    if (has(updateArg, "_path") && has(updateArg, "_value")) {
      const { _path, _value } = updateArg;

      return produce(state, (draft) => {
        set(draft, _path, _value);
      });
    } else {
      return { ...state, ...updateArg };
    }
  }
}

export function baseCallBack({ value, name, type }, changeState) {
  const updatePath = name.split(".");

  if (type === "checkbox") {
    var incomingValue = (value==="true");
    if (updatePath.length === 1) {
      changeState((prevState) => ({
        [name]: !prevState[name],
      }));
    }
    if (updatePath.length > 1) {
      changeState({
        _path: updatePath,
        _value: !incomingValue,
      });
    }

    return;
  }
  if (updatePath.length === 1) {
    const [key] = updatePath;

    changeState({
      [key]: value,
    });
  }
  if (updatePath.length > 1) {
    changeState({
      _path: updatePath,
      _value: value,
    });
  }
}
