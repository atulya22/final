
var popul;
var lifespan = 300;
var lifeP;
var count = 0;
var target;
var maxForce = 0.1;

function setup() {
  createCanvas(400, 300);
  popul = new Population();
  lifeP = createP();
  target = createVector(width/2, 50);
}

function draw() {
  background(0);
  popul.run();
  lifeP.html(count);
  count++;

  if (count == lifespan) {
    popul.evaluate();
    popul.selection();
    count = 0;
  }

  ellipse(target.x, target.y, 30, 30);
}

function Population(){
  this.rockets = [];
  this.popsize = 20;
  this.matingpool = [];

  for (var i = 0; i < this.popsize; i++) {
    this.rockets[i] = new Rocket();
  }

  this.evaluate = function() {

    var maxfit = 0;
    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i].calcFitness();
      if(this.rockets[i].fitness > maxfit) {
        maxfit = this.rockets[i].fitness;
      }
    }
    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i].fitness /= maxfit;
    }

    createP("Fitness function:" + maxfit);
    this.matingpool = [];

    for (var i = 0; i < this.popsize; i++) {
      var n = (this.rockets[i].fitness * 100)
      for (var j = 0; j < n; j++) {
        this.matingpool.push(this.rockets[i])
      }
    }
    // console.log(this.matingpool.length);
    console.log(this.matingpool.length);
  }

  this.selection = function() {
    var newrockets = [];
    for (var i = 0; i < this.rockets.length; i ++) {
      var parentA = random(this.matingpool).dna;
      var parentB = random(this.matingpool).dna;
      var child = parentA.crossover(parentB);
      child.mutation;
      newrockets[i] = new Rocket(child);
    }
    this.rockets = newrockets;
  }


  this.run = function () {
    for (var i = 0; i < this.popsize; i++) {
      rocket = this.rockets[i];
      rocket.update()
      rocket.show()
     }
  }
}


function DNA(genes) {
  if (genes) {
    this.genes = genes
  } else {
    this.genes = [];
    for (var i = 0; i < lifespan; i++) {
      this.genes[i] = p5.Vector.random2D();
      this.genes[i].setMag(maxForce);
    }
  }

  this.crossover = function(partner) {
    var newgenes = []
    var mid = floor(random(this.genes.length));
    for (var i = 0; i < this.genes.length; i++) {
      if (i > mid) {
        newgenes[i] = this.genes[i];
      }
      else {
        newgenes[i] = partner.genes[i];
      }
    }
    return new DNA(newgenes);
  }

  this.mutation = function() {
    for(var i = 0; i < this.genes.length; i++) {
      if (random(1) < 0.01) {
        this.genes[i] = p5.Vecotor.random2D();
        this.genes[i].setMag(maxForce);
      }
    }
  }
}

function Rocket(dna) {
  this.position = createVector(width/2, height);
  this.velocity = createVector();
  this.acceleration = createVector();
  this.completed = false;
  this.crashed = false;
  this.finishTime = 0;

  if (dna) {
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }

  this.fitness = 0;


   this.applyForce = function(force) {
     this.acceleration.add(force);
   }

   this.calcFitness = function() {
     var d = dist(this.position.x, this.position.y, target.x, target.y);
     this.fitness = map(d, 0, width, width, 0);

     if(this.completed) {
       this.fitness *= 10;
     }

     if (this.crashed) {
       this.fitness /= 10;
     }
   }


   this.update = function() {

     var d = dist(this.position.x, this.position.y, target.x, target.y);
     console.log(d);
     if (d < 10) {
       this.completed = true;
       this.position = target.copy();
     } else {
       this.finishTime++;
     }

     this.applyForce(this.dna.genes[count]);

     if(!this.completed && !this.crashed) {
       this.velocity.add(this.acceleration);
       this.position.add(this.velocity);
       this.acceleration.mult(0);
       this.velocity.limit(4)
     }
   }

   this.show = function() {
     push();
     noStroke();
     fill(255, 150)
     translate(this.position.x, this.position.y);
     rotate(this.velocity.heading());
     rectMode(CENTER);
     rect(0, 0, 25, 10);
     pop();
   }
}
