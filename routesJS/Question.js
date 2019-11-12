class Question
{
  constructor(count){
    this.count=count;
    this.qno=[];
    this.questions=[];
    this.point=0;
    this.ansSet=[];
    this.ansWithPoint=[];
  }
  randomQueSet(qsetId,question,length){
    let no=Math.floor(Math.random() * (length-1));
    if(!this.qno.includes(no) && no>0)
    {
      this.qno.push(no);
        let q=question.filter(item => item.qid===no).map((qset) => {
        this.questions[this.count-1]={"q":qset.question,"a":qset[1],"b":qset[2],"c":qset[3],"d":qset[4],"qset":qsetId,"qid":qset.qid};
      });
        this.count-=1;
        if(this.count===0){
          return this.questions;
        }
        if(this.count>0){
           return this.randomQueSet(qsetId,question,length);
         }
    }else {
        return this.randomQueSet(qsetId,question,length);
    }
  }
  checkAns(qsetId,question,length,uans,ual){
    if(ual===-1){
     return this.point;
    }
    else{
      if(uans[ual]!==null){
        let uaQid=uans[ual].qid,uaAns=uans[ual].ans;
        this.ansWithPoint=question.filter(item => item.qid===uaQid).map((qset)=>{
         if(qset.ans===uaAns){
              this.ansSet[ual]={qid:qset.qid,ans:qset.ans};
              this.point+=2;ual-=1;
              return this.checkAns(qsetId,question,length,uans,ual);
         }
         else{
              this.ansSet[ual]={qid:qset.qid,ans:qset.ans};
              ual-=1;
             return this.checkAns(qsetId,question,length,uans,ual);
           }
        });
      return {quizAnswars:this.ansSet,quizPoint:this.point};
      }
      else {
        this.ansSet[ual]={qid:qsetId,ans:'Not Attained'};
        ual-=1;
        return this.checkAns(qsetId,question,length,uans,ual);
      }
    }
  }
}
module.exports=Question;
