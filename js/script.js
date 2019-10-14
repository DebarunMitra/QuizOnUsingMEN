// Author: Debarun Mitra
// Technology used: HTML, CSS, JavaScript, JQuery, Bootstrap
// objective: Create a quiz application
class QuizOn{
  constructor(){
    this.userAns = new Array();
    this.st=0;
    this.sec=0;
    this.bar = document.getElementById('myLinks');
    document.getElementById('timeCounter').innerHTML = 9 + ":" + 59;
  }
  initialAccess(){
    document.getElementsByClassName('total-que').innerHTML=' ';
    document.getElementById("optionBtn").innerHTML=' ';
    document.getElementsByClassName('total-que').innerHTML=' ';
    //document.getElementById('startModal').showModal();
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
  // checkSecond(){
  // //  this.sec=second;
  //   if (this.sec < 10 && this.sec >= 0) {
  //     this.sec = "0" + this.sec;
  //   } // add zero in front of numbers < 10
  //   if (this.sec < 0) {
  //     this.sec = "59";
  //   }
  //   console.log(this.sec);
  //   return this.sec;
  // }
  startTimer(){
    this.sec+=1;
    console.log(this.sec);
    // let presentTime = document.getElementById('timeCounter').innerHTML;
    // let timeArray = presentTime.split(/[:]+/);
    // let m = timeArray[0];
    // this.sec=parseInt(timeArray[1])-1;
    // if (this.sec < 10 && this.sec >= 0) {
    //     this.sec = "0" + this.sec;
    // }
    // else if(this.sec < 0) {
    //     this.sec = "59";
    // }
    // else{
    //   this.sec=this.sec;
    // }
    //   console.log(this.sec);
    // if (this.sec === 59) {
    //   if(m!==0){
    //     m = m - 1;
    //   }
    // }
    // document.getElementById('timeCounter').innerHTML = m + ":" + this.sec;
    setTimeout(this.startTimer,0.5);
  }
  //countDown stop
  //user ans collection start
  clickedOption(id, que, qset,qid) {
    let optionVal = document.getElementById(id);
    this.userAns[que] ={"opid":id,"q_set":qset,"qid":qid,"ans":optionVal.value};
    for (i = 1; i <= 4; i++) {
      if (i != id) {
        document.getElementById(i).style.border = "solid";
        document.getElementById(i).style.borderColor = "white";
      } else {
        optionVal.style.border = "solid";
        optionVal.style.outline = "none";
        optionVal.style.borderColor = "#374176";
        localStorage.setItem("ans",JSON.stringify(this.userAns));
      }
    }
  }
  //user ans collection end
}
   let qo=new QuizOn();
  // qo.startTimer();
   //setTimeout(,10000);
   qo.initialAccess();
