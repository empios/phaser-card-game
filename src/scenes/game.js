import io from 'socket.io-client';
import Card from '../helpers/card';
import Board from '../helpers/board';
import propBox from "../helpers/propBox";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        this.load.json('card', 'http://localhost:3000/card')
        this.socket = io('http://localhost:3000', {
            withCredentials: true
        });


    }

    create() {
        let self = this;        
        
        //Render button
        this.dealText = this.add.text(75, 350, ['End Round'])
            .setFontSize(18).setFontFamily('Roboto').setColor('white').setInteractive();
    
        //Render board
        this.zone = new Board(this);

        //PlayerA
        this.dropZone = this.zone.renderZone(600, 575);
        this.outline = this.zone.renderOutline(this.dropZone, 0x69ff8a);

        this.dropZone = this.zone.renderZone(600, 450);
        this.outline = this.zone.renderOutline(this.dropZone, 0x69ff8a);

        //PlayerB
        this.outline = this.zone.renderOutlineWithoutDropZone(600,275,0xfc3549);
        this.outline = this.zone.renderOutlineWithoutDropZone(600, 150, 0xfc3549);

        

        //render prop Box

        this.box = new propBox(this);
        this.box.render();


        //render cards
        /*for (let i = 0; i < 5; i++) {
            let playerCard = new Card(this);
            playerCard.render(275 + (i * 100), 710, 'front');
        }
        */

        let loader = new Phaser.Loader.LoaderPlugin(self); 
       for (let i = 0; i<this.cache.json.get('card').body.length; i++){
            let name = "card" + i
            let src = "src/assets/" + this.cache.json.get('card').body[i].image
            let power = this.cache.json.get('card').body[i].power
            let shield = this.cache.json.get('card').body[i].shield
            let nameDb = this.cache.json.get('card').body[i].name
            let describe = this.cache.json.get('card').body[i].describe
            loader.image(name, src)
            let playerCard = new Card(this);
            loader.once(Phaser.Loader.Events.COMPLETE, () => {
                playerCard.render(275 +(i * 100), 710, name, nameDb, power, shield, describe)
            });
        }
        loader.start();

        //End round button
        // this.dealCards = () => {

        // }

        //Render a text in prop-box
        this.nameText = this.add.text(1040,250, ['Name:'])
        this.nameValue = this.add.text(1100,250, [])
        this.describtionText = this.add.text(1040,280, ['Describtion:'])
        this.descriptionValue = this.add.text(1040,310, [])
        this.powerText = this.add.text(1040,340, ['Power:'])
        this.powerValue = this.add.text(1130,340, [])
        this.powerText = this.add.text(1040,380, ['Shield:'])
        this.shieldValue = this.add.text(1140,380, [])

        //events
        this.dealText.on('pointerdown', function () {
            self.dealCards();
        })

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('white');
        })

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            self.nameValue.text = gameObject.name
            self.descriptionValue.text = gameObject.description
            self.powerValue.text = gameObject.power
            self.shieldValue.text = gameObject.shield
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            self.nameValue.text = ""
            self.descriptionValue.text = ""
            self.powerValue.text = ""
            self.shieldValue.text = ""
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            dropZone.data.values.cards++;
            gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();
        })

        

        this.socket.on('connect', function () {
            console.log('Connected!');
        });

        this.socket.on('hello', function () {
            console.log('Hello from server!');
        });

        this.socket.on('error', function (err) {
            console.log(err);
        });

        this.socket.on('disconnected', function () {
            console.log('disconnected');
        });

        this.socket.on('sendTable', function (data) {
            console.log(data);
        });

        this.socket.emit("getTable");


    }

    update() {

    }
}
