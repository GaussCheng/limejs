//set main namespace
goog.provide('Invitation');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

var imgSize = 6;

var imgWidth = screen.width;
var imgHeight = screen.height;

var CycleArray = function(max){
	this.max = max;
	this.datas = [];
	this.cur = 0;

	this.curImg = function(){
		return this.datas[this.cur];
	};
	this.prev = function(){
		var c = this.cur;
		--c;
		if(c < 0) c = this.max - 1;
		return this.datas[c];
	};
	this.next = function(){
		var c = this.cur;
		++c;
		c %= max;
		return this.datas[c];
	};
	this.length = function(){
		return this.datas.length;
	};

};

// entrypoint
Invitation.start = function(){

	var director = new lime.Director(document.body,screen.width,screen.height),
	    scene = new lime.Scene(),

	    target = new lime.Layer().setSize(imgWidth, imgHeight);


	var imgs = new CycleArray(imgSize);
	for(var i = 0; i < imgSize; ++i){
		imgs.datas[i] = new lime.Sprite().setSize(imgWidth, imgHeight).setFill("images/" + (i + 1) + ".png");
		imgs.datas[i].setHidden(true);
		target.appendChild(imgs.datas[i]);
	}
	imgs.datas[0].setHidden(false);


        // circle = new lime.Circle().setSize(150,150).setFill(255,150,0),
        // lbl = new lime.Label().setSize(160,50).setFontSize(30).setText('TOUCH ME!'),
        // title = new lime.Label().setSize(800,70).setFontSize(60).setText('Now move me around!')
        //     .setOpacity(0).setPosition(512,80).setFontColor('#999').setFill(200,100,0,.1);


    //add circle and label to target object
    // target.appendChild(circle);
    // target.appendChild(lbl);

    //add target and title to the scene
    scene.appendChild(target);
    // scene.appendChild(title);

	director.makeMobileWebAppCapable();

    //add some interaction

		var isPressed;
    goog.events.listen(target,['mousedown','touchstart'],function(e){
			isPressed = true;
			var startY = e.position.y;
			for(var i = 0; i < imgSize; ++i){
				if(imgs.datas[i].hitTest(e)){
					currentIndex = i;
					break;
				}
			}
			var diffY;
			var img = imgs.curImg();
			var pos = img.getPosition();
			e.swallow(['mousemove', 'touchemove'],function(se){
				if(!isPressed) return;
				diffY = se.position.y - startY;
				startY = se.position.y;
				img.setPosition(pos.x, pos.y + diffY);
				pos = img.getPosition();
				console.log(pos.y);
				if(pos.y < 0){
					imgs.next().setHidden(false);
					imgs.prev().setHidden(true);
				}
				else if(pos.y == 0){
					imgs.next().setHidden(false);
					imgs.prev().setHidden(false);
				}
				else{
					imgs.next().setHidden(true);
					imgs.prev().setHidden(false);
				}
			})
		})

		goog.events.listen(target, ['mouseup', 'touchend'], function(e){
			isPressed = false;
		})
		//
    //     //animate
    //     target.runAction(new lime.animation.Spawn(
    //         new lime.animation.FadeTo(.5).setDuration(.2),
    //         new lime.animation.ScaleTo(1.5).setDuration(.8)
    //     ));
		//
    //     title.runAction(new lime.animation.FadeTo(1));
		//
    //     //let target follow the mouse/finger
    //     e.startDrag();
		//
    //     //listen for end event
    //     e.swallow(['mouseup','touchend'],function(){
    //         target.runAction(new lime.animation.Spawn(
    //             new lime.animation.FadeTo(1),
    //             new lime.animation.ScaleTo(1),
    //             new lime.animation.MoveTo(512,384)
    //         ));
		//
    //         title.runAction(new lime.animation.FadeTo(0));
    //     });
		//
		//
    // });

	// set current scene active
	director.replaceScene(scene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('Invitation.start', Invitation.start);
