// Author: Debarun Mitra
// Technology used: HTML, CSS, JavaScript, JQuery, Bootstrap
// objective: Create a quiz application
class QuizOn{
  constructor(){
    this.st=0;
    this.sec=0;
    this.bar = document.getElementById('myLinks');
    document.getElementById('timeCounter').innerHTML = 9 + ":" + 59;
    var self=this;
  }
  initialAccess(){
    document.getElementsByClassName('total-que').innerHTML=' ';
    document.getElementById("optionBtn").innerHTML=' ';
    document.getElementsByClassName('total-que').innerHTML=' ';
  }
  //navbar icon start
  barAccess() {
    if (this.bar.style.display == "block") {
      this.bar.style.display = "none";
    } else {
      this.bar.style.display = "block";
    }
  }
  //navbar icon end
  //countDown start
  startTimer() {
    let presentTime = document.getElementById('timeCounter').innerHTML;
    let timeArray = presentTime.split(/[:]+/);
    let m = timeArray[0];
    this.sec=timeArray[1]-1;
      if (this.sec < 10 && this.sec >= 0) {
          this.sec = "0" + this.sec;
        }
        if (this.sec < 0) {
          this.sec = "59";
        }
    if (this.sec == 59) {
      if(m!==0){
        m = m - 1;
      }
    }
    document.getElementById('timeCounter').innerHTML = m + ":" + this.sec;
    this.st=setTimeout(()=>{this.startTimer();}, 1000);
  }
  endTimer(){
    clearInterval(this.st);
  }
}
let userAns=new Array();
$.fn.clickedOption=function(id, que, qset,qid) {
    userAns[que] ={"opid":id,"q_set":qset,"qid":qid,"ans":$('#'+id).val()};
    for (i = 1; i <= 4; i++) {
      if (i != id) {
        $('#'+i).css('border' , "solid");
        $('#'+i).css('border-color' , "white");
      } else {
        $('#'+id).css('border' , "solid");
        $('#'+id).css('outline' , "none");;
        $('#'+id).css('border-color' ,"#374176");
        localStorage.setItem("ans",JSON.stringify(userAns));
      }
    }
  };
$(document).ready(function() {
  let qcount = 8,op = 4,count = 0,nextPrev = 1,ansRet,topic='';
  let opArr=['a','b','c','d'];
  let gradeMsg = ["Improve!!", "GOOD", "GREAT!!"];
  let checkRepeat = new Array();
  let qo=new QuizOn();
  checkRepeat = [];
  $('.topic').click(function(){
    let id=$(this).attr('id');
    let value=$('#'+id).attr('value');
    $(this).css('background','green');
    $(this).css('color','white');
    $('.topic').hide();
    $('#'+id).show();
    topic=value;
  });
  /*initial load start*/
  let initialLoad=function(){
    $('.total-que').html(qcount);
    $("#optionBtn").empty();
    $('.questions').html(' ');
    $('#startModal').modal('show');
  };
  initialLoad();
  /*initial load end*/
  /*question load  start*/
  $('.play-btn').click(function() {
      $('#startModal').modal('hide');
    });
/*question load  end*/

/*start play*/
$('.start-btn').click(function() {
    if(topic!==''){
      let topicData={"topic":topic};
        $.ajax({
             url:'http://localhost:5020/ranQue/',
             data:JSON.stringify(topicData),
             type:'POST',
             dataType : "json",
             contentType: "application/json"
           }).done(function(data) {
               localStorage.setItem('qSet',JSON.stringify(data));
               $('#selectTopic').css("display", "none");
               $('#instruction,#timeCounter').css("display", "block");
               qo.startTimer();
           });
           getQuestions(1);
    }
    else{
      alert('Select quiz Topic');
    }
  });
/*start play*/
/*question-option show start*/
let getQuestions = function(qc) {
    $("#optionBtn").empty();
    $('.questions').html(' ');
    let retrievedObject = localStorage.getItem("qSet");
    let parsedObject = JSON.parse(retrievedObject);
    $('.questions').html(parsedObject[qc-1].q);
    $('.question-number').html('Question ' + qc + '/');
    for (j = 1; j <= op; j++) {
    let btn = '<div class="">' + '<input id="' + j +'" type="button" class="option" onclick="$(this).clickedOption(' + j + ',' + (qc-1) +','+'\''+parsedObject[qc-1].qset+'\''+','+parsedObject[qc-1].qid +');" name="Option" value="' + parsedObject[qc-1][opArr[j-1]] + '"/>' + '</div>';
    $('#optionBtn').append(btn).last();
  }
}
/*question-option show end*/
/*next question start*/
  $('.next').click(function() {
    nextPrev += 1;
    if (nextPrev <= qcount) {
      $('.prev').css("display", "block");
      $("#optionBtn").empty();
      getQuestions(nextPrev);
      if (nextPrev === qcount) {
        $('.next').css("display", "none");
        $('.submit-btn,.prev').css("display", "block");
      }
      if(JSON.stringify(userAns[nextPrev-1])!==undefined){
          let sop=JSON.stringify(userAns[nextPrev-1].opid);
          $("#"+parseInt(sop)).css("border","solid");
          $("#"+parseInt(sop)).css("outline","0 !important");
          $("#"+parseInt(sop)).css("outline","none");
          $("#"+parseInt(sop)).css("border-color","green");
      }
    } else {
      alert('You have seen all questions');
    }
  });
/*next question end*/
/*instruction to next start*/
  $('.next-go').click(function() {
  $('#instruction').css("display", "none");
  $('#questDiv').css("display", "block");
  getQuestions(1);
  });
/*instruction to next end*/
  /*prev question start*/
  $('.prev').click(function() {
    nextPrev -= 1;
    if (nextPrev > 0) {
      $("#optionBtn").empty();
      getQuestions(nextPrev);
      $('.next').css("display","block");
      $('.submit-btn').css("display","none");
      if(JSON.stringify(userAns[nextPrev-1])!==undefined){
          let sop=JSON.stringify(userAns[nextPrev-1].opid);
          $("#"+parseInt(sop)).css("border","solid");
          $("#"+parseInt(sop)).css("outline","0 !important");
          $("#"+parseInt(sop)).css("outline","none");
          $("#"+parseInt(sop)).css("border-color","green");
      }
    } else {
      nextPrev = 0;
      $('.prev').css("display", "none");
      alert('This is the first question');
    }
  });
/*prev question end*/
  $("#submitAns").click(function() {
  $("#userScore").css("display", "block");
  $("#questDiv,.timeCounter").css("display", "none");
  $(".timer-count").html('00:00');
  qo.endTimer();
  let point = 0;
  let ans=localStorage.getItem('ans');
  $.ajax({
    type:'POST',
    dataType: 'json',
    contentType: "application/json",
    data:ans,
    url:'http://localhost:5020/checkAns'
  }).done((data)=>{
   //pointWithAns=JSON.parse(data);
  // console.log(data.quizAnswars);
   //console.log(data.quizPoint);
   point=parseInt(data.quizPoint);
   localStorage.setItem('quizAnswars',JSON.stringify(data.quizAnswars));
     if (point < 5) {
       $('.grade').html(gradeMsg[0]);
     } else if (point == 5) {
       $('.grade').html(gradeMsg[1]);
     } else if (point > 5) {
       $('.grade').html(gradeMsg[2]);
     }
     $('.score-point').html(`${point}/${qcount}`);
    }).fail((xhr, textStatus, errorThrown)=>{
    console.log("ERROR: ",xhr.responseText)
    return xhr.responseText;
});
  });
  /*quit start*/
  $('.quit-btn').click(function() {
    $('#myModal').modal('show');
  });
  $('#ok').click(function() {
    localStorage.clear();
    $('#myModal').modal('hide');
    location.reload();
  });
  /*quit stop*/
  $('.review-ans').click(function() {
    if($('#reviewAns').css('display') === 'none'){
     $('#reviewAns').css('display','block');
     $('.review-ans').html('Close Review Answers');
     let quizQuestions=JSON.parse(localStorage.getItem("qSet"));
     let userAns=JSON.parse(localStorage.getItem("ans"));
     let quizAns=JSON.parse(localStorage.getItem("quizAnswars"));
     for(let i=0;i<qcount;i++){
       let review='<div class="row d-flex d-flex align-items-center flex-column">'+
         '<p id="quizQue" class="questions">'+(i+1)+') '+quizQuestions[i].q+'</p>'+
       '<div class="">Your Answer: <input id="" type="button" class="option" name="Option" value="'+userAns[i].ans+'"/></div>'+
       '<div class="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Answer: <input id="" type="button" class="option" name="Option" value="'+quizAns[i].ans+'"/></div></div>';
       $('#reView').append(review).last();
     }
  } else {
    $('#reviewAns').css('display','none');
    $('.review-ans').html('Open Review Answers');
  }
  //  location.reload();
  });
});
