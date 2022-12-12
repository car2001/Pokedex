document.addEventListener('DOMContentLoaded',function(){
    
    //#region Observador de imagenes task
    const imgOptions = {};
    const imgObserver = new IntersectionObserver((entries,imgObserver)=>{
        entries.forEach((entry)=>{
            if(!entry.isIntersecting) return;
            const img = entry.target;
            var dataImage = img.getAttribute("data-image")
            img.src= dataImage;
            imgObserver.unobserve(img)
        })
    },imgOptions);
    
    //#endregion

    //#region  CONSUMO DE API CON FETCH
    const fetchPokemons = async(endpoint)=>{
        let data;
        try {
            const response = await fetch(endpoint,{
                method: "GET",
                headers : {
                    "Content-Type":"application/json"
                }
            })

            data = await response.json();


        }catch(error){
            console.log(error)
        }

        return data.pokemon_species
    }

    //#endregion

    //#region Ordenar Numeros de PKM
    function orderNumber(str){
        var mySubstring = str.substring(
            str.lastIndexOf("s/")+2,
            str.lastIndexOf("/")
        )

        return mySubstring;
    }
    //#endregion

    //#region Agregar PKMS al HTML
    async function getPokemons(number,toggle){
        let endpoint = `https://pokeapi.co/api/v2/generation/${number}/`;

        var container = document.getElementById("container")

        container.innerHTML = ""

        let pokemons = []

        pokemons = await fetchPokemons(endpoint)

        for(let j =0; j< pokemons.length;j++){
            pokemons[j].nr = orderNumber(pokemons[j].url)
        }

        pokemons.sort((a,b)=> a.nr-b.nr)

        pokemons.forEach(pokemon=>{
            let numero3decimales = orderNumber(pokemon.url);

            if(numero3decimales< 10){
                numero3decimales = "0" + numero3decimales
            }

            if(numero3decimales<100){
                numero3decimales = "0" + numero3decimales
            }

            let divItem = document.createElement("li");
            var img = new Image();
            divItem.classList.add("item");
            const toggleUrl = toggle? "https://serebii.net/pokemongo/pokemon/" : "https://serebii.net/pokemongo/pokemon/";

            img.src="./img/pokebola.gif";


            const urlImage = `${toggleUrl}${numero3decimales}.png`;

            img.setAttribute("data-image",urlImage)
            img.setAttribute("class","pokeimage");
            img.setAttribute("alt",pokemon.name);

            
            divItem.innerHTML = `<div>${orderNumber(pokemon.url)}-${pokemon.name}</div>`;
            divItem.appendChild(img)
            container.appendChild(divItem);

            imgObserver.observe(img)
        });


        
    }
    //#endregion


    //#region Agregar Generaciones
    var numero = 1;
    getPokemons(numero)
    var toggle = false;
  
    btnicono.addEventListener("click", function(){
        toggle = !toggle;
        getPokemons(numero,toggle)
    })

    var geners = ["generation-1","generation-2","generation-3","generation-4","generation-5","generation-6","generation-7"];

    var filters = document.getElementById('filters');
    var gen = "";

    for(let i = 0; i < geners.length; i++){
        gen += `<input type="radio" class="radio-gens" id=${geners[i]} name="generation" value=${i+1} checked>
        <label for=${geners[i]} class="label-gens">${geners[i]}</label>`
    }

    filters.innerHTML = gen
    filters.addEventListener("click",function(e){
        let target = e.target.type;
        if(target =="radio"){
            getPokemons(e.target.value,toggle)
            title.innerHTML = "Pokemon " + e.target.id;
            console.log(this.title.innerHTML)
        }
    })
    //#endregion

});