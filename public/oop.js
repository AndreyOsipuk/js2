// SOLID, KISS, DRY
// 1. Инкапсуляция (сокрытие реализации)
// 2. Наследование
// 3. Полиморфизм
// 4. Абстракция (*)

function Container(id, className, tagName) {
  this.id = id;
  this.className = className;
  this.tagName = tagName;
}

Container.prototype.remove = function() {

}

Container.prototype.render = function() {
  return `<${this.tagName} class="${this.className}" id="${this.id}"></${this.tagName}>`;
}

function Menu(id, className, items) {
  Container.call(this, id, className, 'ul');

  this.items = items;
}

Menu.prototype = Object.create(Container.prototype);
Menu.prototype.render = function() {
  
}

function SuperMenu(id, className, items) {
  Menu.call(id, className, items);
}

// -----------------------------------------------------------

class Container {
  constructor(id, className, tagName) {
    this.id = id;
    this.className = className;
    this.tagName = tagName;
  }

  render() {
    return `<${this.tagName} class="${this.className}" id="${this.id}"></${this.tagName}>`;
  }
}

class Menu extends Container {
  constructor(id, className, items) {
    super(id, className, 'ul');

    this.items = items;
  }

  render() {
    super.render();
  }
}