/* eslint-disable no-debugger */
class InputState {
  constructor(validator) {
    this.isDirty = false;
    this.value = '';
    this.validator = validator;
  }

  reset() {
    this.isDirty = false;
    this.value = '';
  }

  get text() {
    return this.value;
  }
  set text(t) {
    this.value = t;
  }

  state() {
    let result = null;
    if (this.isDirty) {
      if (!this.text) result = false;
      else if (this.validator && !this.validator(this.text)) result = false;
    }
    return result;
  }

  clearDirty() {
    this.isDirty = false;
  }

  setDirty() {
    this.isDirty = true;
  }

  isValid() {
    let result = !!this.text;
    if (result && this.validator) result = this.validator(this.text);
    return result;
  }
}

const isAllStateValid = inputs => {
  let isValid = true;
  for (const key of Object.keys(inputs))
    if (inputs[key] instanceof InputState && !inputs[key].isValid()) {
      isValid = false;
      break;
    }
  return isValid;
};

const clearAllStateDirty = inputs => {
  for (const key of Object.keys(inputs)) if (inputs[key] instanceof InputState) inputs[key].clearDirty();
};

const setAllStateDirty = inputs => {
  for (const key of Object.keys(inputs)) if (inputs[key] instanceof InputState) inputs[key].setDirty();
};

const resetAllState = inputs => {
  for (const key of Object.keys(inputs)) if (inputs[key] instanceof InputState) inputs[key].reset();
};

const stateToBasicObject = inputs => {
  let obj = {};

  for (const key of Object.keys(inputs)) {
    obj[key] = inputs[key] instanceof InputState ? inputs[key].text : inputs[key];
  }

  return obj;
};

const basicObjectToState = (obj, inputs) => {
  for (const key of Object.keys(inputs)) {
    if (obj[key]) {
      if (inputs[key] instanceof InputState) {
        inputs[key].text = obj[key];
      } else {
        inputs[key] = obj[key];
      }
    } else {
      if (inputs[key] instanceof InputState) {
        inputs[key].text = '';
      } else {
        inputs[key] = '';
      }
    }
  }
};

export { InputState, isAllStateValid, clearAllStateDirty, setAllStateDirty, resetAllState, stateToBasicObject, basicObjectToState };
