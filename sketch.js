var dog ,happydog, foodS,foodStock
var database,stock
 var feddog,addfood
 var fedatime,lastFed
 var foodObj
 var bedroom,garden,washroom
 var gameState
 var sadDog
function preload()
{
  dogImg =loadImage("images/dogImg.png")
  happydogImg=loadImage("images/dogImg1.png")
 // milkImg=loadImage("images/Milk(1).png")
  bedroonm=loadImage("virtualpetimages/Bed Room.png")
  garden=loadImage("virtualpetimages/Garden.png")
  washroom=loadImage("virtualpetimages/Wash Room.png")
  sadDog=loadImage("virtualpetimages/Lazy.png")
}

function setup() {
	createCanvas(1000,500);

  database=firebase.database()
  foodObj =new Food()
  feed = createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("add food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  dog=createSprite(410,500,20,20)
  dog.addImage=loadImage("images/dogImg.png")

  foodStock=database.ref('Food')
  foodStock.on("value", readStock )

  
  
}


function draw() {  
  background(46,139,87)
  fedTime=database.ref('FeedTime')
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
 
if(gameState!="hungry"){
  feed.hide()
  addFood.hide()
  dog.remove()
}
else{
  feed.show()
  addFood.show()
  dog.addImage(sadDog)
}

currentTime=hour();
if(currentTime==(lastFed+1)){
  update("playing")
  foodObj.garden()
}
else if(currentTime==(lastFed+2)){
  update("sleeping")
  foodObj.bedroom()
}
else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
  update("bathing")
  foodObj.washroom()
}
else{
update("hungry")
foodObj.display()
}

  drawSprites();
fill(255,255,254);
textSize(15);
if(lastFed>=12){
  text("Last Feed:"+lastFed%12+"PM",350,30);
}
else if(lastFed==0){
  text("Last Feed:12 AM",350,30)
}
else{
  text("Last Feed:"+ lastFed+"AM",350,30);
}

}



/*function readStock(x){
  if(x<=0){
x=0
  }
else{
  x=x-1
}
 database.ref('/').update({
   food:x
 })
}*/


function readStock(data){
  foodS=data.val()
  foodObj.updateFoodStock(foodS)
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })

  }


function feedDog(){
  dog.addImage(happydog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    FeedTime:hour()
  })

}
function gameState(){
  readState=database.ref('gamestate');
  readState.on("value",function(data){
    gameState=data.val();
  })
}

function update(State){
database.ref('/').update({
  gameState:State
})
}
