
var debug=false;
var singleBlock=false;
var teach = false;
var AutoHome = true;
var FreeHand = true;
var cnv = document.getElementById('cnv');
var touchArea = document.getElementById('toucharea');
var nozzle = document.getElementById('holdy');
var cnv = document.getElementById('cnv');
var ctx = cnv.getContext('2d');
var recPath;


var MC = {
	type:"VMC",
	}



var drawingDot={
	translateX:0,
	translateY:0,	
     d:0,
     dprev:0,
     b:0,
     bprev:-1
};

var GcodesDisp = {
x:"X",
y:"Y",
z:"Z",
f:"F",
motion:" ",
b:"N",
s:"S",
laser:{
	// functions HERE?
	cut:{
		on:{
			CW:'TC_LASER_ON(1,\"xXxTABLENAMExXx\",10,100)\n',
			CCW:'TC_LASER_ON(1,\"xXxTABLENAMExXx\",10,100)\n'
		},
		off:'TC_LASER_OFF(2)'
	},
},
VMC:{
	cut:{
		on:{
			CW:'M3',
			CCW:'M4'
		},
		off:'M5'
	},
	
},

}


// const doesn't seem to work with structured objects


const DEF={

	G0:{ 
          motion:'G0',
		f:3000,
		z:10,
		d:0
	},
	G1:{
          M3_5:"M5",
		motion:'G1',
		s:2000,
		f:1000,
		z:0,
		d:2
	},
	G28:{
		comment:'HOME',
          motion:'G0',
		x:0,
		y:0,
		z:10,
		f:3000,
		d:0,
	},
	MCSTATE:{
          spindle:"",
		motion:'',
		planeSelection:'G17',
		s:null,
		x:null,
		y:null,
		z:null,
		f:null,
		d:null,
          b:null,
	},

	laser:{
		MACROS:{
			dive:[{
				comment:'LEAD_IN',
				motion:'G1',
				z:0,
				f:200,
				s:2000,
				d:2,
				}],
			retract:[{
				comment:'LEAD_OUT',
				motion:'G0',
				z:10,
				f:3000,
				d:0
				}]
			}
	},

	VMC:{
		MACROS:{
			dive:[{
				comment:'DIVE',
				motion:'G1',
				z:0,
				f:200,
				s:2000,
				d:2,
				}],
			retract:[{
				comment:'RETRACT',
				motion:'G0',
				z:10,
				f:3000,
				d:0
				}]
			}
	}
}







ctx.fillStyle = "rgba(64,64,64,0.95)"

ctx.fillRect(0, 0, cnv.width, cnv.height);






var textifyObject= function(obj,replacer){
	outstr="";
	replacer = replacer? 
	     replacer  :  function(k,v){return k+":"+v+" "}

	Object.entries(obj).forEach(function(entry){
		key=entry[0];
		val=entry[1];
		
		outstr+=replacer(key,val)
		});

	return outstr;
}

var logCoordinates= function(){
	document.getElementById("loggy").innerText=
	"Run Mode"+ textifyObject({
			X:Math.round(drawingDot.translateX),
			Y:Math.round(drawingDot.translateY),
		     d:drawingDot.d,
    	      block:drawingDot.b,
    	   });
};

function clickAnim(el){
notify(el,true);
setTimeout(function(){notify(el,false)},500);
}


//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//------------------------CSSnc START--------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------


(function(){
function CSSnc(){
	}

CSSnc.Point = function(x=0,y=0,z=0){
	this.x=x;
	this.y=y;
	this.z=z;
    }


CSSnc.Point.prototype.move = function(x,y=0,z=0){	
	if (typeof x === 'object'){
		y=x.y;z=x.z;x=x.x
		}
	this.x+=x;
	this.y+=y;
	this.z+=z;

    }

CSSnc.Point.prototype.toArray= function(){
	return [
	     this.x,
		this.y,
		this.z
	     ]
	}


CSSnc.Toolpath = function(points=new Array(Object.assign({},DEF.G28))){
	this.points = points ; 
	this.segmentsQTY = 0;
	}

CSSnc.Toolpath.prototype.add = function(point){
		this.points.push(Object.assign({},point));
	}


CSSnc.RandomPoint = function(min,max,i){

     ept=[0,0,0];
     ept.forEach(
          (v,i,a)=>{
              a[i]=anime.random(min,max)
                 });

	this.x=ept[0];
	this.y=ept[1];
	this.z=ept[2];
     this.f=1000;
     this.d=2;
     this.b=i;// only in this case, as each line comes from separate randomly generated block
	};









window.CSSnc = CSSnc;

})();
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//------------------------CSSnc end----------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------







 

/*toolpath = new CSSnc.Toolpath([
{x:0,y:0,z:0,f:1,d:0,b:1,motion:'G1'},

{x:100,y:0,z:0,f:1000,d:2,b:2},


{x:100,y:100,z:0,f:500,d:2,b:3},

{x:0,y:100,z:0,f:1000,d:2,b:4},

{x:0,y:0,z:0,f:1000,d:2,b:5},

{x:150,y:150,z:0,f:2000,d:0,b:6},

{x:350,y:150,z:0,f:1000,d:2,b:7},

{x:350,y:200,z:0,f:1000,d:2,b:8},

{x:150,y:200,z:0,f:1500,d:2,b:9},

{x:150,y:150,z:0,f:1000,d:2,b:10},

{x:0,y:0,z:0,f:2000,d:0,b:11},
]);

numberBlocks(toolpath.points,10);
toGcode(toolpath.points)
animePath = toAnimePath(toolpath);

console.log(JSON.stringify(toolpath));
*/




function clearAnime(){
let dummy = new CSSnc.Toolpath();
numberBlocks(dummy.points,10);
toAnimePath(dummy);
toGcode(dummy.points)
swipe();
}



function toAnimePath(toolpath){
     toolpath = Object.assign({},toolpath);

	anime.easings['instant'] = function(t){
	return true;
	}




	Keyframe= function(val,dur,del,pt){
		this.value=val;
		this.duration=dur;
		this.delay=del;
           //this.b = pt.b;
		}


	calcDur= function(curPt,prevPt,feed){
		distance = Math.hypot(curPt.x-prevPt.x,curPt.y-prevPt.y)
          duration = distance*10000/feed;
          return duration;
		}

	let 
	xa=[],
	ya=[],
	za=[],
	da=[],
	ba=[];

	/*
	homestart=Object.assign({},DEF.G28,{b:-1})
	
	toolpath.points.unshift(homestart)
	*/

	toolpath.points.forEach(
		(pt,idx,arr)=>{
	       
	       // assigns 0 duration for starting point 
	       // to avoid arr[0-1] if idx is 0;
	       dur = idx==0? 
	
	            0:
	            calcDur(pt,arr[idx-1],pt.f);
	       
	       objx= new Keyframe(pt.x,dur,0,pt);
	       objy= new Keyframe(pt.y,dur,0,pt);
	       objz= new Keyframe(pt.z,dur,0,pt);
	       objd= new Keyframe(pt.d,dur,0,pt);
	       objb = new Keyframe(pt.b,dur,0,pt);
	       objd.round=true;
	       objb.round=true;
	
		  xa.push(objx);
		  ya.push(objy);
	       za.push(objz);
	       da.push(objd);
	       ba.push(objb);
	
		  })


animePath = anime.timeline({
	  targets: '.tool',
	  direction: 'forwards',
	  loop: false,
	  autoplay: false,
	  update: function(anim){
		if (debug){
		document.getElementById("debuglog")
		.innerText = JSON.stringify(anim,null,"__|");
		}
	
	     // If animation initiated
		if (anim.children[0]){
	         onOffLogic(drawingDot);        
	         logCoordinates();  
	      }// end of if Animation initiated 
	  },
	  complete: function(){
	     $('#holdy').removeClass("holderon").addClass("holder");
	     //$('#tool').addClass("orbit");
	     }
	}).add([{  targets: ['.tool',drawingDot,'.point'],
		  translateX: xa,
		  translateY: ya,
	      
		  elasticity:0,
		  easing:'linear',
		  }
	
	      ,{  targets: ['#holdy',drawingDot],
	       offset:0,
	       d:da,
	       b:ba,
	       easing:'instant'
	       }])
	
	return animePath;
}














/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/




var
logMsg= function(msg){

document.getElementById("loggy").innerText=msg
}







function swipe(){

logCoordinates();
ctx.fillStyle = "rgba(64,64,64,0.95)"
ctx.fillRect(0, 0, cnv.width, cnv.height);


  animePath.restart();
  animePath.pause();
}





function toGcode(path){
let state= Object.assign({},DEF.MCSTATE)
stringsArray = path.map(
	function (p,i,a){
		
		if (a.length < 2){
			console.log(JSON.stringify(a,null,"\t"))
			return "empty prog"
			}
			
		/* if p property is different from the state, 
		 ,it should be displayed, it can be omitted otherwise,
		or in the case it is undefined */
		now = {};
          
		Object.keys(state).forEach(function(k){
		now[k] = state[k] === p[k]? 
			""  :  
			p[k] !== undefined ? 
				GcodesDisp[k]+p[k]+" "  :  ""; 
	    }) ;
		
		now.spindleCommand = state.d === p.d ?
			""  :  
			p.d === 0 ?
				GcodesDisp[MC.type].cut.off  :
				GcodesDisp[MC.type].cut.on.CW;
		
		now.comment = p.comment ? 
			";"+p.comment+"\n"  :
			"";
              			
		
		line = now.comment
			+ now.b
			+ now.spindleCommand+" "
			+ now.motion 
			+ now.x 
			+ now.y
			+ now.z 
			+ now.f 
			+ now.s
	          + ";";

          Object.assign(state,p)
	
	     return line;
		}
	)


	// SEPARATED because later on will try to generate nice interface with highliting blocks executed 
	gcodeString = "";
	
	stringsArray.forEach(
		function(val,idx,arr){
		gcodeString += val +"\n";
		}
	)

	document.getElementById('txtArea').innerText = 
	gcodeString;
}


//_____________________________________________________________
// Why numbering is wrong?
// 1- async (numbered before replaced?) NO?
//     * checked consolelogging each index along with b
// 2- Array.prototype.splice.apply messes array's indices up?
// 3- i was copying references to objects instead clones ;(









//----------------------------------------------------------------------------------------------------------NUMBER BLOCKS

function numberBlocks(points,increment){
	points.forEach(
		function(el,idx,arr){
			el.b = (idx+1)*increment;
			}
		)
}













function applyMacros(recTP,macros){

Object.keys(macros).forEach(function(macro){
	recTP.reduce(function(acc,el,i){
		return el === macro ?
			 acc.concat(i)  :  acc
		},[])
	.forEach(function(index){
		/*for each index for each macro name
		 replace macro name with elements of
		 array inside MACROS.macro property
           SINCE :
           it is not the object inserted into array but only reference to object inside DEF collection
           TO DO:
           create copies of each macros.macro elements
           and THEN INSERT THESE COPIES INTO PROGRAM

		BUT YOU NEED TO MERGE THEM WITH PREVIOUS BLOCK X's and Y's (not for
		printing gcode out properly, it is redundant anyway, but for anime since every keyframe has to have value)
          */
		prevBlock = recTP[index-1];
          COPIES = macros[macro].map((block)=>Object.assign({},prevBlock,block));

		Array.prototype.splice.apply(recTP,[index,1].concat(COPIES));
		})
	})


}






 


 
function listen(teachmode){

B.Id("loggy").innerText="Teach Mode";
if (!teach) {
//remove event listeners and prompt to save blocks

cnv.style.borderColor = 'rgba(200,200,200,0.5)';
cnv.removeEventListener('touchmove',handleMove, false);
cnv.removeEventListener('touchstart',handleStart, false);
cnv.removeEventListener('touchend',handleEnd, false);


AutoHome? 
	recPath.add(DEF.G28)
	:
	0;

console.log(JSON.stringify(recPath.points,null,"\t"))


applyMacros(recPath.points,DEF[MC.type].MACROS);

numberBlocks(recPath.points,10);

console.log(JSON.stringify(recPath.points,null,"\t"))

toGcode(recPath.points);

toAnimePath(recPath);

//swipe();


}else{

//start

recPath = new CSSnc.Toolpath();


cnv.style.borderColor = 'red';


    cnv.addEventListener('touchmove',handleMove, false);
    cnv.addEventListener('touchstart',handleStart, false);
    cnv.addEventListener('touchend',handleEnd, false);
}
}






function handleStart(event){
	tcoord = getTouchesXYArr(event)[0]
	if (tcoord){
	     drawdot(tcoord.x,tcoord.y,2,"#f55");
	
		blck = Object.assign({},DEF.G0,tcoord);
		recPath.segmentsQTY++;
		blck.comment="=====PATH SEGMENT_"+recPath.segmentsQTY+"======";
		
		recPath.points.push(blck);
		
		blck = "dive"
		recPath.points.push(blck);
	}
}







function handleEnd(event){
	tcoord = getTouchesXYArr(event)[0]
	if (tcoord){
	     drawdot(tcoord.x,tcoord.y,2,"#45f");
		blck = Object.assign({},DEF.G1,tcoord);
		recPath.points.push(blck);
		
		blck = "retract"
		recPath.points.push(blck);
	}
}






function handleMove(event){
	tcoord = getTouchesXYArr(event)[0]
	if (tcoord){
	     drawdot(tcoord.x,tcoord.y,2,"#5f5");
		blck = Object.assign({},DEF.G1,tcoord);
		recPath.points.push(blck);
	}     
}







function getTouchesXYArr(event){
   event.preventDefault();

let
elTouchs = event.targetTouches,
 
el = event.target,

outparr = [];



     if (event.targetTouches.length>1){
logMsg("amount of touches changed")
     // things to do if amount of fingers touching screen changes
      // and then... return to not execute following code
      

return false;
      
     }else{

	touch = event.targetTouches[0]? event.targetTouches[0]:event.changedTouches[0]}







var sX = window.pageXOffset;
var sY = window.pageYOffset;
     
	      
	Ex = touch.pageX<0 ? "200px":touch.pageX-sX;
	Ey = touch.pageY<0 ? (console.log("touch beyond screen!:"+touch.pageY),'1000px'):touch.pageY-sY;

eloffs = $(el).offset()

    elX = eloffs.left;
   elY =  eloffs.top;

	cX =Ex+sX-elX;
     cY =Ey+sY-elY;
 // console.log();
  


      
//console.log("↹:\n"+cX+"\n"+cY)

	
	


outparr.push({x:cX,y:cY})



    
     B.log([sX,sY,elX,elY,Ex,cX,cY],"loggy");

return outparr;

}





/*







zeby uzyskac absolut/ incremental g0 modalne itd
moment lub funkcje zrób funkcję która jest zmieniana(ma stan is stateful) przez nia beda przechodzily wszystkie wspòłrzędne dopòki nie następuje komenda modalna ktòra modyfikuje jej oddziaływanie na koordynaty

tworzenie linijek kodu porze nie obiektu na podstawie linijek kodu będzie wyglądało następująco:

każda linijka zawierająca kody jest już ostatecznymi koordynatami które pojawiają się na wyświetlaczu które będą animowane

obiekt który będzie je tworzył będzie modyfikowany przez każdą następującą linijkę jeżeli zawiera ona inne niż dwie drogi jeden kody

każdy koordynaty następujących po nich linijka będzie modyfikowany na podstawie funkcji która bierze pod uwagę i zatrzymuje dopóki nie zostaną wyłączone polecenia modalne takie jak Absolut współrzędne absolutne lub Inkrementacja

dodatkowo każdy kij Prim
additionally every key frame Will hold ID property referencing to a block that generated it in order to differentiate them while running on single block to stop animation in the call back with
provided anime funcs stop play


you dont have to measure radial distance since the radius will be calculated as a series of coordinates - lines between them will be your distance and duration will be counted for latter.

{x:0,y:0,z:0,f:1,d:0,b:1},

{x:100,y:0,z:0,f:1000,d:2,b:2},


{x:100,y:100,z:0,f:500,d:2,b:3},

{x:0,y:100,z:0,f:1000,d:2,b:4},

{x:0,y:0,z:0,f:1000,d:2,b:5},

{x:150,y:150,z:0,f:2000,d:0,b:6},

{x:350,y:150,z:0,f:1000,d:2,b:7},

{x:350,y:350,z:0,f:1000,d:2,b:8},

{x:150,y:350,z:0,f:1500,d:2,b:9},

{x:150,y:150,z:0,f:1000,d:2,b:10},

{x:0,y:0,z:0,f:2000,d:0,b:11},

there's better way of doing it!

PERFORMANCE!!!

each block that does not have b property is not a block that can switch cutting off or on so check for d prop only if b appears(then you have new block, and only once! if d has changed)
BUT!
you need to find a way to reach to current keyframe property during 
an animation.




var MCSTATE= Object.assign({},DEF.MCSTATE);

var pot = Object.assign({},MCSTATE,{x:500});

var pot2 = Object.assign({},MCSTATE,{x:600});

//MCSTATE.x = 500;

console.log("def"+JSON.stringify(DEF.MCSTATE,null,"\t"))
console.log("stt"+JSON.stringify(MCSTATE,null,"\t"))
console.log("p1"+JSON.stringify(pot,null,"\t"))
console.log("p2"+JSON.stringify(pot2,null,"\t"))



x = cx + r * cos(a)
y = cy + r * sin(a)






*/







function draw(x,y,dia){
//if (dia<1){return}

ctx.clearRect(x-dia/2,y-dia/2,dia,dia);



ctx.lineTo(x,y);
ctx.stroke();
}

function drawdot(x,y,dia,fillsetting){
ctx.clearRect(x-dia/2,y-dia/2,dia,dia);

if(!fillsetting)ctx.clearRect(x-dia/2,y-dia/2,dia,dia)
   else{
   ctx.save();
   ctx.fillStyle = fillsetting;
   ctx.fillRect(x-dia/2,y-dia/2,dia,dia);
   ctx.restore();
}
    
}

function notify(el,booldep){
 el.className =  booldep ?
      "activebtn"
      :
      "";


}





function onOffLogic(drawingDot){
  // CHANGE IN CUTTING MODE

  if (drawingDot.b !== drawingDot.bprev){     
         // things to do only when new block comes
         // highlight next block
   
         drawingDot.bprev = drawingDot.b;


        singleBlock ? animePath.pause():'continue';


         if (drawingDot.d !== drawingDot.dprev){
	    

          nozzle.className = drawingDot.d==0 ? 
      	"holder":"holderon";
            drawingDot.dprev = drawingDot.d;

         }   //END of CHANGE IN CUTTING MODE if
   } // end of next block logic

          if (drawingDot.d<1){
              /*
               ctx.moveTo(
                  drawingDot.translateX,
                  drawingDot.translateY
                  );
               */
             return;
          
          }else{
        
             drawdot(
                  drawingDot.translateX,
                  drawingDot.translateY,
                  drawingDot.d
                 );
		
	      	}
         

          
}

// -------- a a a a a a a a a a a a a a a a a Lines

function onOffLogicLINES(drawingDot){
    // CHANGE IN CUTTING MODE

         if (drawingDot.d !== drawingDot.dprev){
	    

          nozzle.className = drawingDot.d==0 ? 
      	"holder":"holderon";
            drawingDot.dprev = drawingDot.d;
            }   //END of CHANGE IN CUTTING MODE if
            
          if (drawingDot.d<1){
              ctx.moveTo(
                  drawingDot.translateX,
                  drawingDot.translateY
                  );
          
          }else{
        
             draw(
                  drawingDot.translateX,
                  drawingDot.translateY,
                  drawingDot.d
                 );
		  logCoordinates(anim);
	      	}
}


/*

toolpath = [
{x:0,y:0,z:0,f:1,},

{x:100,y:0,z:0,f:1},


{x:100,y:100,z:0,f:1},

{x:0,y:100,z:0,f:1},

{x:0,y:0,z:0,f:1},
];

*/



var
B= {

dt:{},//storage for places

Id(x){
return document.getElementById(x);
},

Id_It(el){
return typeof el === 'string' ? B.Id(el) : el;
},

prec(x,d){
return Math.round(x/d)*d;
},

nxt(el,ar,dir=1,pre=""){
let core = typeof el === "string" ? el.replace(pre,""):(pre=0,el);
let i = ar.indexOf(core)+dir;
return i>=ar.length ? pre+ar[0]: 
       i<0 ? pre+ar[ar.length-1]:
       pre+ar[i];
},



nxtInnTxt(el,ar,dir=1,pre=""){
if (Array.isArray(el)){
let outar=[];
for (ix=0; ix<el.length;ix++){outar[ix]=B.nxtInnTxt(el[ix],ar,dir,pre)}
return outar;
}else{
el = B.Id_It(el);
el.innerText = B.nxt(el.innerText,ar,dir,pre);
return el.innerText.replace(pre,"");}
},

set(mth,el){
B.dt[mth]=B.Id_It(el);
},


log(msg,where=B.dt.log,addy){

where = B.Id_It(where);
where.innerText = addy ? 
where.innerText+"\n" + msg : msg;
},

onOff(el){
el = B.Id_It(el);
el.style.display = el.style.display=='none' ? '':'none';
},

toggle(el){
el = B.Id_It(el);
$("#"+el.id).animate({height:"toggle"});
//el.style.display = el.style.display=='none' ? '':'none';
},



}




