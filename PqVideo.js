var PqVideo={};
(function(PqVideo){
    PqVideo.panel=null;
	PqVideo.url="";
	PqVideo.video=null;
	PqVideo.backgroundStr='<div id="videoBg" style="position:absolute;width:100%;height:100%;background-color:#000000"></div>';
	PqVideo.playBtnStr='<div id="playBtn" style="width:100%;height:100px;text-align:center;z-index:999;position:absolute;margin-top:300px;display:none"><img src="img/play.png" width="100" height="100" /></div>';
    PqVideo.loadingStr= '<div id="loading" style="width:100%;height:100px;text-align:center;z-index:999;position:absolute;margin-top:300px;color:#ffffff;display:none">正在缓冲......</div>';
    PqVideo.exitBtnStr= '<div id="exitBtn" style="width:100px;height:100px;z-index:999;position:absolute;top:0;margin-top:0px;"><img src="img/goback.png" /></div>';
	PqVideo.videoideoStr='<video id="videoPlayer" style="position:absolute;width:100%;height:100%" src="VIDEO_URL" width="100%" height="100%" muted autoplay="autoplay" webkit-playsinline playsinline x5-playsinline x5-video-player-type="h5"></video>';
    PqVideo.playBtn=null;
    PqVideo.loading=null;
    PqVideo.exitBtn=null;
	PqVideo.videoideo=null;
	PqVideo.playing=false;
	PqVideo.isLoading=false;
	PqVideo.isFirst=false;
	PqVideo.canExit=true;
	PqVideo.canPause=true;
	PqVideo.checkLoading=false;
	PqVideo.checkLoadingNext=false;
    PqVideo.create=function(id,url,param){
		PqVideo.isFirst=true;
		if(PqVideo.video!=null)PqVideo.destory();
        PqVideo.panel=$("#"+id);
		PqVideo.url=url;
		PqVideo.videoideoStr=PqVideo.videoideoStr.replace("VIDEO_URL",url);
		PqVideo.panel.append(PqVideo.backgroundStr);
		PqVideo.panel.append(PqVideo.videoideoStr);
        PqVideo.panel.append(PqVideo.playBtnStr);
        PqVideo.panel.append(PqVideo.loadingStr);
        PqVideo.panel.append(PqVideo.exitBtnStr);
		PqVideo.video=$("#videoPlayer")[0];
		PqVideo.playBtn=$("#playBtn")[0];
		PqVideo.loading=$("#loading")[0];
		PqVideo.exitBtn=$("#exitBtn")[0];
		PqVideo.isLoading=true;
		$("#playBtn").css("margin-top",$(document).height()*0.45);
		$("#loading").css("margin-top",$(document).height()*0.5);
		$("#videoPlayer").css("height",$(document).height());
		PqVideo.init();
		return PqVideo;
    }
	PqVideo.init=function(){
		PqVideo.regEvent();
		PqVideo.video.play();
		PqVideo.fullScreen(document);
	}
	PqVideo.regEvent=function(){
		//延迟计算加载失败事件
		// this.timerErrorFun();
		PqVideo.video.addEventListener('loadedmetadata', PqVideo.judgeIsLive);
		PqVideo.video.addEventListener('playing', PqVideo.playingHandler);
		PqVideo.video.addEventListener('pause', PqVideo.pauseHandler);
		PqVideo.video.addEventListener('timeupdate', PqVideo.eventTimeupdate);
		PqVideo.video.addEventListener('waiting', PqVideo.loadingStart);
		PqVideo.video.addEventListener('seeked', PqVideo.seekedHandler);
		PqVideo.video.addEventListener('ended', PqVideo.endedHandler);
		PqVideo.video.addEventListener('error', PqVideo.errorListenerFun);
		PqVideo.video.addEventListener('click', PqVideo.click);
		PqVideo.playBtn.addEventListener('click', PqVideo.playOrPause);
		PqVideo.exitBtn.addEventListener('click', PqVideo.destory);
		// PqVideo.video.addEventListener('volumechange', eventVolumeChange);
	}
	PqVideo.removeExitBtn=function(){
		PqVideo.canExit=false;
		PqVideo.refeachUi();
	}
	PqVideo.removePlayBtn=function(){
		PqVideo.canPause=false;
		PqVideo.refeachUi();
	}
	PqVideo.click=function(event){
		if(!PqVideo.canPause)return;
		if(PqVideo.playing)PqVideo.video.pause();
		else PqVideo.video.play();
		PqVideo.playing=!PqVideo.playing;
	}
	//监听视频加载到元数据事件
	PqVideo.judgeIsLive=function(){
		console.log("loadmateData");
		PqVideo.video.play();
	}
	//监听视频播放事件
	PqVideo.playingHandler=function(){
		console.log("play");
		PqVideo.isFirst=false;
		PqVideo.playing=true;
		PqVideo.isLoading=false;
		PqVideo.refeachUi();
	}
	//监听视频暂停事件
	PqVideo.pauseHandler=function(){
		console.log("pause");
		PqVideo.playing=false;
		PqVideo.isLoading=false;
		PqVideo.refeachUi();
	}
	//监听视频播放时间事件
	PqVideo.eventTimeupdate=function(){
		console.log("playing...");
		PqVideo.playing=true;
		PqVideo.isLoading=false;
		PqVideo.refeachUi();
		PqVideo.checkLoadingNext=true;
		if(!PqVideo.checkLoading){
		    PqVideo.checkLoadingNext=false;
		    PqVideo.checkLoading=true;
		    setTimeout(function(){
		        if(PqVideo.checkLoadingNext)return;
                PqVideo.isLoading=true;
                PqVideo.refeachUi();
		    },2000);
		}
	}
	//监听视频缓冲事件
	PqVideo.loadingStart=function(){
		console.log("loading...");
		PqVideo.playing=false;
		PqVideo.isLoading=true;
		PqVideo.refeachUi();
	}
	//监听视频seek结束事件
	PqVideo.seekedHandler=function(){
		console.log("seek");
	}
	//监听视频播放结束事件
	PqVideo.endedHandler=function(){
		console.log("end");
		PqVideo.destory();
	}
	PqVideo.errorFun = function(event) {
		alert("视频加载失败："+event);
		PqVideo.destory();
	}
	PqVideo.errorListenerFun=function(){
		window.setTimeout(function() {
			if(isNaN(thisTemp.V.duration)) {
				errorFun(event);
			}
		}, 500);
	}
	PqVideo.refeachUi=function(){
		$("#playBtn").css("display",!PqVideo.canPause||PqVideo.playing||PqVideo.isLoading?"none":"block");
		$("#loading").css("display",PqVideo.isLoading?"block":"none");
		$("#exitBtn").css("display",PqVideo.playing&&PqVideo.canExit?"block":"none");
	}
	PqVideo.destory=function(){
		PqVideo.panel.empty();
		PqVideo.video.removeEventListener('loadedmetadata', PqVideo.judgeIsLive);
		PqVideo.video.removeEventListener('playing', PqVideo.playingHandler);
		PqVideo.video.removeEventListener('pause', PqVideo.pauseHandler);
		PqVideo.video.removeEventListener('timeupdate', PqVideo.eventTimeupdate);
		PqVideo.video.removeEventListener('waiting', PqVideo.loadingStart);
		PqVideo.video.removeEventListener('seeked', PqVideo.seekedHandler);
		PqVideo.video.removeEventListener('ended', PqVideo.endedHandler);
		PqVideo.video.removeEventListener('error', PqVideo.errorListenerFun);
		// PqVideo.video.removeEventListener('volumechange', eventVolumeChange);
		PqVideo.video=null;
	}
	PqVideo.delayFunc=function(func){
		setTimeout(func,10);
	}
    PqVideo.play=function(){
        if(PqVideo.video)PqVideo.video.play();
    }
    PqVideo.pause=function(){
		if(PqVideo.video)PqVideo.video.pause();
    }
    PqVideo.playOrPause=function(){
		if(!PqVideo.canPause)return;
        if(PqVideo.playing)PqVideo.video.pause();
		else PqVideo.video.play();
    }
    PqVideo.fullScreen=function (ele){
        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullscreen) {
            ele.webkitRequestFullscreen();
        } else if (ele.msRequestFullscreen) {
            ele.msRequestFullscreen();
        }
    }
    PqVideo.exitFullscreen=function () {
    if(document.exitFullScreen) {
        document.exitFullScreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if(document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    PqVideo.isFullScreen=function (){
        return  !!(
            document.fullscreen || 
            document.mozFullScreen ||                         
            document.webkitIsFullScreen ||       
            document.webkitFullScreen || 
            document.msFullScreen 
        );
    }
}
}(PqVideo));
