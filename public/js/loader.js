const loader = {
  show(message = 'Loading...') {
    const container = document.getElementById('loaderContainer');
    const textElement = document.getElementById('loaderText');
    textElement.textContent = message;
    container.classList.add('visible');
  },
  hide() {
    const container = document.getElementById('loaderContainer');
    container.classList.remove('visible');
  },
  updateText(message) {
    document.getElementById('loaderText').textContent = message;
  }
};
loader.show('Loading...');
let resourcesLoaded = false;
let DOMLoaded = false;
window.addEventListener('load', () => {
  resourcesLoaded = true;
  if (DOMLoaded) loader.hide();
});
document.addEventListener('DOMContentLoaded', () => {
  DOMLoaded = true;
  if (resourcesLoaded) loader.hide();
});
if ('navigation' in window) {
  navigation.addEventListener('navigate', () => {
    loader.show('Navigating...');
});
const resourceLoader = {
  pending: new Set(),
  track(url) {
    this.pending.add(url);
    loader.show(`Loading resources (${this.pending.size} remaining)...`);
  },
  complete(url) {
    this.pending.delete(url);
    if (this.pending.size === 0) {
      loader.hide();
    } else {
      loader.updateText(`Loading resources (${this.pending.size} remaining)...`);
    }
  }
};
const originalCreateElement = document.createElement.bind(document);
document.createElement = function(type) {
  const element = originalCreateElement(type);
  if (type === 'script') {
    element.addEventListener('load', () => {
      resourceLoader.complete(element.src);
    });
    element.addEventListener('error', () => {
      resourceLoader.complete(element.src);
    });
    if (element.src) {
      resourceLoader.track(element.src);
    }
  }
  return element;
}};
