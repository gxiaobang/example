
window.onload=function ()
{
	var cvs=document.getElementById('cvs'),
		ctx=cvs.getContext('2d');

	function rads(angle)
    {
        return Math.PI/180*angle;
    }

    var hL=40,mL=60,sL=80;
    
    // 圆
    function circle()
    {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle='#aaa';
        ctx.arc(cvs.width/2, cvs.height/2, 100, 0, rads(360));
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle='#fff';
        ctx.arc(cvs.width/2, cvs.height/2, 95, 0, rads(360));
        ctx.fill();
        ctx.restore();
    }

    // 刻度
    function dial()
    {
        var rad;
        for(var i=1;i<=12;i++)
        {
            rad=rads(i*30);
            ctx.textBaseline='middle';
            ctx.textAlign='center';
            ctx.font='20px Arial';
            ctx.fillText(i, cvs.width/2+86*Math.sin(rad), cvs.height/2-86*Math.cos(rad));
        }
    }

    // 时间
    function time()
    {
        var date=new Date(),
            hours=date.getHours(),
            minutes=date.getMinutes(),
            seconds=date.getSeconds(),
            ap;


        if(hours>12)
        {
            hours-=12;
            ap='PM';
        }
        else
        {
            ap='AM';
        }

        ctx.save();
        ctx.textBaseline='middle';
        ctx.textAlign='center';
        ctx.font='16px Arial';
        ctx.fillText(ap, cvs.width/2, cvs.height/2+30);
        ctx.restore();

        var rad;
        // 时针
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth='7';
        ctx.lineCap='round';
        ctx.moveTo(cvs.width/2, cvs.height/2);

        rad=rads(hours/12*360+minutes/60*30+seconds/60*6);
        ctx.lineTo(cvs.width/2+hL*Math.sin(rad), cvs.height/2-hL*Math.cos(rad));
        ctx.stroke();
        ctx.restore();

        // 分针
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth='5';
        ctx.lineCap='round';

        ctx.moveTo(cvs.width/2, cvs.height/2);

        rad=rads(minutes/60*360+seconds/60*6);
        ctx.lineTo(cvs.width/2+mL*Math.sin(rad), cvs.height/2-mL*Math.cos(rad));
        ctx.stroke();
        ctx.restore();

        // 秒针
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth='3';
        ctx.lineCap='round';

        ctx.moveTo(cvs.width/2, cvs.height/2);

        rad=rads(seconds/60*360);
        ctx.lineTo(cvs.width/2+mL*Math.sin(rad), cvs.height/2-mL*Math.cos(rad));
        ctx.stroke();
        ctx.restore();
    }

    function update()
    {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        circle();
        dial();
        time();
        setTimeout(update, 1000);
    }
    update();
};
