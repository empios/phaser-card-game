export default class propBox {
    constructor(scene) {
        this.render = () => {
            let box = scene.add.rectangle(1150, 380, 250, 300)
            box.setStrokeStyle(4, 0xff6699)
        }
    }
}
