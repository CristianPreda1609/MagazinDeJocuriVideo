
window.addEventListener("load",function(){
    this.document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`

    }


    

    document.getElementById("filtrare").addEventListener("click", function(){
        let inpNume= document.getElementById("inp-nume").value.toLowerCase().trim()

        let vRadio = document.getElementsByName("gr_rad")
        let inpCalorii;
        for(let r of vRadio){
            if(r.checked){
                inpCalorii = r.value;
                break;
            }
        }

        let minCalorii, maxCalorii
        if(inpCalorii!="toate"){
            let aux=inpCalorii.split(":")
            minCalorii = parseInt(aux[0])
            maxCalorii = parseInt(aux[1])
                
        }

        valNume = document.getElementsByClassName("val-nume")
        


        let inpPret=parseInt(document.getElementById("inp-pret").value)

        let inpCateg=document.getElementById("inp-categorie").value.toLowerCase().trim()

        produse = document.getElementsByClassName("produs")
        for(let produs of produse ){
            let valNume = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim()
            let cond1= valNume.startsWith(inpNume)

            let valCalorii=parseInt(produs.getElementsByClassName("val-calorii")[0].innerHTML)
            let cond2=(inpCalorii=="toate" || (minCalorii<=valCalorii && valCalorii<maxCalorii))

            let valPret=parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML)
            let cond3=(valPret>inpPret)

            let valCateg=  produs.getElementsByClassName("val-categorie")[0].innerHTML.toLowerCase().trim()
            let cond4=(inpCateg=="toate"||inpCateg==valCateg)


            if(cond1 && cond2 && cond3 && cond4){
                produs.style.display="block";
            }
            else{
                produs.style.display="none";
            }
        }
    })
    document.getElementById("resetare").onclick= function(){
                    
        document.getElementById("inp-nume").value="";
        
        document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
        document.getElementById("inp-categorie").value="toate";
        document.getElementById("i_rad4").checked=true;
        var produse=document.getElementsByClassName("produs");
        document.getElementById("infoRange").innerHTML="(0)";
        for (let prod of produse){
            prod.style.display="block";
    }
}}


)
