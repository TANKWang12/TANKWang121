// 轮播图插件
// 使用立即执行函数，不污染变量 
(function(){
	
            function Init(options){    //创建构造函数，
            	//初始化变量
            	this.parent=options.parent;    // 外部是谁调用的这个轮播图方法，谁就是父级
            	this.images=options.images;   //传入的图片数组
            	this.imgNum=options.images.length;  //图片个数
            	this.direction=options.direction || 'next'; //方向
            	this.imgWidth=options.width || $(this.parent).width();
            	this.imgHeight=options.height || $(this.parent).height();
            	this.btnWidth=options.btnWidth || '50px';
            	this.btnHeight=options.btnHeight || '50px';
            	this.autoTime=options.autoTime || 3000; //轮播时间
            	//判断传入的nowIndex值是否合法
            	this.nowIndex=((options.nowIndex >= 0) && (options.nowIndex<this.imgNum) ? options.nowIndex : 0) || 0;
            	this.timer=null;
            	this.lock=true;
   	            
   	            this.createDom();
   	            this.addCss();
   	            this.bindEvent();
   	            this.move(this.nowIndex);
   	            this.autoMove();
            	this.changeIndex();
            }
            Init.prototype.createDom=function(){       //动态创建dom

           var sliderPage=$('<ul class="sliderPage"></ul>');
           var pointer=$('<div class="pointer"></div>');
           for(var i=0;i<this.imgNum;i++){
           	  //在ul上插入li
           	   $('<li><img src="'+ this.images[i]+'" /></li>').appendTo(sliderPage);
           	 //在pointer里面插入圆点，圆点个数根据图片个数变化
           	// $('<div></div>').appendTo(pointer);     这个项目不需要用到圆点
           	   
           }
           //插入最后一个li，内容与第一个li图片相同
           sliderPage.append($('<li><img src="'+this.images[0]+'" /></li>'));
           //将ul插入到父级上，
           $(this.parent).append(sliderPage)
                         .append($('<div class="btn leftBtn">&lt;</div>'))
                         .append($('<div class="btn rightBtn">&gt;</div>'))
                         .append(pointer);
           	
            }
            
        Init.prototype.addCss=function(){          //给dom添加css
            	$('.sliderPage',this.parent).css({     //$的第二个参数表示作用域
	            		position:'absolute',
				        top:0,
					    left:0,
					    width:(this.imgNum+1)*this.imgWidth	
            	});
            	
            	$('.sliderPage li',this.parent).css({
            		width:this.imgWidth,
					height:this.imgHeight,   //宽度和高度由用户传进来
					float:'left'
            	});
            	
            	$('.sliderPage li img',this.parent).css({
            		width:'100%',
					height:'100%',
					objectFit:'cover',
					objectPosition:'center'
            	});
            	
            	$('.btn',this.parent).css({
            		width:this.btnWidth,
					height:this.btnHeight,
					position:'absolute',
					zIndex:999,
					textAlign: 'center',
					lineHeight: this.btnHeight,
					fontSize: '20px',
					color: 'hsla(0,0%,100%,.4)',
					cursor:' pointer',
					backgroundColor: 'rgba(0,0,0,.2)',
					display:'none'
            	});
            	
            	$('.leftBtn',this.parent).css({
            		left: '0px',
					top:'50%',
					marginTop:'-25px'          		
            	});
            	
            	$('.rightBtn',this.parent).css({
            		right: '0px',
					top:'50%',
					marginTop:'-25px'		
            	});
            	
            	$('.pointer',this.parent).css({
            		position:'absolute',
					bottom:'25px',
					left:'50%',
					marginLeft: '-80px'
            	});
            	
            	$('.pointer div',this.parent).css({
            		'float':'left',
					width:'10px',
					height:'10px',
					borderRadius: '50%',
					marginLeft:'10px',
					cursor: 'pointer'	
            	});
            	
            	
            }
        Init.prototype.bindEvent=function(){   //事件处理函数
        	    var self=this;
            	$(this.parent).hover(function(){   //移入
            		$(".btn",self.parent).show();
            		clearInterval(self.timer);	
            	},function(){                   //移出
            		$(".btn",self.parent).hide();    
            		self.autoMove();	
            	});
            	
            	
            	
           
            	$(this.parent).on('click','.btn',function(){   //选择器
            		
            		if($(this).hasClass("leftBtn")){   //判断点击的是左按钮还是右按钮
            			//点击左按钮，往前翻一页
            			 self.move('prev');
            		}else if($(this).hasClass("rightBtn")){
            			//点击右按钮，往下翻一页
            			 self.move('next');
            		}	
            	});
            	
            	
            	$('.btn',this.parent).hover(function(){
            		$('.btn').css({
            			backgroundColor: 'rgba(0,0,0,.6)',
            			color: 'hsla(0,0%,100%,1)'
            		});
            	},function(){
            		$('.btn').css({
            			backgroundColor: 'rgba(0,0,0,.2)',
            			color: 'hsla(0,0%,100%,.4)'
            		});
            	});
            	
                $(".pointer",this.parent).on('mouseenter','div',function(){
                	self.move($(this).index());
                });
            	
            }
        Init.prototype.move=function(direction){
            	var sliderPage=$(".sliderPage",this.parent);
//          	console.log(sliderPage.Style().left);
                var self=this;
                if(this.lock){
                	if(direction=='prev'){
            		//点击左按钮，left值增加
            		this.lock=false;
            		if(this.nowIndex==0){  //判断当前图片是否为第一张
            			this.nowIndex=this.imgNum; //nowIndex=4
            			sliderPage.css({left:-this.imgWidth*this.nowIndex});	
            		}
            		this.nowIndex--;
            		sliderPage.animate({
            				left:-this.imgWidth*this.nowIndex 
            		},500,function(){
            			self.changeIndex();
            			self.lock=true;
            		});
            	}else if(direction=="next"){
            		//点击右按钮，left减少
            		this.lock=false;
            		this.nowIndex++;
            		if(this.nowIndex==this.imgNum){
            			this.nowIndex=0;	
            		}
            		sliderPage.animate({
            			left:-this.imgWidth*this.nowIndex
            		},500,function(){
            			self.changeIndex();
            			self.lock=true;
            		});
            	}else if(typeof direction=='number'){
            		this.lock=false;
            		this.nowIndex=direction;
            		sliderPage.animate({
            			left:-this.imgWidth*this.nowIndex
            		},500,function(){
            			self.changeIndex();
            			self.lock=true;
            		});
            	}
            	
               }	
            }
        Init.prototype.changeIndex=function(){    //切换活动点          
            	
              $(".pointer div",this.parent).css({background:'#fff'}).eq(this.nowIndex).css({background:'red'});
	
            }
        Init.prototype.autoMove=function(){
        	var self=this;
            	this.timer=setInterval(function(){
            		self.move(self.direction);
            	},this.autoTime);
            }
            
	
	$.fn.extend({
		swiper:function(options){
			options.parent=this;   //谁调用的swiper这个方法，this就是指向谁
			console.log(options);
			new Init(options);
		},
		
		
	})
	
} ());


	
	

