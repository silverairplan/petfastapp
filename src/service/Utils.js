
export class Utils
{
    
    
    static isOkPass(p){
        var anUpperCase = /[A-Z]/;
        var aLowerCase = /[a-z]/; 
        var aNumber = /[0-9]/;
        var aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;
        var obj = {};
        obj.result = true;
    
        if(p.length < 6){
            obj.result=false;
            obj.error="Not long enough!"
            return obj;
        }
    
        var numUpper = 0;
        var numLower = 0;
        var numNums = 0;
        var numSpecials = 0;
        var aLetter = 0;
        for(var i=0; i<p.length; i++)
        {
            if(anUpperCase.test(p[i]) || aLowerCase.test(p[i]))
                aLetter++;
            // else if(aLowerCase.test(p[i]))
            //     numLower++;
            else if(aNumber.test(p[i]))
                numNums++;
            // else if(aSpecial.test(p[i]))
            //     numSpecials++;
        }
    
        //if(numUpper < 2 || numLower < 2 || numNums < 2 || numSpecials <2){
        if(aLetter ==0 || numNums == 0){
            obj.result=false;
            obj.error="Wrong Format!";
            return obj;
        }
        
        return obj;
    }


    static isValidEmail(email)
    {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        return !email || !reg.test(email);
    }

    //returns the day of week
    static getWeekDay(date)
    {
        var weekday = new Array(7);
        weekday[0] =  "Domingo";
        weekday[1] = "Segunda-feira";
        weekday[2] = "Terça-feira";
        weekday[3] = "Quarta-feira";
        weekday[4] = "Quinta-feira";
        weekday[5] = "Sexta-feira";
        weekday[6] = "Sábado";

        return weekday[date.getDay()];
    }
}