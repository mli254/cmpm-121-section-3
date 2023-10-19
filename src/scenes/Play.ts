import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;

  //rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond
  moveSpeed = 0.5;
  originX = 0;
  originY = 0;
  offset = 2;

  playerWidth = 10;
  playerHeight = 10;
  playerColor = 0xd0da5b;

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    const playerX = (this.game.config.width as number) / this.offset;
    const playerY =
      (this.game.config.height as number) - this.playerHeight - this.offset;

    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        this.originX,
        this.originY,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(this.originX, this.originY);

    this.spinner = this.add
      .rectangle(
        playerX,
        playerY,
        this.playerWidth,
        this.playerHeight,
        this.playerColor,
      )
      .setOrigin(this.originX, this.originY);
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;
    const playerY =
      (this.game.config.height as number) - this.playerHeight - this.offset;

    if (this.fire!.isDown) {
      this.tweens.add({
        targets: this.spinner,
        y: -100,
        duration: 1000,
        ease: Phaser.Math.Easing.Linear,
      });
    }

    if (this.left!.isDown && this.spinner!.y >= playerY) {
      this.spinner!.x -= delta * this.moveSpeed;
    }
    if (this.right!.isDown && this.spinner!.y >= playerY) {
      this.spinner!.x += delta * this.moveSpeed;
    }

    this.spawn();
  }

  spawn() {
    if (this.spinner!.y <= 0) {
      this.spinner!.x = (this.game.config.width as number) / 2;
      this.spinner!.y =
        (this.game.config.height as number) - this.spinner!.height;
    }
  }
}
