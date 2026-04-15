class Sprite {
  constructor(name, x, y, emoji = "🍕") {
    this.name = name;
    this.x = x;
    this.y = y;
    this.emoji = emoji;
    this.el = document.createElement("div");
    this.el.className = "sprite";
    this.el.textContent = emoji;
    this.render();
  }

  render() {
    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.render();
  }
}
class Futar extends Sprite {
  constructor(name, x, y) {
    super(name, x, y, "🛵");
    this.speed = 12;
  }
  randomStep(maxW, maxH) {
    const dx = Math.round((Math.random() - 0.5) * this.speed * 2);
    const dy = Math.round((Math.random() - 0.5) * this.speed * 2);
    this.x = Math.max(0, Math.min(maxW - 36, this.x + dx));
    this.y = Math.max(0, Math.min(maxH - 36, this.y + dy));
    this.render();
  }
}
