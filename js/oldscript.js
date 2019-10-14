// Author: Debarun Mitra
// Technology used: HTML, CSS, JavaScript, JQuery, Bootstrap
// objective: Create a quiz application
//navbar icon start
let bar = document.getElementById('myLinks');
const gradeMsg = ["Improve!!", "GOOD", "GREAT!!"]
let userAns = new Array();let st;
function barAccess() {
  if (bar.style.display == "block") {
    bar.style.display = "none";
  } else {
    bar.style.display = "block";
  }
}
//navbar icon end

//countDown start
document.getElementById('timeCounter').innerHTML = 9 + ":" + 59;
function startTimer() {
  let presentTime = document.getElementById('timeCounter').innerHTML;
  let timeArray = presentTime.split(/[:]+/);
  let m = timeArray[0];
  let s = checkSecond((timeArray[1] - 1));
  if (s == 59) {
    if(m!==0){
      m = m - 1;
    }
  }
  document.getElementById('timeCounter').innerHTML = m + ":" + s;
  st=setTimeout(startTimer, 1000);
}
function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {
    sec = "0" + sec
  }; // add zero in front of numbers < 10
  if (sec < 0) {
    sec = "59"
  };
  return sec;
}
//countDown stop

//user ans collection start
function clickedOption(id, que, qset,qid) {
  let optionVal = document.getElementById(id);
  userAns[que] ={"opid":id,"q_set":qset,"qid":qid,"ans":optionVal.value};
  for (i = 1; i <= 4; i++) {
    if (i != id) {
      document.getElementById(i).style.border = "solid";
      document.getElementById(i).style.borderColor = "white";
    } else {
      optionVal.style.border = "solid";
      optionVal.style.outline = "none";
      optionVal.style.borderColor = "#374176";
      localStorage.setItem("ans",JSON.stringify(userAns));
    }
  }
}
//user ans collection end

$(document).ready(function() {
  let qcount = 10,op = 4,count = 0,nextPrev = 1;
  let opArr=['a','b','c','d'];
  let checkRepeat = new Array();
  checkRepeat = [];
  $('.total-que').html(qcount);
  $("#optionBtn").empty();
  $('.questions').html(' ');
  $('#startModal').modal('show');

  /*question load  start*/
  $('.start-btn').click(function() {
      $.ajax({
           url:'http://localhost:5020/ranQue/'
         }).done(function(data) {
             $('#startModal').modal('hide');
             $('#instruction').css("display", "block");
             localStorage.setItem('qSet',data);
             startTimer();
         });
         getQuestions(1);
    });
    /*question load  end*/

/*question-option show start*/
let getQuestions = function(qc) {
    $("#optionBtn").empty();
    $('.questions').html(' ');
    let retrievedObject = localStorage.getItem("qSet");
    let parsedObject = JSON.parse(retrievedObject);
    $('.questions').html(parsedObject[qc-1].q);
    $('.question-number').html('Question ' + qc + '/');
    for (j = 1; j <= op; j++) {
    let btn = '<div class="">' + '<input id="' + j +'" type="button" class="option" onclick="clickedOption(' + j + ',' + (qc-1) +','+'\''+parsedObject[qc-1].qset+'\''+','+parsedObject[qc-1].qid +')" name="Option" value="' + parsedObject[qc-1][opArr[j-1]] + '"/>' + '</div>';
    $('#optionBtn').append(btn).last();
  }
}
/*question-option show end*/
/*show score start*/
//let
/*show score end*/
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
          console.log('from next:['+nextPrev+']'+JSON.stringify(userAns[nextPrev-1].opid));
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
        //  console.log('from next:['+nextPrev+']'+JSON.stringify(userAns[nextPrev-1].opid));
          let sop=JSON.stringify(userAns[nextPrev-1].opid);
          console.log(parseInt(sop));
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
  clearInterval(st);
  let point = 0;
  let ans=localStorage.getItem('ans');
  $.ajax({
    type:'POST',
    dataType: 'json',
    contentType: "application/json",
    data:ans,
    url:'http://localhost:5020/checkAns'
  }).done((data)=>{
   point=parseInt(data);
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
    location.reload();
  });
});
