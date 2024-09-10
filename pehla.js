const endDate= new Date(" 8 Sep, 2024 01:06:50").getTime();
const newDate =new Date().getTime()

let x= setInterval(function updateTimer() {
    const now=new Date().getTime()

    const covered=now - newDate
    const pendtime=endDate-now

    oneDayInMilis=24*60*60*1000
    oneHourInMilis=60*60*1000
    oneMinInMilis=60*1000

    const day=Math.floor(pendtime / (oneDayInMilis))
    const hrs=Math.floor((pendtime % (24*60*60*1000)/(oneHourInMilis)))
    const mins=Math.floor((pendtime%(60*60*1000)/(oneMinInMilis)))
    const secs=Math.floor((pendtime%(60*1000))/1000)

    document.getElementById("days").innerHTML=day
    document.getElementById("hours").innerHTML=hrs
    document.getElementById("minutes").innerHTML=mins
    document.getElementById("seconds").innerHTML=secs
    
    const TotalD=endDate-newDate
    const perc= (covered/TotalD)*100

    document.getElementById("progress-bar").style.width=perc+"%"

    if (pendtime<=0) {
        clearInterval(x)
        document.getElementById("countdown").innerHTML="EXPIRED"
        document.getElementById("progress-bar").style.width="100%"
    }
},1000)
